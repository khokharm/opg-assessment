# weather.ai Setup Guide

Complete setup guide for the weather.ai application - an AI-powered weather prediction platform using machine learning algorithms.

## Prerequisites

- Node.js (v18 or higher)
- Docker Desktop (for MongoDB)
- Git

## Quick Start

### 1. Start MongoDB

Navigate to the `db` folder and start MongoDB using Docker:

```bash
cd db
docker-compose up -d
```

Verify MongoDB is running:

```bash
docker-compose ps
```

You should see the `weather-ai-mongodb` container running.

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Configure Environment Variables

Copy the example environment file and update it:

```bash
cp .env.example .env
```

The `.env` file should contain:

```env
# Server Configuration
NODE_ENV=development
PORT=4000

# NWS API Configuration
NWS_USER_AGENT=your-app@example.com

# MongoDB Configuration
MONGODB_URL=mongodb://admin:admin123@localhost:27017/weather_ai?authSource=admin
MONGODB_DB_NAME=weather_ai

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-minimum-32-chars
JWT_EXPIRES_IN=7d
```

**Important:** Change the `JWT_SECRET` to a secure random string in production!

### 4. Start the Backend Server

```bash
npm run dev
```

You should see:

```
Connecting to MongoDB...
✅ Successfully connected to MongoDB database: weather_ai
🚀 Server is running on port 4000
📝 Environment: development
```

### 5. Test the Setup

#### Option 1: Using cURL

Register a new user:

```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "username": "testuser"
  }'
```

Get current user info:

```bash
curl -X GET http://localhost:4000/api/auth/me -b cookies.txt
```

#### Option 2: Using Postman

1. Import the Postman collection from `backend/test/postman/`
2. Set up an environment variable: `BASE_URL = http://localhost:4000`
3. Test the authentication endpoints

## Project Structure

```
opg-assessment/
├── db/                              # MongoDB Docker setup
│   ├── docker-compose.yml          # Docker configuration
│   ├── init-mongo.js               # Database initialization script
│   └── README.md                   # MongoDB setup documentation
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── auth.ts            # Authentication endpoints
│   │   │   ├── userCities.ts      # User cities management
│   │   │   └── weather.ts         # Weather endpoints
│   │   ├── middleware/
│   │   │   └── auth.ts            # JWT authentication middleware
│   │   ├── db/
│   │   │   ├── connection.ts      # Mongoose connection
│   │   │   ├── models/
│   │   │   │   └── User.ts        # User Mongoose schema and model
│   │   │   ├── repositories/
│   │   │   │   └── userRepository.ts  # User database operations
│   │   │   └── index.ts           # Database exports
│   │   ├── routes/
│   │   │   ├── auth.ts            # Auth routes
│   │   │   ├── userCities.ts      # User cities routes
│   │   │   └── weather.ts         # Weather routes
│   │   ├── types/
│   │   │   ├── express.d.ts       # Express type extensions
│   │   │   └── Weather.ts         # Weather type definitions
│   │   ├── service/
│   │   │   ├── geocoding.ts       # Location search service
│   │   │   └── nws.ts             # Weather service
│   │   ├── app.ts                 # Express app configuration
│   │   ├── server.ts              # Server entry point
│   │   └── config.ts              # Configuration and env validation
│   ├── .env                       # Environment variables
│   └── package.json
│
└── frontend/                       # Frontend application (Next.js)
```

## API Endpoints

### Public Endpoints

