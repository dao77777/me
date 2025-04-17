import { index, pgTable, text, vector } from 'drizzle-orm/pg-core';
import { resources } from './resources';

export const embeddings = pgTable(
  'embeddings',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    resourceId: text('resource_id').references(
      () => resources.id,
      { onDelete: 'cascade' },
    ),
    content: text('content').notNull(),
    embedding: vector('embedding', { dimensions: 1024 }).notNull(),
  },
  table => [
    index('embeddingIndex').using('hnsw', table.embedding.op('vector_cosine_ops'))
  ]
);