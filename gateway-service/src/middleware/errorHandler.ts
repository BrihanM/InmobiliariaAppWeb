import { Request, Response, NextFunction } from 'express';
import logger from '../logger';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  logger.error({ err, path: req.path }, 'Unhandled error in gateway');
  res.status(500).json({ error: 'Internal server error' });
}
