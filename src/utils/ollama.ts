import { Ollama } from '@langchain/ollama';

// Function to initialize the Ollama instance
export const initOllama = () => {
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
