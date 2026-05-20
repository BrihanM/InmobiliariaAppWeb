import { NextFunction, Request, Response } from "express";
import { Logger } from "pino";

export const errorHandler = (logger: Logger) => {
  return (err: any, _req: Request, res: Response, _next: NextFunction) => {
    logger.error(err, "Unhandled error");
    const status = err?.statusCode || 500;
    res.status(status).json({ message: err?.message || "Internal Server Error" });
  };
};
