import cryptoJs from "crypto-js";
import { FirebaseCredentials } from "./serviceTypes";

const secretKey = process.env.SECRET_KEY ?? "";
if (!secretKey) {
  throw new Error("Secret key is required");
}
if (Buffer.byteLength(secretKey) !== 32) {
  throw new Error("Secret key must be 32 bytes long");
}

const encrypt = (data: string): string => {
  return cryptoJs.AES.encrypt(data, secretKey).toString();
};

export const getCredentials = (): FirebaseCredentials => {
  return {
    apiKey: encrypt(process.env.FIREBASE_API_KEY ?? ""),
    authDomain: encrypt(process.env.FIREBASE_AUTH_DOMAIN ?? ""),
    projectId: encrypt(process.env.FIREBASE_PROJECT_ID ?? ""),
    storageBucket: encrypt(process.env.FIREBASE_STORAGE_BUCKET ?? ""),
    messagingSenderId: encrypt(process.env.FIREBASE_MESSAGING_SENDER_ID ?? ""),
    appId: encrypt(process.env.FIREBASE_APP_ID ?? ""),
  };
};
