import logger from "@src/utils/logger";
import { EnvVarKey } from "@src/types/enviroment";

function validateEnvVariables(envVars: EnvVarKey[]): void {
  const missingVars = envVars.filter((envVar) => !process.env[envVar]);
  if (missingVars.length > 0) {
    const error = new Error(
      "Missing required environment variables: " + missingVars.join(", ")
    );
    logger.error(error.message);
    throw error;
  }
}

export { validateEnvVariables };
