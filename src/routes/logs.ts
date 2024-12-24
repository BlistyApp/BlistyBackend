import { Router } from "express";
import path from "path";
import logger from "src/utils/logger";

const router = Router();

router.get("/logs", (req, res) => {
  const key = req.query.key as string;
  if (key !== process.env.CHANGES_KEY) {
    logger.error("Unauthorized request to download logs");
    res.status(401).send("Unauthorized");
    return;
  }
  const logFile = "/tmp/logs/blisty-backend.log";
  res.download(logFile, path.basename(logFile));
});

export default router;