import { Ollama } from '@langchain/ollama';

export type LLMModel = 'llama3.1' | 'mistral:7b' | 'gemma3:4b';
export type LLMInstance = Ollama;