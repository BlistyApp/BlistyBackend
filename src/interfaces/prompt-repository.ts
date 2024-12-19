export interface PromptRepository {
  getSystemPrompt: () => Promise<string>;
}
