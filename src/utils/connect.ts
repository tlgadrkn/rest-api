import mongoose from 'mongoose';
import config from 'config';
import logger from './logger';
async function connect() {
  const dbUri = config.get<string>('dbUri');
  try {
    await mongoose.connect(dbUri);
    logger.info(`Connected to db`);
  } catch (error) {
    logger.info(`Db connection error: ${error}`);
    process.exit(1); // stop the process if connection fails (1 = failure)
  }
}

export default connect;
