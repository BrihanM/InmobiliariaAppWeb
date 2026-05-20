import { NextFunction, Request, Response } from "express";
import { Logger } from "pino";

export const errorHandler = (logger: Logger) => {
  /**
   * Middleware global para captura de errores.
   * Centraliza la respuesta y el logging de errores no manejados.
   */
  return (err: any, _req: Request, res: Response, _next: NextFunction) => {
    logger.error(err);
    const status = err?.statusCode || 500;
    res.status(status).json({ message: err?.message || "Internal Server Error" });
  };
};
