import { OpenAICompatibleCompletionSettings } from '@ai-sdk/openai-compatible';

export type CustomAICompletionModelId =
  | (string & {});

export type CustomAICompletionMatrix = {
  baseURL: string; // 修改为 baseURL
  apiKey?: string;
  modelId: CustomAICompletionModelId;
}[]

export interface CustomAICompletionSettings extends OpenAICompatibleCompletionSettings {
  // Add any custom settings here
}

export const customAICompletionMatrix: CustomAICompletionMatrix = [

]