## Simple RAG Implementation in Node.js

This project implements a basic Retrieval-Augmented Generation (RAG) system using Node.js and TypeScript. RAG combines the power of retrieval-based and generative approaches to provide more accurate and contextually relevant responses.

### Prerequisites

- Node.js (v16 or higher)
- TypeScript
- npm or yarn package manager
- Docker & Docker Compose (required to run ChromaDB)
- Ollama - with at least one LLM model installed (e.g., llama3)
- Ollama embeddings model (nomic-embed-text)

### Environment Variables

Before running the application, ensure that you have set the necessary environment variables for Ollama in your `.env` file.

### Usage

1. Start Ollama service:

   Ensure Ollama is running before starting the application.

2. Start ChromaDB using Docker:

   `yarn chroma:start`

3. Compile TypeScript to JavaScript:

   `npx tsc`

4. Run the application:

   `node dist/app.js`

## Inspiration

- https://medium.com/@lynnthelight/building-a-rag-api-with-nodejs-b7a2016dfce9
- https://medium.com/google-cloud/vector-databases-are-all-the-rage-872c888fa348
- https://js.langchain.com/docs/tutorials/rag
- https://js.langchain.com/docs/tutorials/qa_chat_history