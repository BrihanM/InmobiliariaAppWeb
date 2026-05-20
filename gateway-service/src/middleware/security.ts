import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import { RequestHandler } from 'express';

export const securityMiddlewares: RequestHandler[] = [
  helmet(),
  compression(),
  cors({ origin: true }),
];
