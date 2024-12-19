import OpenAI from "openai";
import { validateEnvVariables } from "@src/utils/enviroment";
import { EnvVarKey } from "@src/types/enviroment";
import RepositoryFactory from "@src/services/repo-factory";
import logger from "@src/utils/logger";

const requiredEnvVars: EnvVarKey[] = ["OPENAI_API_KEY", "OPENAI_PROJECT"];

validateEnvVariables(requiredEnvVars);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
  project: process.env.OPENAI_PROJECT!,
});

let systemPrompt: string = "";

const updateSystemPrompt = async (): Promise<void> => {
  const promptRepo = RepositoryFactory.getPromptRepository("firebase");
  systemPrompt = await promptRepo.getSystemPrompt();
  const tagsRepo = RepositoryFactory.getTagsRepository("firebase");
  const tags = await tagsRepo.getTags();
  const masterTags = await tagsRepo.getMasterTags();
  const tagsString = tags.map((tag) => tag.tag).join(", ");
  const masterTagsString = masterTags.map((tag) => tag.tag).join(", ");
  systemPrompt = `The system prompt is: "${systemPrompt}". Tags: ${tagsString}. Master tags: ${masterTagsString}`;
};

updateSystemPrompt();

logger.info("OpenAI config loaded");

export { openai, systemPrompt, updateSystemPrompt };
