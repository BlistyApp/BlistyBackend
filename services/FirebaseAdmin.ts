import { cert, initializeApp, ServiceAccount } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const serviceAccount: ServiceAccount = {
  projectId: process.env.ADMIN_PROJECT_ID,
  privateKey: process.env.ADMIN_PRIVATE_KEY,
  clientEmail: process.env.ADMIN_CLIENT_EMAIL,
};

const admin = initializeApp({
  credential: cert(serviceAccount),
  databaseURL: process.env.DATABASE_URL ?? "",
});

const dbAdmin = getFirestore(admin);

console.log("Firebase Admin initialized");

export { dbAdmin, admin };
