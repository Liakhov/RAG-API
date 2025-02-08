import {Ollama} from '@langchain/ollama';

export const initOllama = () => {
    return new Ollama({
        baseUrl: process.env.LLM_URL,
        model: process.env.LLM_MODEL,
    });
};