import express, { Request, Response } from 'express';
import { z } from 'zod';

import {
  deleteRecordByDocumentId,
  getAllRecords,
  getRecordsByDocumentId
} from '../lib/utils/vectorStore.js';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const documents = await getAllRecords('documents');
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    // Validate the request body
    const result = documentSchema.safeParse(req.params);
    if (!result.success) {
      res.status(400).json({ error: result.error.issues });
      return;
    }

    const documentId = result.data.id;

    const records = await getRecordsByDocumentId('documents', documentId);
    res.json({ records });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    // Validate the request body
    const result = documentSchema.safeParse(req.params);
    if (!result.success) {
      res.status(400).json({ error: result.error.issues });
      return;
    }

    const documentId = result.data.id;

    await deleteRecordByDocumentId('documents', documentId);
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Validation schemas
const documentSchema = z.object({
  id: z.string().min(1, 'documentId is required').max(36, 'documentId annot exceed 36 characters')
});

export default router;
