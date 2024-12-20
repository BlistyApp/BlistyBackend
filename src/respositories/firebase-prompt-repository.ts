import { AIPrompt } from "src/types/service";
import { dbAdmin } from "../config/firebase-admin";
import { PromptRepository } from "../interfaces/prompt-repository";

export class FirebasePromptRepository implements PromptRepository {
  private db = dbAdmin;
  async getSystemPrompt(): Promise<AIPrompt> {
    const systemRef = this.db.collection("system").doc("system-prompt");
    return  (await systemRef.get()).data() as AIPrompt;
  }
}
