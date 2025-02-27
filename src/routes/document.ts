import express, { Request, Response } from 'express';
import { Document } from '@langchain/core/documents';
import { Chroma } from '@langchain/community/vectorstores/chroma';

import { getOllamaEmbeddings } from '../lib/providers/ollama.js';
import { getAllRecords, getRecordsByDocumentId } from '../lib/utils/vectorStore.js';
import { splitText } from '../lib/utils/text-splitter.js';
import { CHROMA_CONFIG } from '../lib/utils/config.js';

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const { text, documentId } = req.body;

    // Validate the request body
    if (!text || typeof text !== 'string') {
      // Respond with a 400 status if validation fails
      res.status(400).json({ error: 'Invalid input: question is required and must be a string.' });
      return;
    }

    if (!documentId || typeof documentId !== 'string') {
      // Respond with a 400 status if validation fails
      res
        .status(400)
        .json({ error: 'Invalid input: documentId is required and must be a string.' });
      return;
    }

    const documents: Document[] = [{ pageContent: text, metadata: { documentId } }];
    const textChunks = await splitText(documents);

    const ollamaEmbeddings = getOllamaEmbeddings();
    await Chroma.fromDocuments(textChunks, ollamaEmbeddings, {
      collectionName: 'documents',
      ...CHROMA_CONFIG
    });

    const records = await getRecordsByDocumentId('documents', documentId);
    res.json({
      success: true,
      records
    });
  } catch (error) {
    // Log any errors that occur during processing
    console.log('error', error);
    // Respond with a 500 status and the error message
    res.status(500).json({ error: (error as Error).message });
  }
});

router.get('/all', async (req: Request, res: Response) => {
  try {
    const records = await getAllRecords('documents');
    res.json({ records });
  } catch (error) {
    // Log any errors that occur during processing
    console.log('error', error);
    // Respond with a 500 status and the error message
    res.status(500).json({ error: (error as Error).message });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const documentId = req.params.id;
    if (!documentId) {
      // Respond with a 400 status if validation fails
      res.status(400).json({ error: 'Invalid input: id is required and must be a string.' });
      return;
    }

    const records = await getRecordsByDocumentId('documents', documentId);
    res.json({ records });
  } catch (error) {
    // Log any errors that occur during processing
    console.log('error', error);
    // Respond with a 500 status and the error message
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;
