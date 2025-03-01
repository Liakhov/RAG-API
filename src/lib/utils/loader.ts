import { TextLoader } from 'langchain/document_loaders/fs/text';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';

export const loadTxt = async (path: string | Blob) => {
  const loader = new TextLoader(path);
  return await loader.load();
};

export const loadPdf = async (path: string | Blob) => {
  const loader = new PDFLoader(path);
  return await loader.load();
};