- `GET /health` - Health check
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/weather` - Get weather for a location
- `POST /api/weather/multiple` - Get weather for multiple locations
- `GET /api/search` - Search for locations

### Protected Endpoints (Require Authentication)

- `GET /api/auth/me` - Get current user
- `POST /api/user/cities` - Add city to tracked list
- `DELETE /api/user/cities/:cityId` - Remove city from tracked list
- `GET /api/user/cities` - Get all tracked cities
- `GET /api/user/cities/weather` - Get weather for all tracked cities

See [AUTH_API_DOCUMENTATION.md](backend/AUTH_API_DOCUMENTATION.md) for detailed API documentation.

## Database Schema

### Users Collection (Mongoose)

The application uses Mongoose ODM for MongoDB interactions. The User schema is defined in `backend/src/db/models/User.ts`.

```javascript
{
  _id: ObjectId,
  email: String (unique, indexed, lowercase),
  password: String (hashed with bcrypt via pre-save hook),
  username: String (unique, indexed),
  trackedCities: [
    {
      id: String,
      name: String,
      lat: Number,
      lon: Number,
      addedAt: Date (default: now)
    }
  ],
  createdAt: Date (auto-generated by Mongoose),
  updatedAt: Date (auto-updated by Mongoose)
}
```

**Mongoose Features:**
- Automatic password hashing via pre-save middleware
- Instance method `comparePassword()` for authentication
- Password excluded from JSON responses via `toJSON` transform
- Indexes on email and username for fast lookups
- Timestamps managed automatically

## Development Workflow

### Starting Development

1. Start MongoDB: `cd db && docker-compose up -d`
2. Start backend: `cd backend && npm run dev`
3. Start frontend: `cd frontend && npm run dev` (when ready)

### Stopping Services

```bash
# Stop backend (Ctrl+C in terminal)

# Stop MongoDB
cd db
docker-compose down

# Stop MongoDB and remove data
docker-compose down -v
```

### Type Checking

```bash
cd backend
npm run typecheck
```

### Building for Production

```bash
cd backend
npm run build
npm start
```

## Troubleshooting

### MongoDB Connection Issues

**Problem:** `MongoDB connection error: connect ECONNREFUSED`

**Solution:**
1. Verify Docker is running: `docker ps`
2. Restart MongoDB: `cd db && docker-compose restart`
3. Check MongoDB logs: `docker-compose logs mongodb`

### Authentication Issues

**Problem:** `Authentication required` or `Invalid token`

**Solution:**
1. Ensure cookies are being sent with requests (use `credentials: 'include'` in fetch)
2. Check that JWT_SECRET is set in `.env`
3. Try logging in again to get a fresh token

### Port Already in Use

**Problem:** `EADDRINUSE: address already in use :::4000`

**Solution:**
1. Find and kill the process using port 4000:
   ```bash
   # Windows
   netstat -ano | findstr :4000
   taskkill /PID <PID> /F
   
   # macOS/Linux
   lsof -ti:4000 | xargs kill -9
   ```
2. Or change the PORT in `.env`

## Security Best Practices

### For Production

1. **Change JWT Secret:**
   - Generate a secure random string (32+ characters)
   - Use `crypto.randomBytes(32).toString('hex')`

2. **Update MongoDB Credentials:**
   - Change admin username/password in `docker-compose.yml`
   - Update `MONGODB_URL` in `.env`

3. **Configure CORS:**
   - Update CORS origin in `app.ts` to specific domains
   - Don't use `origin: true` in production

4. **Use HTTPS:**
   - Enable SSL/TLS
   - Set `secure: true` for cookies

5. **Environment Variables:**
   - Never commit `.env` to version control
   - Use environment-specific configuration

6. **Rate Limiting:**
   - Implement rate limiting on auth endpoints
   - Consider using express-rate-limit

## Next Steps

1. **Frontend Integration:**
   - Create login/register forms
   - Implement authenticated API calls
   - Add city tracking UI

2. **Additional Features:**
   - Password reset functionality
   - Email verification
   - User profile management
   - City search with autocomplete

3. **Testing:**
   - Write unit tests for models
   - Add integration tests for API endpoints
   - Test authentication flows

4. **Deployment:**
   - Set up CI/CD pipeline
   - Deploy MongoDB to cloud (MongoDB Atlas)
   - Deploy backend to cloud platform

## Support

For issues and questions:
1. Check the [AUTH_API_DOCUMENTATION.md](backend/AUTH_API_DOCUMENTATION.md)
2. Review MongoDB logs: `cd db && docker-compose logs`
3. Check backend logs in the terminal

## License

MIT
