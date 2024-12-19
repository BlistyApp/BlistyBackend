import { EnvVarKey } from "../types/enviroment";
import { validateEnvVariables } from "../utils/enviroment";
import { Request, Response } from "express";
import { FirebaseCredentials } from "../types/service";
import { CryptoService } from "../interfaces/crypto-service";
import CryptoJSCryptoService from "../services/cryptojs-crypto-service";

class CredentialsController {
  private static cryptoS: CryptoService = new CryptoJSCryptoService();
  static async getCredentials(_req: Request, res: Response) {
    const requiredCredentials: EnvVarKey[] = [
      "FIREBASE_API_KEY",
      "FIREBASE_AUTH_DOMAIN",
      "FIREBASE_PROJECT_ID",
      "FIREBASE_STORAGE_BUCKET",
      "FIREBASE_MESSAGING_SENDER_ID",
      "FIREBASE_APP_ID",
    ];
    validateEnvVariables(requiredCredentials);
    const fbcred: FirebaseCredentials = {
      apiKey: CredentialsController.cryptoS.encrypt(
        process.env.FIREBASE_API_KEY!
      ),
      authDomain: CredentialsController.cryptoS.encrypt(
        process.env.FIREBASE_AUTH_DOMAIN!
      ),
      projectId: CredentialsController.cryptoS.encrypt(
        process.env.FIREBASE_PROJECT_ID!
      ),
      storageBucket: CredentialsController.cryptoS.encrypt(
        process.env.FIREBASE_STORAGE_BUCKET!
      ),
      messagingSenderId: CredentialsController.cryptoS.encrypt(
        process.env.FIREBASE_MESSAGING_SENDER_ID!
      ),
      appId: CredentialsController.cryptoS.encrypt(
        process.env.FIREBASE_APP_ID!
      ),
    };
    res.json(fbcred);
  }
}

export default CredentialsController;
