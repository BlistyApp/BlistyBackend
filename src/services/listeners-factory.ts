import { RepoType } from "../types/repositories";
import FirebaseListener from "./firebase-listener";
import logger from "../utils/logger";
import { DatabaseListener } from "../interfaces/database-listener";

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
