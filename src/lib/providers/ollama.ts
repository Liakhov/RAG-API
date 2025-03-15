import { Ollama, OllamaEmbeddings } from '@langchain/ollama';
import { LLMModel } from '../models/llm.model.js';

// Function to initialize the Ollama instance
export const initOllama = (llmModel: LLMModel | undefined): Ollama => {
  const baseUrl = process.env.LLM_URL;
  const model = llmModel || process.env.LLM_MODEL;

  // Validate required environment variables
  if (!baseUrl || !model) {
    throw new Error('Missing required environment variables: LLM_URL and LLM_MODEL must be set.');
  }

  try {
    const ollama = new Ollama({
      baseUrl,
      model
    });
    return ollama;
  } catch (error: unknown) {
    console.error('Failed to initialize Ollama:', error);
    process.exit(1);
  }
};

export const getOllamaEmbeddings = (): OllamaEmbeddings => {
  return new OllamaEmbeddings({
    baseUrl: process.env.LLM_EMBEDDINGS_URL,
    model: process.env.LLM_EMBEDDINGS_MODEL
  });
};

export const embedQuery = async (query: string) => {
  const embeddings = getOllamaEmbeddings();
  return await embeddings.embedQuery(query);
};

export const embedDocuments = async (content: string[]) => {
  const embeddings = getOllamaEmbeddings();
  return await embeddings.embedDocuments(content);
};
