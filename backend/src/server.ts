import { createApp } from "./app";
import { config } from "./config";
import { connectToMongoDB, closeMongoDB } from "./db/connection";

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectToMongoDB();

    // Create and start Express app
    const app = createApp();

    const server = app.listen(config.port, () => {
      console.log(`🚀 Server is running on port ${config.port}`);
      console.log(`📝 Environment: ${config.nodeEnv}`);
    });

    // Graceful shutdown
    const shutdown = async () => {
      console.log('\nShutting down gracefully...');
      
      server.close(() => {
        console.log('HTTP server closed');
      });

      await closeMongoDB();
      process.exit(0);
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();