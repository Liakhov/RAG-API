import {Ollama} from "@langchain/ollama";

export const initOllama = () => {
    return new Ollama({
        baseUrl: "http://localhost:11434",
        model: "llama3"
    });
}