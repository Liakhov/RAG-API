import express, { Request, Response } from 'express';
import { Document } from '@langchain/core/documents';
import { Chroma } from '@langchain/community/vectorstores/chroma';

import { getOllamaEmbeddings } from '../lib/providers/ollama.js';
import { getRecordsByDocumentId } from '../lib/utils/vectorStore.js';
import { upload } from '../lib/utils/multer.js';
import { loadPdf, loadTxt } from '../lib/utils/loader.js';
import { splitText } from '../lib/utils/text-splitter.js';
import { CHROMA_CONFIG } from '../lib/utils/config.js';

const router = express.Router();

router.post(
  '/pdf',
  upload('pdf').single('file'),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { documentId } = req.body;
      if (!documentId || typeof documentId !== 'string') {
        res
          .status(400)
          .json({ error: 'Invalid input: documentId is required and must be a string.' });
        return;
      }

      if (!req.file) {
        res.status(400).json({ error: 'No file uploaded or invalid file type' });
        return;
      }

      const fileBlob = new Blob([req.file.buffer], { type: req.file.mimetype });

      const doc = await loadPdf(fileBlob);

      const documents = doc.map((doc: Document) => ({
        ...doc,
        metadata: {
          ...doc.metadata,
          documentId
        }
      }));

      const textChunks = await splitText(documents);

      const ollamaEmbeddings = getOllamaEmbeddings();

      await Chroma.fromDocuments(textChunks, ollamaEmbeddings, {
        collectionName: 'documents',
        ...CHROMA_CONFIG
      });

      const records = await getRecordsByDocumentId('documents', documentId);

      res.json({ documentId, records });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
);

router.post(
  '/txt',
  upload('txt').single('file'),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { documentId } = req.body;
      if (!documentId || typeof documentId !== 'string') {
        res
          .status(400)
          .json({ error: 'Invalid input: documentId is required and must be a string.' });
        return;
      }

      if (!req.file) {
        res.status(400).json({ error: 'No file uploaded or invalid file type' });
        return;
      }

      const fileBlob = new Blob([req.file.buffer], { type: req.file.mimetype });

      const doc = await loadTxt(fileBlob);

      const documents = doc.map((doc: Document) => ({
        ...doc,
        metadata: {
          ...doc.metadata,
          documentId
        }
      }));

      const textChunks = await splitText(documents);

      const ollamaEmbeddings = getOllamaEmbeddings();

      await Chroma.fromDocuments(textChunks, ollamaEmbeddings, {
        collectionName: 'documents',
        ...CHROMA_CONFIG
      });

      const records = await getRecordsByDocumentId('documents', documentId);

      res.json({ documentId, records });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
);

router.post('/text', async (req: Request, res: Response) => {
  try {
    const { text, documentId } = req.body;

    if (!text || typeof text !== 'string') {
      res.status(400).json({ error: 'Invalid input: question is required and must be a string.' });
      return;
    }

    if (!documentId || typeof documentId !== 'string') {
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

export default router;
