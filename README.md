## Simple RAG Implementation in Node.js

This project implements a basic Retrieval-Augmented Generation (RAG) system using Node.js and TypeScript. RAG combines retrieval-based and generative approaches to provide accurate and contextually relevant responses.

### Prerequisites

- **Node.js** (v16 or higher)
- **TypeScript**
- **npm** or **yarn** package manager
- **Docker & Docker Compose** (required to run ChromaDB and Ollama)
- **Ollama** (with at least one LLM model installed, e.g., `llama3`)
- **Ollama embeddings model** (`nomic-embed-text`)

### Using Ollama and ChromaDB with Docker

Ollama and ChromaDB are both managed via Docker. Ensure Docker is running before starting the application.

#### Docker Commands

```json
"docker:start": "docker-compose up -d",
"docker:stop": "docker-compose down",
"docker:restart": "docker-compose down && docker-compose up -d",
"docker:logs": "docker-compose logs -f"
```

### Environment Variables

Before running the application, configure the necessary environment variables for Ollama in your `.env` file.

### Usage

1. **Start Docker services (Ollama & ChromaDB)**:

   ```sh
   yarn docker:start
   ```

2. **Compile TypeScript to JavaScript**:

   ```sh
   yarn build
   ```

3. **Run the application**:

   ```sh
   yarn start
   ```

### API Routes

The application provides several API endpoints to interact with the LLM and documents.

#### Chat Endpoints

- **POST**: Chat directly with the LLM.
- **POST**: Chat with a specific document by its ID.
- **POST**: Chat with all stored documents.

#### File Upload Endpoints

- **POST**: Upload a PDF file.
- **POST**: Upload a TXT file.
- **POST**: Upload a plain text string.

#### Document Management Endpoints

- **GET**: Retrieve a list of all documents.
- **GET**: Retrieve a specific document by its ID.
- **DELETE**: Delete a document by its ID.

### References & Inspiration

- [Building a RAG API with Node.js](https://medium.com/@lynnthelight/building-a-rag-api-with-nodejs-b7a2016dfce9)
- [Vector Databases Overview](https://medium.com/google-cloud/vector-databases-are-all-the-rage-872c888fa348)
- [LangChain RAG Tutorial](https://js.langchain.com/docs/tutorials/rag)
- [LangChain QA with Chat History](https://js.langchain.com/docs/tutorials/qa_chat_history)

