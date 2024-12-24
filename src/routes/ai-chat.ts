import { Router } from "express";
import { generateResponse } from "src/services/gen-reponse";
import logger from "src/utils/logger";

const router = Router();

router.post("/ai-chat", async (req, res) => {
  const roomId = req.body.roomId;
  const userId = req.body.userId;
  if (!roomId || !userId) {
    logger.error("Room ID and User ID are required");
    res.status(404).send("Room ID and User ID are required");
    return;
  }
  const response = await generateResponse(roomId, userId);
  if (!response) {
    logger.error("Error processing message");
    res.status(404).send("Error processing message");
    return;
  }
  logger.info("Message processed successfully");
  res.status(200).send("ok");
});

export default router;