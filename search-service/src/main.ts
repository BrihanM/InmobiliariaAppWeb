import express from 'express';
import cors from 'cors';
import logger from './infrastructure/logger';
import { PORT } from './infrastructure/config';
import searchRouter from './infrastructure/http/routes/search.route';
import { errorHandler } from './infrastructure/http/middlewares/errorHandler';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/search', searchRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  logger.info({ port: PORT }, 'search-service listening');
});
