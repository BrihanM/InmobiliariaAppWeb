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
    onProxyReq: (proxyReq, req) => {
      proxyReq.setHeader('x-forwarded-host', 'gateway');
      // Forward decoded JWT claims so microservices don't need to re-validate JWT
      const user = (req as any).user;
      if (user?.sub)  proxyReq.setHeader('x-user-id',   String(user.sub));
      if (user?.role) proxyReq.setHeader('x-user-role', String(user.role));
      // bodyParser already consumed the stream — re-write parsed body so upstream receives it
      if ((req as any).body && Object.keys((req as any).body).length > 0) {
        const bodyData = JSON.stringify((req as any).body);
        proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
      }
    },
  };
  return createProxyMiddleware(options);
}

const router = Router();

// Usamos router.all (no router.use) para que Express NO quite el prefijo
// del req.url antes de llegar al proxy. Así los backends reciben el path
// completo: /auth/login, /properties, /properties/:id, etc.
const authProxy     = proxyFor(AUTH_TARGETS);
const propertyProxy = proxyFor(PROPERTY_TARGETS);
const userProxy     = proxyFor(USER_TARGETS);
const searchProxy   = proxyFor(SEARCH_TARGETS);
const paymentProxy  = proxyFor(PAYMENT_TARGETS);

router.all('/auth',        authProxy);
router.all('/auth/*',      authProxy);
router.all('/properties',  propertyProxy);
router.all('/properties/*', propertyProxy);
router.all('/users',       userProxy);
router.all('/users/*',     userProxy);
router.all('/search',      searchProxy);
router.all('/search/*',    searchProxy);
router.all('/payments',    paymentProxy);
router.all('/payments/*',  paymentProxy);

export default router;
