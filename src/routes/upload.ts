import express, { Request, Response } from 'express';
import { Document } from '@langchain/core/documents';
import { Chroma } from '@langchain/community/vectorstores/chroma';
import { z } from 'zod';

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
      const result = uploadPdfSchema.safeParse({ ...req.body, file: req.file });
      if (!result.success) {
        res.status(400).json({ error: result.error.issues });
        return;
      }

      const { documentId, file } = result.data;

      const fileBlob = new Blob([file.buffer], { type: file.mimetype });

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
      const result = uploadTxtSchema.safeParse({ ...req.body, file: req.file });
      if (!result.success) {
        res.status(400).json({ error: result.error.issues });
        return;
      }

      const { documentId, file } = result.data;

      const fileBlob = new Blob([file.buffer], { type: file.mimetype });

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
    const result = uploadTextSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ error: result.error.issues });
      return;
    }

    const { text, documentId } = result.data;

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
    res.status(500).json({ error: (error as Error).message });
  }
});

// Validation schemas
const uploadTextSchema = z.object({
  documentId: z
    .string()
    .min(1, 'documentId is required')
    .max(36, 'documentId annot exceed 36 characters'),
  text: z
    .string()
    .min(1, 'documentId is required')
    .max(10000, 'documentId annot exceed 36 characters')
});

const uploadPdfSchema = z.object({
  documentId: z
    .string()
    .min(1, 'documentId is required')
    .max(36, 'documentId annot exceed 36 characters'),
  file: z.custom<Express.Multer.File>().refine(file => file !== undefined, {
    message: 'File is required'
  })
});

const uploadTxtSchema = z.object({
  documentId: z
    .string()
    .min(1, 'documentId is required')
    .max(36, 'documentId annot exceed 36 characters'),
  file: z.custom<Express.Multer.File>().refine(file => file !== undefined, {
    message: 'File is required'
  })
});

export default router;
