// MongoDB initialization script
// This script runs when the container is first created

db = db.getSiblingDB('weather_tracker');

// Create users collection with indexes
db.createCollection('users');

// Create unique index on email
db.users.createIndex({ email: 1 }, { unique: true });

// Create index on username for faster lookups
db.users.createIndex({ username: 1 });

print('MongoDB initialized successfully for weather_tracker database');
