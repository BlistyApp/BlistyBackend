import { dbAdmin } from "./FirebaseAdmin";
import { Psychologist } from "./serviceTypes";

export const match = async (
  tags: Array<string>,
  mTags: Array<string>
): Promise<Array<string>> => {
  const psychologistRef = dbAdmin.collection("users");
  const psychologistQuery = psychologistRef.where("role", "==", "psychologist");
  const psychologists = Array<Psychologist>();
  const psychologistSnap = await psychologistQuery.get();
  psychologistSnap.forEach((doc) => {
    const psychologist = doc.data();
    const tagsMatch = tags.filter((tag) => psychologist.tags.includes(tag));
    const mTagsMatch = mTags.filter((mTag) =>
      psychologist.mTags.includes(mTag)
    );
    const matchIndex = tagsMatch.length + mTagsMatch.length;
    psychologists.push({
      uid: doc.id,
      tags: tagsMatch,
      mTags: mTagsMatch,
      matchIndex,
    });
  });
  psychologists.sort((a, b) => b.matchIndex - a.matchIndex);
  return psychologists.map((psychologist) => psychologist.uid);
};
