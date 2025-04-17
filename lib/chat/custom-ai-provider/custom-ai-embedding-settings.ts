import { OpenAICompatibleEmbeddingSettings } from '@ai-sdk/openai-compatible';

export type CustomAIEmbeddingModelId =
  | "text-embedding-v3"
  | "embedding-2"
  | "embedding-3"
  | (string & {});

export type CustomAIEmbeddingMatrix = {
  baseURL: string;
  apiKey?: string;
  modelId: CustomAIEmbeddingModelId;
}[]

export interface CustomAIEmbeddingSettings extends OpenAICompatibleEmbeddingSettings {
  // Add any custom settings here
}

export const customAIEmbeddingMatrix: CustomAIEmbeddingMatrix = [
  {
    baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
    apiKey: process.env.DASHSCOPE_API_KEY,
    modelId: "text-embedding-v3",
  },
  {
    baseURL: "https://open.bigmodel.cn/api/paas/v4",
    apiKey: process.env.BIGMODEL_API_KEY,
    modelId: "embedding-2"
  },
  {
    baseURL: "https://open.bigmodel.cn/api/paas/v4",
    apiKey: process.env.BIGMODEL_API_KEY,
    modelId: "embedding-3"
  } 
]