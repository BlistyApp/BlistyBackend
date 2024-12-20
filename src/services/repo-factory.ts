import { PromptRepository } from "src/interfaces/prompt-repository";
import { TagsRepository } from "../interfaces/tags-repository";
import { FirebasePromptRepository } from "../respositories/firebase-prompt-repository";
import FirebasePsycoRepository from "../respositories/firebase-psyco-repository";
import { FirebaseTagsRepository } from "../respositories/firebase-tags-repository";
import { RepoType } from "../types/repositories";
import logger from "../utils/logger";

class RepositoryFactory {
  static getTagsRepository(type: RepoType): TagsRepository {
    if (type === "firebase") {
      return new FirebaseTagsRepository();
    }
    const error = new Error("Invalid repository type");
    logger.error(error.message);
    throw error;
  }

  static getPromptRepository(type: RepoType) : PromptRepository{
    if (type === "firebase") {
      return new FirebasePromptRepository();
    }
    const error = new Error("Invalid repository type");
    logger.error(error.message);
    throw error;
  }
  static getPsycoRepository(type: RepoType) {
    if (type === "firebase") {
      return new FirebasePsycoRepository();
    }
    const error = new Error("Invalid repository type");
    logger.error(error.message);
    throw error;
  }
}

export default RepositoryFactory;
