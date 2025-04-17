import { LanguageModelV1, EmbeddingModelV1 } from '@ai-sdk/provider';
import {
  OpenAICompatibleChatLanguageModel,
  OpenAICompatibleCompletionLanguageModel,
  OpenAICompatibleEmbeddingModel,
} from '@ai-sdk/openai-compatible';
import {
  FetchFunction,
  loadApiKey,
  withoutTrailingSlash,
} from '@ai-sdk/provider-utils';
import { CustomAIChatMatrix, customAIChatMatrix, CustomAIChatModelId, CustomAIChatSettings } from './custom-ai-chat-settins';
import { customAICompletionMatrix, CustomAICompletionMatrix, CustomAICompletionModelId, CustomAICompletionSettings } from './custom-ai-completion-settings';
import { customAIEmbeddingMatrix, CustomAIEmbeddingMatrix, CustomAIEmbeddingModelId, CustomAIEmbeddingSettings } from './custom-ai-embedding-settings';

export interface CustomAIProviderSettings {
  /**
Example API key.
*/
  apiKey?: string;
  /**
Base URL for the API calls.
*/
  baseURL?: string;
  /**
Custom headers to include in the requests.
*/
  headers?: Record<string, string>;
  /**
Optional custom url query parameters to include in request urls.
*/
  queryParams?: Record<string, string>;
  /**
Custom fetch implementation. You can use it as a middleware to intercept requests,
or to provide a custom fetch implementation for e.g. testing.
*/
  fetch?: FetchFunction;
}

export interface CustomAIProvider {
  /**
Creates a model for text generation.
*/
  (
    modelId: CustomAIChatModelId,
    settings?: CustomAIChatSettings,
  ): LanguageModelV1;

  /**
Creates a chat model for text generation.
*/
  chatModel(
    modelId: CustomAIChatModelId,
    settings?: CustomAIChatSettings,
  ): LanguageModelV1;

  /**
Creates a completion model for text generation.
*/
  completionModel(
    modelId: CustomAICompletionModelId,
    settings?: CustomAICompletionSettings,
  ): LanguageModelV1;

  /**
Creates a text embedding model for text generation.
*/
  textEmbeddingModel(
    modelId: CustomAIEmbeddingModelId,
    settings?: CustomAIEmbeddingSettings,
  ): EmbeddingModelV1<string>;
}

export function createCustomAI(
  options: CustomAIProviderSettings = {},
): CustomAIProvider {
  interface CommonModelConfig {
    provider: string;
    url: ({ path }: { path: string }) => string;
    headers: () => Record<string, string>;
    fetch?: FetchFunction;
  }

  type CustomAIModelID = CustomAIChatModelId | CustomAICompletionModelId | CustomAIEmbeddingModelId;

  type ModelType = 'chat' | 'completion' | 'embedding';

  const getCommonModelConfig = <T extends CustomAIModelID>(modelId: T, modelType: ModelType): CommonModelConfig => {
    type ModelType2Matrix = {
      [k in ModelType]: CustomAIChatMatrix | CustomAICompletionMatrix | CustomAIEmbeddingMatrix;
    }

    const modelType2Matrix: ModelType2Matrix = {
      chat: customAIChatMatrix,
      completion: customAICompletionMatrix,
      embedding: customAIEmbeddingMatrix,
    }
    
    // console.log(modelType2Matrix[modelType], modelId, modelType2Matrix[modelType].find(v => v.modelId === modelId));

    const { apiKey, baseURL } = modelType2Matrix[modelType].find(v => v.modelId === modelId)!; // 修改为 baseURL
    return {
      provider: `customAI.${modelType}`,
      url: ({ path }) => {
        const url = new URL(`${withoutTrailingSlash(baseURL)}${path}`); // 修改为 baseURL
        if (options.queryParams) {
          url.search = new URLSearchParams(options.queryParams).toString();
        }
        return url.toString();
      },
      headers: () => ({
        Authorization: `Bearer ${loadApiKey({
          apiKey,
          environmentVariableName: 'DEFAULT_API_KEY',
          description: 'DEFAULT API key',
        })}`,
        ...options.headers,
      }),
      fetch: options.fetch,
    };
  };

  const createChatModel = (
    modelId: CustomAIChatModelId,
    settings: CustomAIChatSettings = {},
  ) => {
    const that = {
      modelId
    }
    return new OpenAICompatibleChatLanguageModel(modelId, settings, {
      ...getCommonModelConfig(modelId, 'chat'),
      defaultObjectGenerationMode: 'tool',
    });
  };

  const createCompletionModel = (
    modelId: CustomAICompletionModelId,
    settings: CustomAICompletionSettings = {},
  ) =>
    new OpenAICompatibleCompletionLanguageModel(
      modelId,
      settings,
      getCommonModelConfig(modelId, 'completion'),
    );

  const createTextEmbeddingModel = (
    modelId: CustomAIEmbeddingModelId,
    settings: CustomAIEmbeddingSettings = {},
  ) =>
    new OpenAICompatibleEmbeddingModel(
      modelId,
      settings,
      getCommonModelConfig(modelId, 'embedding'),
    );

  const provider = (
    modelId: CustomAIChatModelId,
    settings?: CustomAIChatSettings,
  ) => createChatModel(modelId, settings);

  provider.completionModel = createCompletionModel;
  provider.chatModel = createChatModel;
  provider.textEmbeddingModel = createTextEmbeddingModel;

  return provider;
}

// Export default instance
export const customAI = createCustomAI();