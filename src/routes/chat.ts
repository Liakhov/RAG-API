import express, { Request, Response } from 'express';

import { ollama } from '../app.js';

const router = express.Router();

router.post('/chat', async (req: Request, res: Response) => {
  try {
    // Validate the request body
    if (!req.body.question || typeof req.body.question !== 'string') {
      // Respond with a 400 status if validation fails
      res.status(400).json({ error: 'Invalid input: question is required and must be a string.' });
      return;
    }

    // Invoke the Ollama model with the provided question
    const output = await ollama.invoke(req.body.question);

    // Send the model's output as the response
    res.json(output);
  } catch (error) {
    // Log any errors that occur during processing
    console.log('error', error);
    // Respond with a 500 status and the error message
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;