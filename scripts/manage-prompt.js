import { getFirestore } from "firebase-admin/firestore";
import { config } from "dotenv";
config();
import { initializeApp, cert } from "firebase-admin/app";
const serviceAccount = {
  projectId: process.env.ADMIN_PROJECT_ID,
  privateKey: process.env.ADMIN_PRIVATE_KEY,
  clientEmail: process.env.ADMIN_CLIENT_EMAIL,
};
const fbAdmin = initializeApp({
  credential: cert(serviceAccount),
  databaseURL: process.env.DATABASE_URL,
});
const db = getFirestore(fbAdmin);
import prompt from "./default-prompt.json" with {type: "json"};
const getPrompt = async () => {
  return db
    .collection("system")
    .doc("system-prompt")
    .get()
    .then((doc) => {
      if (doc.exists) {
        return doc.data();
      } else {
        return "No prompt available";
      }
    });
};

const setPrompt = async () => {
  db.collection("system").doc("system-prompt").set(prompt);
};
await setPrompt();
const newPrompt = await getPrompt();
console.log(newPrompt);
