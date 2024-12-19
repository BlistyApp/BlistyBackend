import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import credsRouter from "@src/routes/creds";
import logger from "@src/utils/logger";
import morgan, { StreamOptions } from "morgan";
import ListenersFactory from "@src/services/listeners-factory";

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

server.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});
