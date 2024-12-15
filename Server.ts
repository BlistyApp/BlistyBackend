import * as dotenv from "dotenv";
dotenv.config();
import express, { Request, Response } from "express";
import morgan from "morgan";
import { getCredentials } from "./services/Credentials";
import { initDBListener } from "./services/DBListeners";

const server = express();
const port: number = parseInt((process.env.PORT ?? "") as string, 10) || 3000;

server.use(express.json());
server.use(morgan("dev"));

server.get("/creds", async (_req: Request, res: Response): Promise<void> => {
  res.status(200).json(getCredentials());
});

initDBListener();

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
