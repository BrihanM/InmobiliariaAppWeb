import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';

export const securityMiddlewares = [helmet(), cors(), rateLimit({ windowMs: 60_000, max: 100 })];
