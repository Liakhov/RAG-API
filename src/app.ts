import express from "express";
const app = express();
import 'dotenv/config'

const port = process.env.PORT;

app.get('/', (req: any, res: any) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
