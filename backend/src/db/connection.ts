import mongoose from 'mongoose';
import { config } from '../config';

/**
 * Connect to MongoDB using Mongoose
 */
export const connectToMongoDB = async (): Promise<typeof mongoose> => {
  try {
    console.log('Connecting to MongoDB with Mongoose...');
    
    await mongoose.connect(config.mongodb.url, {
      dbName: config.mongodb.dbName,
      maxPoolSize: 10,
      minPoolSize: 2,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    console.log(`✅ Successfully connected to MongoDB database: ${config.mongodb.dbName}`);
    
    // Handle connection events
    mongoose.connection.on('error', (error) => {
      console.error('❌ MongoDB connection error:', error);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected');
    });
    
    return mongoose;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
};

/**
 * Close MongoDB connection
 */
export const closeMongoDB = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
    throw error;
  }
};

/**
 * Check if MongoDB is connected
 */
export const isConnected = (): boolean => {
  return mongoose.connection.readyState === 1;
};
