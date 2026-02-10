import { createApp } from "./app";
import { config } from "./config";
import { connectToMongoDB, closeMongoDB } from "./db/connection";
import { createLogger } from "./logger/LoggerFactory";

const logger = createLogger("Server");

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectToMongoDB();

    // Create and start Express app
    const app = createApp();

    const server = app.listen(config.port, () => {
      logger.info("Server is running", {
        port: config.port,
        environment: config.nodeEnv,
      });
    });

    // Graceful shutdown
    const shutdown = async () => {
      logger.info("Shutting down gracefully");
      
      server.close(() => {
        logger.info("HTTP server closed");
      });

      await closeMongoDB();
      process.exit(0);
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (error) {
    logger.fatal("Failed to start server", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    process.exit(1);
  }
};

startServer();