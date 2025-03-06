import express, { Request, Response } from 'express';
import { z } from 'zod';

import { ollama } from '../app.js';
import { processQuestion } from '../lib/utils/chat-with-documents.js';

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    // Validate the request body
    const result = chatSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ error: result.error.issues });
      return;
    }

    // Invoke the Ollama model with the provided question
    const output = await ollama.invoke(result.data.question);

    // Send the model's output as the response
    res.json(output);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post('/documents', async (req: Request, res: Response) => {
  try {
    const result = documentsChatSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ error: result.error.issues });
      return;
    }

    const { question } = result.data;

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
    const result = documentChatSchema.safeParse({
      question: req.body.question,
      documentId: req.params.id
    });
    if (!result.success) {
      res.status(400).json({ error: result.error.issues });
      return;
    }

    const { question, documentId } = result.data;

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

// Validation schemas
const chatSchema = z.object({
  question: z
    .string()
    .min(1, 'Question is required')
    .max(12000, 'Question cannot exceed 12,000 characters')
});

const documentsChatSchema = z.object({
  question: z
    .string()
    .min(1, 'Question is required')
    .max(12000, 'Question cannot exceed 12,000 characters')
});

const documentChatSchema = z.object({
  question: z
    .string()
    .min(1, 'Question is required')
    .max(12000, 'Question cannot exceed 12,000 characters'),
  documentId: z
    .string()
    .min(1, 'documentId is required')
    .max(36, 'documentId annot exceed 36 characters')
});

export default router;
