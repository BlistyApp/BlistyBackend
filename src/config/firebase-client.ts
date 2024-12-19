import { FirebaseOptions, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { EnvVarKey } from "../types/enviroment";
import { validateEnvVariables } from "../utils/enviroment";
import logger from "../utils/logger";

const requiredEnvVars: EnvVarKey[] = [
  "FIREBASE_API_KEY",
  "FIREBASE_AUTH_DOMAIN",
  "FIREBASE_PROJECT_ID",
  "FIREBASE_STORAGE_BUCKET",
  "FIREBASE_MESSAGING_SENDER_ID",
  "FIREBASE_APP_ID",
  "DATABASE_URL",
];

validateEnvVariables(requiredEnvVars);

const firebaseOptions: FirebaseOptions = {
  apiKey: process.env.FIREBASE_API_KEY!,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.FIREBASE_PROJECT_ID!,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.FIREBASE_APP_ID!,
  databaseURL: process.env.FIREBASE_DATABASE_URL ?? "",
};

const app = initializeApp(firebaseOptions);
const dbClient = getFirestore(app);

logger.info("Firebase client initialized");

export { dbClient, app };
