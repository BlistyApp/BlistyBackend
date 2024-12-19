import { TagsRepository } from "@src/interfaces/tags-repository";
import { FirebasePromptRepository } from "@src/respositories/firebase-prompt-repository";
import FirebasePsycoRepository from "@src/respositories/firebase-psyco-repository";
import { FirebaseTagsRepository } from "@src/respositories/firebase-tags-repository";
import { RepoType } from "@src/types/repositories";
import logger from "@src/utils/logger";

class RepositoryFactory {
  static getTagsRepository(type: RepoType): TagsRepository {
    if (type === "firebase") {
      return new FirebaseTagsRepository();
    }
    const error = new Error("Invalid repository type");
    logger.error(error.message);
    throw error;
  }

  static getPromptRepository(type: RepoType) {
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
