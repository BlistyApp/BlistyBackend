import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import credsRouter from "./src/routes/creds";
import logsRouter from "./src/routes/logs";
import logger from "./src/utils/logger";
import aiChatRouter from "./src/routes/ai-chat";
import updateRouter from "./src/routes/update";
import morgan, { StreamOptions } from "morgan";
import path from "path";

const server = express();
const stream: StreamOptions = {
  write: (message: string) => {
    logger.http(message.trim());
    console.log(message.trim());
  },
};
const port: number = parseInt((process.env.PORT ?? "") as string, 10) || 3000;

server.use(express.json());
server.use(morgan("combined", { stream }));
server.use(credsRouter);
server.use(logsRouter);
server.use(aiChatRouter);
server.use(updateRouter);

server.use((_req, res) => {
  res.status(404).sendFile(path.join(__dirname, "public", "404.html"));
});

server.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});
