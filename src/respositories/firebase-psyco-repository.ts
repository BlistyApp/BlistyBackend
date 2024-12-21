import { dbAdmin } from "../config/firebase-admin";
import { PsycoRepository } from "../interfaces/psyco-repository";
import { Psychologist } from "../types/service";

class FirebasePsycoRepository implements PsycoRepository {
  private db = dbAdmin;
  async getPsycologists(): Promise<Psychologist[]> {
    const psycoRef = this.db.collection("users");
    const psycoQuery = psycoRef.where("role", "==", "psychologist");
    const psychologists = Array<Psychologist>();
    const psycoSnap = await psycoQuery.get();
    psycoSnap.forEach((doc) => {
      const psychologist = doc.data() as Psychologist;
      psychologists.push({
        id: doc.id,
        tags: psychologist.tags,
        mTags: psychologist.mTags,
        name: psychologist.name,
      });
    });
    return psychologists;
  }
  async addPsychologist(psychologist: Psychologist): Promise<void> {
    const psycoRef = this.db.collection("users");
    await psycoRef.add(psychologist);
  }
}

export default FirebasePsycoRepository;
