import { RepoType } from "@src/types/repositories";
import FirebaseListener from "./firebase-listener";
import logger from "@src/utils/logger";
import { DatabaseListener } from "@src/interfaces/database-listener";

class ListenersFactory {
  static getListener(type: RepoType): DatabaseListener {
    if (type === "firebase") {
      return new FirebaseListener();
    }
    const error = new Error("Invalid repository type");
    logger.error(error.message);
    throw error;
  }
}

export default ListenersFactory;
