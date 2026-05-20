import pino from "pino";

export const createLogger = () => {
  return pino({
    transport: process.env.NODE_ENV !== "production" ? { target: "pino-pretty" } : undefined
  });
};
