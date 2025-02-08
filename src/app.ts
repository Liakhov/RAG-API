import express, {Request, Response} from "express";
import 'dotenv/config'

import {initChatOllama} from "./utils/ollama.js";

const app = express();
app.use(express.json());

const port = process.env.PORT;
const chatOllama = initChatOllama()

app.post('/chat', async (req: Request, res: Response) => {
    try {
        const answer = await chatOllama.invoke(req.body.question);
        res.json(answer);
    } catch (error) {
        res.status(500).json({error: (error as Error).message});
    }
});

app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});
