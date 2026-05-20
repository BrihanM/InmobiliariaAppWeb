import { Request, Response, NextFunction } from 'express';
import { logger } from '../../logger';

export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  logger.error(err);
  const status = err?.statusCode || 400;
  res.status(status).json({ message: err?.message || 'Bad Request' });
  /**
   * Middleware global para captura y logging de errores.
   */
};
