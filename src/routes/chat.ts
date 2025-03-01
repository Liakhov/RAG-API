import express, { Request, Response } from 'express';

import { ollama } from '../app.js';
import { processQuestion } from '../lib/utils/chat-with-documents.js';

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    // Validate the request body
    if (!req.body.question || typeof req.body.question !== 'string') {
      res.status(400).json({ error: 'Invalid input: question is required and must be a string.' });
      return;
    }

    // Invoke the Ollama model with the provided question
    const output = await ollama.invoke(req.body.question);

    // Send the model's output as the response
    res.json(output);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post('/documents', async (req: Request, res: Response) => {
  try {
    // Validate the request body
    if (!req.body.question || typeof req.body.question !== 'string') {
      // Respond with a 400 status if validation fails
      res.status(400).json({ error: 'Invalid input: question is required and must be a string.' });
      return;
    }

    const question = req.body.question;

    const { llmResponse, documents } = await processQuestion(question);

    res.json({
      question,
      llmResponse,
      documents
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post('/document/:id', async (req: Request, res: Response) => {
  try {
    // Validate the request body
    if (!req.body.question || typeof req.body.question !== 'string') {
      // Respond with a 400 status if validation fails
      res.status(400).json({ error: 'Invalid input: question is required and must be a string.' });
      return;
    }

    const question = req.body.question;
    const documentId = req.body.documentId;

    const { llmResponse, documents } = await processQuestion(question, { documentId });

    res.json({
      question,
      llmResponse,
      documents
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;
