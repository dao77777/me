import { embed, embedMany } from 'ai';
import { cosineDistance, desc, gt, sql } from 'drizzle-orm';
import { embeddings } from '../db/schema/embeddings';
import { db } from '@/lib/db';
import { customAI } from './custom-ai-provider';
import { insertResourceSchema, NewResourceParams, resources } from '../db/schema/resources';
import { embeddings as embeddingsTable } from '../db/schema/embeddings';

const embeddingModel = customAI.textEmbeddingModel('text-embedding-v3');

const generateChunks = (input: string): string[] => {
  return input
    .trim()
    .split('.')
    .filter(i => i !== '');
};

export const generateEmbeddings = async (
  value: string,
): Promise<Array<{ embedding: number[]; content: string }>> => {
  const chunks = generateChunks(value);
  const { embeddings } = await embedMany({
    model: embeddingModel,
    values: chunks,
  });
  return embeddings.map((e, i) => ({ content: chunks[i], embedding: e }));
};

export const generateEmbedding = async (value: string): Promise<number[]> => {
  const input = value.replaceAll('\\n', ' ');
  const { embedding } = await embed({
    model: embeddingModel,
    value: input,
  });
  return embedding;
};

export const createResource = async (input: NewResourceParams) => {
  try {
    const { content } = insertResourceSchema.parse(input);

    const [resource] = await db
      .insert(resources)
      .values({ content })
      .returning();

    const embeddings = await generateEmbeddings(content);
    await db.insert(embeddingsTable).values(
      embeddings.map(embedding => ({
        resourceId: resource.id,
        ...embedding,
      })),
    );

    return 'Resource successfully created and embedded.';
  } catch (error) {
    return error instanceof Error && error.message.length > 0
      ? error.message
      : 'Error, please try again.';
  }
};

export const findRelevantContent = async (userQuery: string) => {
  const userQueryEmbedded = await generateEmbedding(userQuery);
  const similarity = sql<number>`1 - (${cosineDistance(
    embeddings.embedding,
    userQueryEmbedded,
  )})`;
  const similarGuides = await db
  .select({ name: embeddings.content, similarity })
  .from(embeddings)
  .where(gt(similarity, 0.5))
  .orderBy(t => desc(t.similarity))
  .limit(4);
  console.log('similarity', similarGuides);
  return similarGuides;
};