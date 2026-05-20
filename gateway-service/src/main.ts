import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import { PORT } from './config';
import logger from './logger';
import proxyRoutes from './routes/proxy';
import { securityMiddlewares } from './middleware/security';
import { apiRateLimiter } from './middleware/rateLimiter';
import { jwtMiddleware } from './middleware/jwt.middleware';
import { errorHandler } from './middleware/errorHandler';

/**
 * API Gateway - punto de entrada
 */
async function main() {
  const app = express();

  // Security + performance
  securityMiddlewares.forEach((m) => app.use(m as any));

  // Logging - morgan pipes to console which pino can consume
  app.use(morgan('combined'));

  // Body parsers
  app.use(bodyParser.json());

  // Rate limiting globally (can be applied per-route for granularity)
  app.use(apiRateLimiter);

  // Health checks
  app.get('/health', (_req, res) => res.json({ status: 'ok' }));
  app.get('/ready', (_req, res) => res.json({ status: 'ready' }));

  // Public routes that don't require auth: auth paths (login/register)
  app.use('/auth', proxyRoutes);

  // Protected routes: attach JWT and then proxy
  app.use('/properties', jwtMiddleware, proxyRoutes);
  app.use('/users', jwtMiddleware, proxyRoutes);
  app.use('/search', jwtMiddleware, proxyRoutes);
  app.use('/payments', jwtMiddleware, proxyRoutes);

  // Global error handler
  app.use(errorHandler);

  app.listen(PORT, () => logger.info({ port: PORT }, 'Gateway started'));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
