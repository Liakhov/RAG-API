import { ChromaClient, Collection } from 'chromadb';

const client = new ChromaClient({
  path: process.env.DB_URL
});

export const getCollection = async (name: string) => {
  return await client.getOrCreateCollection({
    name
  });
};

export const addRecords = async (
  collection: Collection,
  documentId: string,
  documents: string[],
  ids: string[]
) => {
  const metadatas = documents.map(() => ({ documentId }));
  return await collection.add({
    documents,
    ids,
    metadatas
  });
};

export const getRecordsByDocumentId = async (collection: Collection, documentId: string) => {
  return await collection.get({
    where: {
      documentId
    }
  });
};
