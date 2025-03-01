import { getOllamaEmbeddings } from '../providers/ollama.js';
import { Chroma } from '@langchain/community/vectorstores/chroma';
import { PromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';

import { ollama } from './../../app.js';
import { RAG_PROMPT, SIMPLIFY_QUESTION_PROMPT } from './prompt.js';

export const processQuestion = async (userQuestion: string, filter?: object): Promise<any> => {
  try {
    const ollamaEmbeddings = getOllamaEmbeddings();
    const vectorStore = await Chroma.fromExistingCollection(ollamaEmbeddings, {
      collectionName: 'documents',
      url: process.env.DB_URL
    });

    // Get retriever: pass the filter directly as argument
    const chromaRetriever = vectorStore.asRetriever({
      filter
    });

    // Convert user question into a standalone question
    const simpleQuestionChain = PromptTemplate.fromTemplate(SIMPLIFY_QUESTION_PROMPT)
      .pipe(ollama)
      .pipe(new StringOutputParser())
      .pipe(chromaRetriever);

    const documents = await simpleQuestionChain.invoke({ userQuestion });
    const combinedDocs = combineDocuments(documents);

    // Generate answer using retrieved context
    const answerChain = PromptTemplate.fromTemplate(RAG_PROMPT).pipe(ollama);

    const llmResponse = await answerChain.invoke({ context: combinedDocs, question: userQuestion });

    return {
      llmResponse,
      documents
    };
  } catch (error) {
    console.log('error', error);
    throw new Error((error as Error).message);
  }
};

export function combineDocuments(docs: { pageContent: string }[]): string {
  return docs.map(doc => doc.pageContent).join('\n\n');
}
