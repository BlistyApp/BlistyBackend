import { Router } from "express";
import { updateSystemPrompt } from "src/config/openai";

const router = Router();

router.get("/update", async (req, res) => {
    const key = req.query.key as string;
    if (key !== process.env.CHANGES_KEY) {
        res.status(401).send("Unauthorized");
        return;
    }
    await updateSystemPrompt();
    res.status(200).send("ok");
});