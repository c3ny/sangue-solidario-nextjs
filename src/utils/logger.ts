const isDev = process.env.NODE_ENV === "development";

export const logger = {
  error: (message: unknown, ...args: unknown[]) => {
    if (isDev) {
      console.error(message, ...args);
    } else {
      console.error(typeof message === "string" ? message : "An error occurred");
    }
  },
  warn: (message: unknown, ...args: unknown[]) => {
    if (isDev) {
      console.warn(message, ...args);
    }
  },
};
