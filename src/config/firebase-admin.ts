import { EnvVarKey } from "@src/types/enviroment";
import { validateEnvVariables } from "@src/utils/enviroment";
import logger from "@src/utils/logger";
import { cert, initializeApp, ServiceAccount } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const requiredEnvVars: EnvVarKey[] = [
  "ADMIN_PROJECT_ID",
  "ADMIN_PRIVATE_KEY",
  "ADMIN_CLIENT_EMAIL",
  "DATABASE_URL",
];

validateEnvVariables(requiredEnvVars);

const serviceAccount: ServiceAccount = {
  projectId: process.env.ADMIN_PROJECT_ID!,
  privateKey: process.env.ADMIN_PRIVATE_KEY!,
  clientEmail: process.env.ADMIN_CLIENT_EMAIL!,
};

const admin = initializeApp({
  credential: cert(serviceAccount),
  databaseURL: process.env.DATABASE_URL ?? "",
});

const dbAdmin = getFirestore(admin);

logger.info("Firebase admin initialized");

export { dbAdmin, admin };
