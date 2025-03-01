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
    const ollama = new Ollama({
      baseUrl: llmUrl,
      model: llmModel
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
