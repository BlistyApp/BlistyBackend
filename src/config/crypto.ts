import { EnvVarKey } from "@src/types/enviroment";
import { validateEnvVariables } from "@src/utils/enviroment";
import logger from "@src/utils/logger";

const requiredEnvVars: EnvVarKey[] = ["SECRET_KEY"];

validateEnvVariables(requiredEnvVars);

const secretKey = process.env.SECRET_KEY!;

if (Buffer.byteLength(secretKey) !== 32) {
  const error = new Error("Secret key must be 32 bytes long");
  logger.error(error.message);
}

export { secretKey };
