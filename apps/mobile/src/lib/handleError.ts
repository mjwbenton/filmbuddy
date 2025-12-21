import { Alert } from "react-native";
import { logger } from "./logger";
import { UserFacingError } from "./errors";

export function handleError(error: unknown, message: string): void {
  logger.error(message, error);

  const alertMessage =
    error instanceof UserFacingError ? error.message : message;

  Alert.alert("Error", alertMessage);
}
