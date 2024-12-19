import { dbAdmin } from "@src/config/firebase-admin";
import { PromptRepository } from "@src/interfaces/prompt-repository";
import { SystemPrompt } from "@src/types/repositories";

export class FirebasePromptRepository implements PromptRepository {
  private db = dbAdmin;
  async getSystemPrompt(): Promise<string> {
    const systemRef = this.db.collection("system").doc("system-prompt");
    const systemPromptData = (await systemRef.get()).data() as SystemPrompt;
    return systemPromptData.prompt;
  }
}
