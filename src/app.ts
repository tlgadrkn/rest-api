import config from 'config'; //
import logger from './utils/logger';
import connect from './utils/connect';
import createServer from './utils/server';
require('dotenv').config();

const port = config.get<number>('port');
const app = createServer();

app.listen(port, async () => {
  logger.info(`Listening on port ${port}`);
  await connect();
});
