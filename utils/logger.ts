export const logWithFile = (...args: any[]) => {
  const filePath = getCallerFile();
  console.log(`[${filePath}]`, ...args);
};

export const errorWithFile = (...args: any[]) => {
  const filePath = getCallerFile();
  console.error(`[${filePath}]`, ...args);
};

const getCallerFile = (): string => {
  if (typeof window !== "undefined") {
    // Client-side: Filenames are not accessible, return generic identifier
    return "ClientComponent";
  }

  // Server-side: Extract caller file from stack trace
  const stack = new Error().stack;
  if (!stack) return "Unknown";

  const stackLines = stack.split("\n");
  let callerPath = "Unknown";

  for (let i = 0; i < stackLines.length; i++) {
    const line = stackLines[i];

    // Skip lines referring to logger.ts
    if (line.includes("logger.ts")) continue;

    // Extract the file path from the stack trace
    const match = line.match(/\/(app|pages)\/([^:]+):\d+:\d+/);
    if (match) {
      callerPath = `${match[1]}/${match[2]}`; // Include directory and file
      break;
    }
  }

  return callerPath;
};
