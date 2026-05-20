import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../../config';

declare global { namespace Express { interface Request { user?: any } } }

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: 'Unauthorized' });
  const [, token] = auth.split(' ');
  try{
    const payload = jwt.verify(token, config.jwtSecret) as any;
    req.user = payload;
    next();
  }catch(e){
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export const rbac = (allowed: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) return res.status(403).json({ message: 'Forbidden' });
    const roles: string[] = user.roles ?? [];
    const ok = roles.some(r => allowed.includes(r));
    if (!ok) return res.status(403).json({ message: 'Forbidden' });
    next();
  };
};
