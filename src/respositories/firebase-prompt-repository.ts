import { dbAdmin } from "../config/firebase-admin";
import { PromptRepository } from "../interfaces/prompt-repository";
import { SystemPrompt } from "../types/repositories";

export class FirebasePromptRepository implements PromptRepository {
  private db = dbAdmin;
  async getSystemPrompt(): Promise<string> {
    const systemRef = this.db.collection("system").doc("system-prompt");
    const systemPromptData = (await systemRef.get()).data() as SystemPrompt;
    return systemPromptData.prompt;
  }
}
