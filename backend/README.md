# Backend - Weather Tracker API

Express.js REST API with TypeScript, MongoDB, JWT authentication, and external weather API integration.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Getting Started](#getting-started)
5. [API Endpoints](#api-endpoints)
6. [Architecture](#architecture)
7. [Database](#database)
8. [Authentication](#authentication)
9. [External APIs](#external-apis)
10. [Environment Variables](#environment-variables)
11. [Security](#security)
12. [Testing](#testing)
13. [Deployment](#deployment)
14. [Troubleshooting](#troubleshooting)

---

## Overview

The backend is a RESTful API server that provides:

- **User Authentication** - JWT-based login/registration
- **Weather Data** - Real-time weather from National Weather Service
- **Location Search** - Geocoding via Nominatim/OpenStreetMap
- **User Profiles** - Track favorite cities
- **Security** - Helmet, CORS, input validation, password hashing

**API Base URL:** http://localhost:4000

---

## Tech Stack

### Core Framework
- **Node.js 18+** - JavaScript runtime
- **Express.js 4.19** - Web framework
- **TypeScript 5.4** - Type safety

### Database & ORM
- **MongoDB 8.23** - NoSQL database
- **Mongoose 8.23** - MongoDB ODM

### Authentication & Security
- **jsonwebtoken 9.0** - JWT tokens
- **bcryptjs 3.0** - Password hashing
- **Helmet 8.1** - Security headers
- **CORS 2.8** - Cross-origin resource sharing
- **cookie-parser 1.4** - Cookie handling

### Validation & HTTP
- **Zod 4.3** - Schema validation
- **Axios 1.13** - HTTP client for external APIs

### Logging
- **Pino 8.21** - High-performance logging
- **pino-http 9.0** - HTTP request logging
- **pino-pretty 11.3** - Pretty console logs

### Development
- **tsx 4.15** - TypeScript execution with hot reload
- **dotenv 16.4** - Environment variables

---

## Project Structure

```
backend/
├── src/
│   ├── app.ts                    # Express app setup
│   ├── server.ts                 # Server entry point
│   ├── config.ts                 # Configuration management
│   ├── env.ts                    # Environment validation
│   │
│   ├── controllers/              # Route handlers
│   │   ├── auth.ts              # Authentication logic
│   │   ├── userCities.ts        # User cities management
│   │   └── weather.ts           # Weather data fetching
│   │
│   ├── routes/                   # API routes
│   │   ├── auth.ts              # /api/auth endpoints
│   │   ├── userCities.ts        # /api/user/cities endpoints
│   │   ├── weather.ts           # /api/weather endpoints
│   │   └── health.ts            # /health endpoint
│   │
│   ├── middleware/               # Express middleware
│   │   └── auth.ts              # JWT authentication middleware
│   │
│   ├── db/                       # Database layer
│   │   ├── connection.ts        # MongoDB connection
│   │   ├── index.ts             # Database exports
│   │   ├── models/
│   │   │   └── User.ts          # User schema & model
│   │   └── repositories/
│   │       └── userRepository.ts # User database operations
│   │
│   ├── service/                  # External API clients
│   │   ├── nws.ts               # National Weather Service API
│   │   └── geocoding.ts         # Nominatim geocoding API
│   │
│   ├── logger/                   # Logging infrastructure
│   │   ├── index.ts             # Logger exports
│   │   ├── PinoLogger.ts        # Pino implementation
│   │   ├── auditLogger.ts       # Audit logging
│   │   ├── LoggerFactory.ts     # Logger factory
│   │   └── ILogger.ts           # Logger interface
│   │
│   └── types/                    # TypeScript types
│       ├── express.d.ts         # Express type extensions
│       └── Weather.ts           # Weather data types
│
├── test/
│   └── postman/                  # Postman test collections
│       ├── backend-api-integration-tests.postman_collection.json
│       ├── auth-api.postman_collection.json
│       └── README.md
│
├── ai_notes/                     # Documentation
│   ├── BACKEND_ROUTES_DOCUMENTATION.md
│   ├── AUTH_API_DOCUMENTATION.md
│   └── NWS-API-DIAGRAM.md
│
├── .env.example                  # Environment template
├── .gitignore                    # Git ignore rules
├── Dockerfile                    # Docker configuration
├── package.json                  # Dependencies & scripts
├── tsconfig.json                 # TypeScript configuration
└── README.md                     # This file
```

---

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB (via Docker or local install)

### Installation

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your configuration
nano .env

# Start MongoDB (if using Docker)
cd .. && docker-compose up -d mongodb

# Start development server
npm run dev
```

**Server runs on:** http://localhost:4000

---

## API Endpoints

### Health Check

```http
GET /health
```

Returns server status.

### Authentication (Public)

```http
POST   /api/auth/register    # Register new user
POST   /api/auth/login        # Login user
POST   /api/auth/logout       # Logout user
GET    /api/auth/me           # Get current user (requires auth)
```

### Weather (Public)

```http
GET    /api/weather           # Get weather by coordinates
POST   /api/weather/multiple  # Get weather for multiple locations
GET    /api/search            # Search for US cities
```

### User Cities (Protected - Requires Authentication)

```http
POST   /api/user/cities            # Add city to tracked list
GET    /api/user/cities            # Get all tracked cities
DELETE /api/user/cities/:cityId    # Remove tracked city
GET    /api/user/cities/weather    # Get weather for all tracked cities
```

**Full API Documentation:** 
- [../API_DOCUMENTATION.md](../API_DOCUMENTATION.md)
- [AUTH_API_DOCUMENTATION.md](AUTH_API_DOCUMENTATION.md)
- [ai_notes/BACKEND_ROUTES_DOCUMENTATION.md](ai_notes/BACKEND_ROUTES_DOCUMENTATION.md)

---

## Architecture

### Request Flow

```
Client Request
    ↓
Express Middleware Stack
    ↓ (CORS, Helmet, JSON parser, Cookie parser)
Router
    ↓ (Route matching)
Middleware (Optional)
    ↓ (Authentication, Validation)
Controller
    ↓ (Business logic)
Service / Repository
    ↓ (External APIs / Database)
Response
```

### Layered Architecture

1. **Routes Layer** (`routes/`)
   - Define HTTP endpoints
   - Apply middleware
   - Delegate to controllers

2. **Controllers Layer** (`controllers/`)
   - Handle HTTP requests/responses
   - Input validation with Zod
   - Error handling

3. **Service Layer** (`service/`)
   - External API integration
   - Business logic
   - Data transformation

4. **Repository Layer** (`db/repositories/`)
   - Database operations
   - Query abstraction
   - Data access logic

5. **Model Layer** (`db/models/`)
   - Database schemas
   - Data validation
   - Relationships

---

## Database

### MongoDB with Mongoose

**Connection:** Managed in `src/db/connection.ts`

### User Schema

```typescript
{
  email: String (unique, required),
  username: String (unique, required),
  password: String (hashed, required),
  trackedCities: [
    {
      id: String,
      name: String,
      lat: Number,
      lon: Number,
      addedAt: Date
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

### Repository Pattern

All database operations go through repositories:

```typescript
// userRepository.ts
export const createUser = async (email, password, username)
export const findUserByEmail = async (email)
export const findUserById = async (id)
export const addTrackedCity = async (userId, city)
export const removeTrackedCity = async (userId, cityId)
export const getTrackedCities = async (userId)
```

**Benefits:**
- Centralized data access
- Easier testing
- Business logic separation
- Consistent error handling

### Database Operations

```bash
# Start MongoDB (Docker)
docker-compose up -d mongodb

# Check MongoDB status
docker ps | grep mongodb

# View MongoDB logs
docker logs weather-tracker-mongodb

# Connect to MongoDB shell
docker exec -it weather-tracker-mongodb mongosh -u admin -p admin123
```

**Related:** [../db/README.md](../db/README.md)

---

## Authentication

### JWT Token Flow

1. **Registration/Login:**
   - User submits credentials
   - Password hashed with bcrypt
   - JWT token generated
   - Token stored in httpOnly cookie

2. **Authenticated Requests:**
   - Client sends cookie automatically
   - Middleware extracts token
   - Token verified with JWT_SECRET
   - User attached to `req.user`

3. **Logout:**
   - Cookie cleared
   - Token remains valid until expiration

### Middleware

**Location:** `src/middleware/auth.ts`

```typescript
import { authenticate } from './middleware/auth';

// Protect route
router.get('/protected', authenticate, handler);

// Inside handler
req.user // User object
```

### Token Structure

```json
{
  "userId": "507f1f77bcf86cd799439011",
  "iat": 1704067200,
  "exp": 1704672000
}
```

### Security Features

- ✅ Password hashing (bcrypt, 10 rounds)
- ✅ HttpOnly cookies (XSS protection)
- ✅ SameSite: strict (CSRF protection)
- ✅ Secure flag in production
- ✅ 7-day token expiration
- ✅ JWT signature verification

**Related:** [AUTH_API_DOCUMENTATION.md](AUTH_API_DOCUMENTATION.md)

---

## External APIs

### 1. National Weather Service (NWS)

**Purpose:** Weather forecasts and current conditions

**Base URL:** `https://api.weather.gov`

**Endpoints Used:**
1. `GET /points/{lat},{lon}` - Convert coordinates to grid
2. `GET /gridpoints/{office}/{x},{y}/forecast` - Get 7-day forecast
3. `GET /gridpoints/{office}/{x},{y}/stations` - Get weather stations
4. `GET /stations/{stationId}/observations/latest` - Current conditions

**Service:** `src/service/nws.ts`

**Requirements:**
- User-Agent header required
- US locations only
- No API key needed

**Related:** [ai_notes/NWS-API-DIAGRAM.md](ai_notes/NWS-API-DIAGRAM.md)

---

### 2. Nominatim (OpenStreetMap)

**Purpose:** Geocoding and location search

**Base URL:** `https://nominatim.openstreetmap.org`

**Endpoints Used:**
- `GET /search` - Search for locations by name

**Service:** `src/service/geocoding.ts`

**Requirements:**
- User-Agent header required
- Rate limit: 1 request/second
- Free, no API key

**Usage:**
```typescript
import { searchLocation } from './service/geocoding';

const results = await searchLocation('Boston');
```

---

## Environment Variables

### Required Variables

Create `.env` file from `.env.example`:

```env
# Server Configuration
NODE_ENV=development
PORT=4000

# MongoDB Configuration
MONGODB_URL=mongodb://admin:admin123@localhost:27017/weather_tracker?authSource=admin
MONGODB_DB_NAME=weather_tracker

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-minimum-32-chars
JWT_EXPIRES_IN=7d

# NWS API Configuration
NWS_USER_AGENT=WeatherTracker/1.0 (your-email@example.com)

# Logging Configuration
LOG_LEVEL=info
```

### Environment Validation

Environment variables are validated at startup using Zod:

**Location:** `src/config.ts`

```typescript
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  PORT: z.number().min(1).max(65535),
  MONGODB_URL: z.string().url(),
  JWT_SECRET: z.string().min(32), // Enforced!
  // ... more validation
});
```

**Benefits:**
- Fail fast on startup
- Type-safe configuration
- Clear error messages

---

## Security

### Implemented Security Features

1. **Helmet** - Security headers
   ```typescript
   helmet({
     contentSecurityPolicy: false,
     crossOriginEmbedderPolicy: false,
   })
   ```

2. **CORS** - Cross-origin protection
   ```typescript
   cors({
     origin: true, // TODO: Restrict in production
     credentials: true,
   })
   ```

3. **Input Validation** - Zod schemas
   ```typescript
   const registerSchema = z.object({
     email: z.email(),
     password: z.string().min(6),
     username: z.string().min(3).max(30),
   });
   ```

4. **Password Hashing** - bcrypt
   ```typescript
   // Automatic via Mongoose pre-save hook
   userSchema.pre('save', async function (next) {
     if (this.isModified('password')) {
       this.password = await bcrypt.hash(this.password, 10);
     }
   });
   ```

5. **JWT Authentication** - Secure tokens
6. **HttpOnly Cookies** - XSS protection
7. **SameSite Cookies** - CSRF protection

### Security Recommendations

⚠️ **Missing Critical Security:**
- Rate limiting (package installed but not implemented!)
- Request size limits
- CORS origin restriction for production
- MongoDB injection protection
- Audit logging implementation

**Full Security Assessment:** [../SECURITY_ASSESSMENT.md](../SECURITY_ASSESSMENT.md)

---

## Testing

### Postman Collections

**Location:** `test/postman/`

**Available Collections:**
1. `backend-api-integration-tests.postman_collection.json` - Full API tests
2. `auth-api.postman_collection.json` - Authentication tests
3. `3rd-party-integration-tests.postman_collection.json` - External API tests

**Setup:**
1. Import collections into Postman
2. Import environment: `backend-api-integration-tests.postman_environment.json`
3. Update `BASE_URL` to `http://localhost:4000`
4. Run collection

### Manual Testing

```bash
# Health check
curl http://localhost:4000/health

# Register user
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "username": "testuser"
  }'

# Login (save cookies)
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Get current user (use cookies)
curl http://localhost:4000/api/auth/me -b cookies.txt

# Search location
curl "http://localhost:4000/api/search?query=Boston"

# Get weather
curl "http://localhost:4000/api/weather?lat=42.3601&lon=-71.0589&name=Boston"
```

**Related:** [test/postman/README.md](test/postman/README.md)

---

## Development

### Available Scripts

```bash
npm run dev         # Start development server with hot reload
npm run build       # Compile TypeScript to dist/
npm start           # Start production server (after build)
npm run typecheck   # Check TypeScript types without building
```

### Development Workflow

1. **Start MongoDB:**
   ```bash
   docker-compose up -d mongodb
   ```

2. **Start dev server:**
   ```bash
   npm run dev
   ```

3. **Make changes** - Server auto-reloads with tsx

4. **Test changes:**
   - Use Postman collections
   - Use curl commands
   - Test with frontend

### Code Structure Guidelines

1. **Controllers** - Handle HTTP, validate input, call services
2. **Services** - Business logic, external API calls
3. **Repositories** - Database operations only
4. **Models** - Schema definitions, validations
5. **Middleware** - Reusable request processing

### Adding New Endpoint

1. **Create controller:**
   ```typescript
   // src/controllers/myFeature.ts
   export const myHandler = async (req: Request, res: Response) => {
     // Implementation
   };
   ```

2. **Create route:**
   ```typescript
   // src/routes/myFeature.ts
   import express from 'express';
   import { myHandler } from '../controllers/myFeature';
   
   const router = express.Router();
   router.get('/my-endpoint', myHandler);
   
   export default router;
   ```

3. **Register route:**
   ```typescript
   // src/app.ts
   import myFeatureRouter from './routes/myFeature';
   app.use('/api/my-feature', myFeatureRouter);
   ```

---

## Deployment

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use strong `JWT_SECRET` (32+ chars)
- [ ] Restrict CORS origins to production domain
- [ ] Enable HTTPS/SSL
- [ ] Configure MongoDB with SSL/TLS
- [ ] Set secure MongoDB credentials
- [ ] Implement rate limiting
- [ ] Add request size limits
- [ ] Enable audit logging
- [ ] Setup monitoring (PM2, New Relic, etc.)
- [ ] Configure proper logging (structured JSON)
- [ ] Disable verbose error messages

### Docker Deployment

```bash
# Build image
docker build -t weather-tracker-backend .

# Run container
docker run -p 4000:4000 --env-file .env weather-tracker-backend

# Or use Docker Compose
docker-compose up backend
```

### Manual Deployment

```bash
# Build TypeScript
npm run build

# Set environment
export NODE_ENV=production

# Start server
npm start

# Or use PM2 for process management
npm install -g pm2
pm2 start dist/server.js --name weather-api
pm2 save
pm2 startup
```

### Environment-Specific Configs

**Production `.env`:**
```env
NODE_ENV=production
PORT=4000
MONGODB_URL=mongodb+srv://user:pass@cluster.mongodb.net/weather_tracker
JWT_SECRET=<strong-random-secret-minimum-32-characters>
JWT_EXPIRES_IN=7d
LOG_LEVEL=warn
```

---

## Troubleshooting

### Common Issues

#### MongoDB Connection Failed

```bash
# Check if MongoDB is running
docker ps | grep mongodb

# View logs
docker logs weather-tracker-mongodb

# Restart MongoDB
docker-compose restart mongodb

# Verify connection string
echo $MONGODB_URL
```

#### Port 4000 Already in Use

```bash
# Find process using port
lsof -i :4000  # Mac/Linux
netstat -ano | findstr :4000  # Windows

# Kill process
npx kill-port 4000
```

#### JWT_SECRET Validation Error

```
❌ Invalid environment variables:
  - JWT_SECRET: String must contain at least 32 character(s)
```

**Solution:** Use longer JWT_SECRET in `.env`
```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-minimum-32-chars
```

#### NWS API Returns 404

- **Cause:** Location outside US territory
- **Solution:** Only use US coordinates
- Check if location is valid: https://www.weather.gov/documentation/services-web-api

#### CORS Errors from Frontend

```typescript
// Verify CORS config in app.ts
cors({
  origin: 'http://localhost:3000', // Frontend URL
  credentials: true,
})
```

#### TypeScript Build Errors

```bash
# Check types
npm run typecheck

# Clean build
rm -rf dist
npm run build
```

---

## Monitoring & Logging

### Logging System

**Logger:** Pino (high-performance JSON logger)

**Location:** `src/logger/`

**Usage:**
```typescript
import { logger } from './logger';

logger.info('User logged in', { userId, email });
logger.error('Failed to fetch weather', { error, location });
logger.warn('Rate limit exceeded', { ip, endpoint });
```

### Log Levels

- `fatal` - Application crash
- `error` - Error occurred
- `warn` - Warning message
- `info` - General information
- `debug` - Debug information
- `trace` - Very detailed tracing

**Configure in `.env`:**
```env
LOG_LEVEL=info
```

### Audit Logging

**Location:** `src/logger/auditLogger.ts`

**Usage:**
```typescript
import { auditLogger } from './logger/auditLogger';

auditLogger.info('User login', { userId, ip, userAgent });
auditLogger.warn('Failed login attempt', { email, ip });
```

**Recommended Audit Events:**
- User registration
- Login/logout
- Password changes
- City additions/removals
- Failed authentication attempts
- Suspicious activity

---

## Performance

### Optimization Tips

1. **Database Indexing:**
   ```typescript
   // Ensure indexes on frequently queried fields
   userSchema.index({ email: 1 }, { unique: true });
   userSchema.index({ username: 1 }, { unique: true });
   ```

2. **Caching:** (Future enhancement)
   - Cache weather data (15-30 minutes)
   - Cache geocoding results
   - Use Redis for session storage

3. **Parallel Requests:**
   ```typescript
   // Already implemented for multiple cities
   const results = await Promise.all(
     cities.map(city => getWeatherData(city))
   );
   ```

4. **Connection Pooling:**
   - MongoDB connection pooling configured
   - Reuse Axios instances

---

## Resources

### Documentation
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [Mongoose Docs](https://mongoosejs.com/docs/guide.html)
- [JWT.io](https://jwt.io/introduction)
- [Zod Docs](https://zod.dev/)
- [NWS API Docs](https://www.weather.gov/documentation/services-web-api)

### Related Files
- [Root README](../README.md) - Project overview
- [Frontend README](../frontend/README.md) - Frontend docs
- [API Documentation](../API_DOCUMENTATION.md) - Complete API reference
- [Security Assessment](../SECURITY_ASSESSMENT.md) - Security review
- [Setup Guide](../SETUP_GUIDE.md) - Installation guide

---

**Last Updated:** February 2026
**Node.js:** 18+
**Express:** 4.19
**MongoDB:** 8.23
