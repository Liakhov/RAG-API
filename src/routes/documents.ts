import express, { Request, Response } from 'express';

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
    const documentId = req.params.id;
    if (!documentId) {
      res.status(400).json({ error: 'Invalid input: id is required and must be a string.' });
      return;
    }

    const records = await getRecordsByDocumentId('documents', documentId);
    res.json({ records });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const documentId = req.params.id;
    if (!documentId) {
      res.status(400).json({ error: 'Invalid input: id is required and must be a string.' });
      return;
    }

    await deleteRecordByDocumentId('documents', documentId);
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;
