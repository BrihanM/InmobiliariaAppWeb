import { Router } from 'express';
import { createProxyMiddleware, Options } from 'http-proxy-middleware';
import logger from '../logger';
import {
  AUTH_TARGETS,
  PROPERTY_TARGETS,
  USER_TARGETS,
  SEARCH_TARGETS,
  PAYMENT_TARGETS,
} from '../config';

// Simple round-robin balancer for an array of targets
function createRoundRobin(targets: string[]) {
  let idx = 0;
  return () => {
    if (targets.length === 0) throw new Error('No targets');
    const t = targets[idx % targets.length];
    idx += 1;
    return t;
  };
}

function proxyFor(targets: string[], pathRewrite?: Record<string, string>) {
  const getTarget = createRoundRobin(targets);
  const options: Options = {
    target: targets[0],
    changeOrigin: true,
    secure: false,
    logProvider: () => ({
      log: logger.info.bind(logger),
      debug: logger.debug.bind(logger),
      info: logger.info.bind(logger),
      warn: logger.warn.bind(logger),
      error: logger.error.bind(logger),
    }),
    router: () => getTarget(),
    pathRewrite: pathRewrite,
    onProxyReq: (proxyReq) => {
      proxyReq.setHeader('x-forwarded-host', 'gateway');
    },
  };
  return createProxyMiddleware(options);
}

const router = Router();

// Map route prefixes to microservice clusters
router.use('/auth', proxyFor(AUTH_TARGETS, { '^/auth': '/' }));
router.use('/properties', proxyFor(PROPERTY_TARGETS, { '^/properties': '/' }));
router.use('/users', proxyFor(USER_TARGETS, { '^/users': '/' }));
router.use('/search', proxyFor(SEARCH_TARGETS, { '^/search': '/' }));
router.use('/payments', proxyFor(PAYMENT_TARGETS, { '^/payments': '/' }));

export default router;
