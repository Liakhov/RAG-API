import { Request, Response } from 'express';

import { initOllama } from './providers/ollama.js';
import { LLMModel } from './models/llm.model.js';

export const getLLMInstance = (model: LLMModel | undefined) => {
  return initOllama(model);
};

export const streamResponse = async (
  req: Request,
  res: Response,
  stream: AsyncGenerator<string>
) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // Handle client disconnection
  req.on('close', () => {
    stream.return?.(undefined);
  });

  try {
    // Send each chunk as a Server-Sent Event
    for await (const chunk of stream) {
      res.write(`data: ${JSON.stringify({ text: chunk })}\n\n`);
    }
    // Send completion event
    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
  } catch (error) {
    // Send error event
    res.write(`data: ${JSON.stringify({ error: (error as Error).message })}\n\n`);
  } finally {
    // Ensure stream is properly closed
    stream.return?.(undefined);
    res.end();
  }
};
