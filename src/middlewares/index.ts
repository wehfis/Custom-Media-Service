import { loggerMiddleware as logger } from './logger.middleware';
import { errorMiddleware as error } from './error.middleware';
import { fileValidatorMiddleware as file } from './file.middleware';

export default { logger, error, file };
