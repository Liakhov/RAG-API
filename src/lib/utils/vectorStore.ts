import { ChromaClient, Collection, GetResponse, type IncludeEnum } from 'chromadb';

const client = new ChromaClient({ path: process.env.DB_URL });

export const getCollection = async (name: string): Promise<Collection> => {
  try {
    // Get or create the collection
    const collection = await client.getOrCreateCollection({
      name
    });

    return collection;
  } catch (error) {
    console.error(`Failed to get or create collection "${name}":`, error);
    throw new Error(
      `ChromaDB collection error: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};

export const getRecordsByDocumentId = async (
  collectionName = 'documents',
  documentId: string,
  includeEmbeddings: boolean = false
): Promise<GetResponse> => {
  try {
    if (!documentId) {
      throw new Error('DocumentId is required');
    }

    // Get the collection
    const collection = await getCollection(collectionName);

    // Define what to include in the response
    const include = ['metadatas', 'documents'] as IncludeEnum[];

    if (includeEmbeddings) {
      include.push('embeddings' as IncludeEnum);
    }

    // Query the collection with filtering
    const results = await collection.get({
      where: {
        documentId
      },
      include
    });

    return results;
  } catch (error) {
    console.error(`Failed to get records for documentId "${documentId}":`, error);
    throw new Error(
      `ChromaDB query error: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};

export async function getAllRecords(
  collectionName = 'documents',
  limit = 1000,
  offset = 0,
  includeEmbeddings: boolean = false
) {
  try {
    // Get the collection
    const collection = await getCollection(collectionName);

    // Query parameters
    const queryParams: Record<string, unknown> = {
      limit: limit || 1000 // Default limit if not specified
    };

    // Add offset if provided
    if (offset !== undefined) {
      queryParams.offset = offset;
    }

    // Get total count first
    const count = await collection.count();

    // Define what to include in the response
    const include = ['metadatas', 'documents'] as IncludeEnum[];

    if (includeEmbeddings) {
      include.push('embeddings' as IncludeEnum);
    }

    // Get all records with metadata and embeddings
    const response = await collection.get({
      include,
      ...queryParams
    });

    // Format the results
    const records = [];
    if (response.ids) {
      for (let i = 0; i < response.ids.length; i++) {
        records.push({
          id: response.ids[i],
          metadata: response.metadatas ? response.metadatas[i] : null,
          pageContent: response.documents ? response.documents[i] : null,
          embedding: response.embeddings ? response.embeddings[i] : null
        });
      }
    }

    return {
      count,
      records,
      limit: queryParams.limit,
      offset: queryParams.offset || 0
    };
  } catch (error) {
    console.error('Error retrieving records from ChromaDB:', error);
    throw new Error(
      `Failed to retrieve records: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

export const deleteRecordByDocumentId = async (
  collectionName = 'documents',
  documentId: string
): Promise<void> => {
  try {
    if (!documentId) {
      throw new Error('DocumentId is required');
    }

    // Get the collection
    const collection = await getCollection(collectionName);

    // Delete records matching the documentId
    await collection.delete({
      where: {
        documentId
      }
    });

    console.log(`Successfully deleted records for documentId "${documentId}"`);
  } catch (error) {
    console.error(`Failed to delete records for documentId "${documentId}":`, error);
    throw new Error(
      `ChromaDB deletion error: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};
