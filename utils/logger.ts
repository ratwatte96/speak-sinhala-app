export const logWithFile = (message: any, userId?: string, ...args: any[]) => {
  const filePath = getCallerFile();
  const userTag = userId ? `User:${userId}` : "";
  console.log(`[${filePath}] ${userTag}`, message, ...args);
};

export const errorWithFile = (
  message: any,
  userId?: string,
  ...args: any[]
) => {
  const filePath = getCallerFile();
  const userTag = userId ? `User:${userId}` : "";
  console.error(`[${filePath}] ${userTag}`, message, ...args);
};

const getCallerFile = (): string => {
  if (typeof window !== "undefined") {
    return "ClientComponent";
  }

  const stack = new Error().stack;
  if (!stack) return "Unknown";

  const stackLines = stack.split("\n");
  let callerPath = "Unknown";

  for (let i = 0; i < stackLines.length; i++) {
    const line = stackLines[i];

    if (line.includes("logger.ts")) continue;

    const match = line.match(/\/(app|pages)\/([^:]+):\d+:\d+/);
    if (match) {
      callerPath = `${match[1]}/${match[2]}`;
      break;
    }
  }

  return callerPath;
};
