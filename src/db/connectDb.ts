import { db } from './postgresConfig';
import logger from '../utils/logger.util';

const connectToDb = async () => {
  try {
    await db.connect();
    logger.info('Connected to PostgreSQL database');
  } catch (error: any) {
    logger.error('Error connecting to PostgreSQL database', error.message);
  }
};
export default connectToDb;
