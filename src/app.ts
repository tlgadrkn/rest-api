import express from 'express';
import config from 'config'; //
import logger from './utils/logger';
import connect from './utils/connect';
import routes from './routes';
import { deserializeUser } from './middleware/deserializeUser';
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(deserializeUser);

const port = config.get<number>('port');
app.listen(port, async () => {
  logger.info(`Listening on port ${port}`);
  await connect();

  routes(app);
});
