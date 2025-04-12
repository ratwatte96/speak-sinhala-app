import { errorWithFile } from "./logger";

export class LocalStorageError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = "LocalStorageError";
  }
}

export function handleLocalStorageError(error: unknown): never {
  if (error instanceof LocalStorageError) {
    errorWithFile(error);
    throw error;
  }

  // Handle quota exceeded error
  if (error instanceof Error && error.name === "QuotaExceededError") {
    const quotaError = new LocalStorageError(
      "Local storage quota exceeded. Please clear some browser data.",
      "QUOTA_EXCEEDED"
    );
    errorWithFile(quotaError);
    throw quotaError;
  }

  // Handle localStorage disabled
  if (typeof localStorage === "undefined") {
    const disabledError = new LocalStorageError(
      "Local storage is not available. Please enable it in your browser settings.",
      "STORAGE_UNAVAILABLE"
    );
    errorWithFile(disabledError);
    throw disabledError;
  }

  // Handle other errors
  const unknownError = new LocalStorageError(
    "An error occurred while accessing local storage.",
    "UNKNOWN_ERROR"
  );
  errorWithFile(unknownError);
  throw unknownError;
}
