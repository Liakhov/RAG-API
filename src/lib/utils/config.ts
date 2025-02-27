export const CHROMA_CONFIG = {
  url: process.env.DB_URL,
  collectionMetadata: {
    'hnsw:space': 'cosine'
  }
};
