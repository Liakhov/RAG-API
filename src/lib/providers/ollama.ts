import { Ollama, OllamaEmbeddings } from '@langchain/ollama';

// Function to initialize the Ollama instance
export const initOllama = (): Ollama => {
  // Validate required environment variables
  const llmUrl = process.env.LLM_URL;
  const llmModel = process.env.LLM_MODEL;

  if (!llmUrl || !llmModel) {
    throw new Error('Missing required environment variables: LLM_URL and LLM_MODEL must be set.');
  }

  try {
    return new Ollama({
      baseUrl: llmUrl,
      model: llmModel
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to initialize Ollama: ${error.message}`);
    }
    throw new Error('Failed to initialize Ollama: Unknown error occurred');
  }
};

export const getOllamaEmbeddings = (): OllamaEmbeddings => {
  return new OllamaEmbeddings({
    baseUrl: process.env.LLM_URL,
    model: 'nomic-embed-text'
  });
};

export const embedQuery = async (query: string) => {
  const embeddings = getOllamaEmbeddings();
  return await embeddings.embedQuery(query);
};
