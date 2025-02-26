import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { Document } from '@langchain/core/documents';

export const splitText = async (documents: Document[]) => {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    separators: ['\n\n', '\n', ' ', ''],
    chunkOverlap: 200
  });

  return await splitter.splitDocuments(documents);
};
