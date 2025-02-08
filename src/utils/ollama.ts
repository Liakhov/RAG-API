import {ChatOllama} from '@langchain/ollama';

export const initChatOllama = () => {
    return new ChatOllama({
        baseUrl: "http://localhost:11434",
        model: "llama3"
    });
}