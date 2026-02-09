# MongoDB Docker Setup

This folder contains the MongoDB Docker configuration for the Weather Tracker application.

## Quick Start

1. **Start MongoDB:**
   ```bash
   docker-compose up -d
   ```

2. **Stop MongoDB:**
   ```bash
   docker-compose down
   ```

3. **Stop and remove data:**
   ```bash
   docker-compose down -v
   ```

## Configuration

- **Image:** MongoDB 7.0
- **Port:** 27017 (mapped to host)
- **Authentication:** Disabled (for development)
- **Database:** weather_tracker

## Connection String

For local development:
```
mongodb://localhost:27017/
```

Or connect to specific database:
```
mongodb://localhost:27017/weather_tracker
```

## Initialization

The `init-mongo.js` script runs on first container creation and:
- Creates the `weather_tracker` database
- Creates the `users` collection
- Sets up indexes on email (unique) and username

## Health Check

The container includes a health check that pings MongoDB every 10 seconds to ensure it's running properly.

## Data Persistence

MongoDB data is persisted in a Docker volume named `mongodb_data`. This ensures your data survives container restarts.
