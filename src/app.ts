import express from 'express';
import 'dotenv/config';

import chatRoutes from './routes/chat.js';
import uploadRoutes from './routes/upload.js';
import documentsRoutes from './routes/documents.js';

const app = express();
app.use(express.json());

const port = process.env.PORT;

app.use('/chat', chatRoutes);

app.use('/upload', uploadRoutes);

app.use('/documents', documentsRoutes);

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
