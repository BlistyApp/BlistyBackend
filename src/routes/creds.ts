import CredentialsController from "../controllers/credentials-controller";
import { Router } from "express";

const router = Router();

router.get("/creds", CredentialsController.getCredentials);

export default router;
