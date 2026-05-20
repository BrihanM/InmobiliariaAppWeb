import express from 'express';
import { config } from './infrastructure/config';
import { logger } from './infrastructure/logger';
import { usersRouter } from './infrastructure/http/routes/users.route';
import { errorHandler } from './infrastructure/http/middlewares/errorHandler';

const app = express();
app.use(express.json());

app.use('/users', usersRouter);

app.use(errorHandler);

app.listen(config.port, () => {
  logger.info(`user-service running on port ${config.port}`);
});
