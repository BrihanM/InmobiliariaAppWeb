import { Router } from 'express';
import { searchPropertiesHandler } from '../controllers/search.controller';
import { searchQuerySchema } from '../schemas/search.schema';

const router = Router();

router.get('/properties', (req, res, next) => {
  const parse = searchQuerySchema.safeParse(req.query);
  if (!parse.success) return res.status(400).json({ error: parse.error.format() });
  // attach parsed query to request and continue
  req.query = parse.data as any;
  return searchPropertiesHandler(req, res, next);
});

export default router;
