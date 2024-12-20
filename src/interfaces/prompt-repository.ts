import { AIPrompt } from "src/types/service";

export interface PromptRepository {
  getSystemPrompt: () => Promise<AIPrompt>;
}
