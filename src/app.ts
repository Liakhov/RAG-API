import express from 'express';
import 'dotenv/config';

import chatRoutes from './routes/chat.js';
import documentRoutes from './routes/document.js';

import { initOllama } from './lib/providers/ollama.js';

const app = express();
app.use(express.json());

const port = process.env.PORT;

export let ollama = initOllama();

app.use('/chat', chatRoutes);

app.use('/api/document', documentRoutes);

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
