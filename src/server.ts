import config from './config';
import connectToDb from './db/connectDb';
import registerAppRoutes from './app';
import logger from './utils/logger.util';
import router from './router/router';
import http from 'http';

const startServer = async () => {
  try {
    const port = config.get('port');
    await connectToDb();
    await registerAppRoutes();
    const server = http.createServer((req, res) => {
      router.handleRequest(req, res);
    });

    server.on('clientError', (err, socket) => {
      logger.error('Client Error:', err);
      socket.end('HTTP/1.1 400 Bad Request');
    });

    server.listen(port, () => {
      logger.info(`Server running on port ${port}`);
    });

    process.on('unhandledRejection', (err) => {
      logger.error('Unhandled Rejection:', err);
    });

    process.on('uncaughtException', (err) => {
      logger.error('Uncaught Exception:', err);
      process.exit(1);
    });
  } catch (error) {
    logger.error('Failed to start server', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
    process.exit(1);
  }
};

startServer();
