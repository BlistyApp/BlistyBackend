import OpenAI from "openai";
import { validateEnvVariables } from "../utils/enviroment";
import { EnvVarKey } from "../types/enviroment";
import RepositoryFactory from "../services/repo-factory";
import logger from "../utils/logger";
import { AIPrompt } from "src/types/service";

const requiredEnvVars: EnvVarKey[] = ["OPENAI_API_KEY", "OPENAI_PROJECT"];

validateEnvVariables(requiredEnvVars);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
  project: process.env.OPENAI_PROJECT!,
});

let systemPrompt: AIPrompt;

const updateSystemPrompt = async (): Promise<void> => {
  const promptRepo = RepositoryFactory.getPromptRepository("firebase");
  const tagsRepo = RepositoryFactory.getTagsRepository("firebase");
  systemPrompt = await promptRepo.getSystemPrompt();
  const tags = await tagsRepo.getTags();
  const mTags = await tagsRepo.getMasterTags();
  tags.forEach((tag) => {
    systemPrompt.message_structure.tags.dictionary.push(tag.label);
  })
  mTags.forEach((mTag) => {
    systemPrompt.message_structure.tags.dictionary.push(mTag.label);
  })
  console.log(systemPrompt);
};

updateSystemPrompt();

logger.info("OpenAI config loaded");

export { openai, systemPrompt, updateSystemPrompt };
