import { Request, Response, NextFunction } from 'express';
import logger from '../../logger';

/**
 * Middleware global de errores para `search-service`.
 * Centraliza el logging y la respuesta estándar en caso de fallos.
 */
export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  logger.error({ err }, 'Unhandled error');
  res.status(500).json({ error: 'Internal server error' });
}
