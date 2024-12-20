import { getFirestore } from "firebase-admin/firestore";
import * as dotenv from "dotenv";
dotenv.config();
import { initializeApp, cert } from "firebase-admin/app";
const serviceAccount = {
  projectId: process.env.ADMIN_PROJECT_ID,
  privateKey: process.env.ADMIN_PRIVATE_KEY,
  clientEmail: process.env.ADMIN_CLIENT_EMAIL,
};
export const fbAdmin = initializeApp({
  credential: cert(serviceAccount),
  databaseURL: process.env.DATABASE_URL,
});
const db = getFirestore(fbAdmin);

const getPrompt = async () => {
  return db
    .collection("system")
    .doc("system-prompt")
    .get()
    .then((doc) => {
      if (doc.exists) {
        return doc.data().prompt;
      } else {
        return "No prompt available";
      }
    });
};

getPrompt().then((prompt) => {
  console.log(prompt);
});
