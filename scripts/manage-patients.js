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


import users from "./default-patients.json" with {type: "json"};
const setUsers = async () => {
    const usersCollection = dbAdmin.collection("users");
    const usersBatch = dbAdmin.batch();
    for (const user of users) {
        const user_ = await appAuth.createUserWithEmailAndPassword(authClient, user.email, "123456");
        const userRef = usersCollection.doc(user_.user.uid);
        user.uid = user_.user.uid;
        user.birth_day = new Date(user.birth_day);
        usersBatch.set(userRef, user);
    }
    try {
        await usersBatch.commit();
        console.log("Users set successfully");
    } catch (err) {
        console.error(err);
    }
}

const getUsers = async () => {
    return dbAdmin
        .collection("users")
        .where("role", "==", "patient")
        .get()
        .then((snapshot) => {
            return snapshot.docs.map(doc => {
                return { uid: doc.id, ...doc.data() }
            });
        });
}

const deleteUsers = async () => {
    const usersCollection = dbAdmin.collection("users").where("role", "==", "patient");
    const usersBatch = dbAdmin.batch();
    const usersToDelete = await usersCollection.get();
    usersToDelete.forEach(async user => {
        usersBatch.delete(user.ref);
    });
    try {
        await usersBatch.commit();
        console.log("Users deleted successfully");
    } catch (err) {
        console.error(err);
    }
}

await setUsers();
const newUsers = await getUsers();
console.log(newUsers);