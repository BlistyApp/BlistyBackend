import { Router } from "express";
import path from "path";

const router = Router();

router.get("/logs", (req, res) => {
  const key = req.query.key as string;
  if (key !== process.env.CHANGES_KEY) {
    res.status(401).send("Unauthorized");
    return;
  }
  const logFile = "/tmp/logs/blisty-backend.log";
  res.download(logFile, path.basename(logFile));
});

export default router;