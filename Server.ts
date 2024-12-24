import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import credsRouter from "./src/routes/creds";
import logger from "./src/utils/logger";
import morgan, { StreamOptions } from "morgan";
import ListenersFactory from "./src/services/listeners-factory";
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

const listener = ListenersFactory.getListener("firebase");
listener.initDBListeners();

server.get("/logs", (req, res) => {
  const key = req.query.key as string;
  if (key !== process.env.LOGS_KEY) {
    res.status(401).send("Unauthorized");
    return;
  }
  const logFile = "/tmp/logs/blisty-backend.log";
  res.download(logFile, path.basename(logFile));
});

server.use((_req, res) => {
  res.status(404).sendFile(path.join(__dirname, "public", "404.html"));
});

server.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});
