import { config } from "dotenv";
config();
import * as adminFS from "firebase-admin/firestore";
import * as app from "firebase/app";
import * as admin from "firebase-admin/app";
import * as appAuth from "firebase/auth";
const serviceAccount = {
    projectId: process.env.ADMIN_PROJECT_ID,
    privateKey: process.env.ADMIN_PRIVATE_KEY,
    clientEmail: process.env.ADMIN_CLIENT_EMAIL,
};
const fbAdmin = admin.initializeApp({
    credential: admin.cert(serviceAccount),
    databaseURL: process.env.DATABASE_URL,
});
const dbAdmin = adminFS.getFirestore(fbAdmin);

const firebaseOptions = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    databaseURL: process.env.FIREBASE_DATABASE_URL ?? "",
};
const appClient = app.initializeApp(firebaseOptions);
const authClient = appAuth.getAuth(appClient);


import psychologists from "./default-psychologists.json" with {type: "json"};
const setPsychologists = async () => {
    const psychologistsCollection = dbAdmin.collection("users");
    const psychologistsBatch = dbAdmin.batch();
    for (const psychologist of psychologists) {
        const user = await appAuth.createUserWithEmailAndPassword(authClient, psychologist.email, "123456");
        const psychologistRef = psychologistsCollection.doc(user.user.uid);
        psychologist.uid = user.user.uid;
        psychologistsBatch.set(psychologistRef, psychologist);
    }
    try {
        await psychologistsBatch.commit();
        console.log("Psychologists set successfully");
    } catch (err) {
        console.error(err);
    }
}

const getPsychologists = async () => {
    return dbAdmin
        .collection("users")
        .where("role", "==", "psychologist")
        .get()
        .then((snapshot) => {
            return snapshot.docs.map(doc => {
                return { uid: doc.id, ...doc.data() }
            });
        });
}

const removePsychologists = async () => {
    const psychologists = await getPsychologists();
    const psychologistsCollection = dbAdmin.collection("users");
    const psychologistsBatch = dbAdmin.batch();
    psychologists.forEach(psychologist => {
        const psychologistRef = psychologistsCollection.doc(psychologist.uid);
        psychologistsBatch.delete(psychologistRef);
    });
    try {
        await psychologistsBatch.commit();
        console.log("Psychologists removed successfully");
    } catch (err) {
        console.error(err);
    }
}

const updatePsychologists = async () => {
    const psychologistsList = await getPsychologists();
    const psychologistsCollection = dbAdmin.collection("users");
    const psychologistsBatch = dbAdmin.batch();
    psychologistsList.forEach(psychologist => {
        const psychologistRef = psychologistsCollection.doc(psychologist.uid);
        const doc = psychologists.find(psych => psych.email === psychologist.email);
        doc.birth_day = new Date(doc.birth_day);
        psychologistsBatch.update(psychologistRef, doc);
    });
    try {
        await psychologistsBatch.commit();
        console.log("Psychologists updated successfully");
    } catch (err) {
        console.error(err);
    }
}

await updatePsychologists();
const newPsychologists = await getPsychologists();
console.log(newPsychologists);