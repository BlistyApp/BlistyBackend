import { getFirestore } from "firebase-admin/firestore";
import dotenv from "dotenv";
dotenv.config();
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

import tags from "./default-tags.json" with {type: "json"};
const parseTags = (tags) => {
    const masterTags = []
    const regTags = []
    for (const tag of tags) {
        const mtag = {}
        mtag.label = tag.label
        mtag.id = tag.mtag
        mtag.createdAt = new Date()
        masterTags.push(mtag)
        for (const rTag of tag.tags) {
            const rtag = {}
            rtag.label = rTag.label
            rtag.id = rTag.tag
            rtag.masterTag = tag.mtag
            rtag.createdAt = new Date()
            regTags.push(rtag)
        }
    }
    const uniqueMasterTags = [...new Map(masterTags.map(tag => [tag.id, tag])).values()];
    const uniqueRegTags = [...new Map(regTags.map(tag => [tag.id, tag])).values()];
    return {masterTags: uniqueMasterTags, regTags: uniqueRegTags}
}

const setTags = async () => {
    const {masterTags, regTags} = parseTags(tags);
    const mtagsCollection = db.collection("master-tags");
    const rtagsCollection = db.collection("tags");
    const mtagsBatch = db.batch();
    const rtagsBatch = db.batch();
    for (const mtag of masterTags) {
        const mtagRef = mtagsCollection.doc(mtag.id);
        mtagsBatch.set(mtagRef, mtag);
    }
    for (const rtag of regTags) {
        const rtagRef = rtagsCollection.doc(rtag.id);
        rtagsBatch.set(rtagRef, rtag);
    }
    try{
        await mtagsBatch.commit();
        await rtagsBatch.commit();
        console.log("Tags set successfully");
    }catch(err){
        console.error(err);
    }
}

const getTags = async () => {
    const mtagsCollection = db.collection("master-tags");
    const rtagsCollection = db.collection("tags");
    const mtags = await mtagsCollection.get();
    const rtags = await rtagsCollection.get();
    const masterTags = []
    const regTags = []
    mtags.forEach(doc => {
        masterTags.push(doc.data());
    });
    rtags.forEach(doc => {
        regTags.push(doc.data());
    });
    return {masterTags, regTags}
}

await setTags();
const newTags = await getTags();
console.log(newTags);