import mongoose from 'mongoose';
import { config } from '../config';
import { createLogger } from '../logger/LoggerFactory';

const logger = createLogger('MongoDB');

/**
 * Connect to MongoDB using Mongoose
 */
export const connectToMongoDB = async (): Promise<typeof mongoose> => {
  try {
    logger.info('Connecting to MongoDB with Mongoose');
    
    await mongoose.connect(config.mongodb.url, {
      dbName: config.mongodb.dbName,
      maxPoolSize: 10,
      minPoolSize: 2,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    logger.info('Successfully connected to MongoDB', {
      database: config.mongodb.dbName,
    });
    
    // Handle connection events
    mongoose.connection.on('error', (error) => {
      logger.error('MongoDB connection error', {
        error: error.message,
        stack: error.stack,
      });
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB reconnected');
    });
    
    return mongoose;
  } catch (error) {
    logger.error('MongoDB connection failed', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw error;
  }
};

/**
 * Close MongoDB connection
 */
export const closeMongoDB = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    logger.info('MongoDB connection closed');
  } catch (error) {
    logger.error('Error closing MongoDB connection', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw error;
  }
};

/**
 * Check if MongoDB is connected
 */
export const isConnected = (): boolean => {
  return mongoose.connection.readyState === 1;
};
