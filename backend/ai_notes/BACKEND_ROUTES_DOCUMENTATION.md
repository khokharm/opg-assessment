# Backend Routes Documentation

Complete documentation of all API endpoints, their dependencies, and external API usage.

---

## Table of Contents
1. [Authentication Routes](#authentication-routes)
2. [User Cities Routes](#user-cities-routes)
3. [Weather Routes](#weather-routes)
4. [Health Check](#health-check)
5. [External APIs Used](#external-apis-used)
6. [Database Models](#database-models)

---

## Authentication Routes

**Base Path:** `/api/auth`

### 1. Register User
- **Endpoint:** `POST /api/auth/register`
- **Access:** Public
- **Authentication:** None required
- **Description:** Register a new user account

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "username": "username"
}
```

**Validations:**
- Email: Must be valid email format
- Password: Minimum 6 characters
- Username: 3-30 characters

**Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "_id": "userId",
    "email": "user@example.com",
    "username": "username",
    "trackedCities": []
  },
  "token": "jwt_token"
}
```

**Dependencies:**
- **Database:** MongoDB (User collection)
- **Libraries:** 
  - `jsonwebtoken` for JWT token generation
  - `bcrypt` (via userRepository) for password hashing
  - `zod` for request validation
- **Internal Services:**
  - `createUser()` from userRepository
  - `generateToken()` helper function
  - `setAuthCookie()` helper function

**Cookie Set:**
- `auth_token`: HttpOnly, 7-day expiration

**Error Responses:**
- 400: Validation error
- 409: User already exists
- 500: Server error

---

### 2. Login User
- **Endpoint:** `POST /api/auth/login`
- **Access:** Public
- **Authentication:** None required
- **Description:** Authenticate user and receive JWT token

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "_id": "userId",
    "email": "user@example.com",
    "username": "username",
    "trackedCities": [...]
  },
  "token": "jwt_token"
}
```

**Dependencies:**
- **Database:** MongoDB (User collection)
- **Libraries:** 
  - `jsonwebtoken` for JWT token generation
  - `bcrypt` (via userRepository) for password comparison
  - `zod` for request validation
- **Internal Services:**
  - `findUserByEmail()` from userRepository
  - `comparePassword()` from userRepository
  - `generateToken()` helper function
  - `setAuthCookie()` helper function

**Cookie Set:**
- `auth_token`: HttpOnly, 7-day expiration

**Error Responses:**
- 400: Validation error
- 401: Invalid email or password
- 500: Server error

---

### 3. Logout User
- **Endpoint:** `POST /api/auth/logout`
- **Access:** Public
- **Authentication:** None required
- **Description:** Clear authentication cookie

**Response (200):**
```json
{
  "message": "Logout successful"
}
```

**Dependencies:**
- **Libraries:** None
- **Internal Services:** Cookie clearing

**Cookie Cleared:**
- `auth_token`

**Error Responses:**
- 500: Server error

---

### 4. Get Current User
- **Endpoint:** `GET /api/auth/me`
- **Access:** Private
- **Authentication:** JWT Required (via `authenticate` middleware)
- **Description:** Get authenticated user's information

**Response (200):**
```json
{
  "user": {
    "_id": "userId",
    "email": "user@example.com",
    "username": "username",
    "trackedCities": [...]
  }
}
```

**Dependencies:**
- **Database:** MongoDB (User collection via middleware)
- **Libraries:** `jsonwebtoken` (via middleware)
- **Internal Services:**
  - `authenticate` middleware
  - `sanitizeUser()` from userRepository

**Authentication:**
- Token from cookie `auth_token` or `Authorization: Bearer <token>` header
- Middleware verifies JWT and attaches user to request

**Error Responses:**
- 401: Not authenticated or invalid token
- 500: Server error

---

## User Cities Routes

**Base Path:** `/api/user`
**Global Middleware:** `authenticate` (all routes require authentication)

### 1. Add Tracked City
- **Endpoint:** `POST /api/user/cities`
- **Access:** Private
- **Authentication:** JWT Required
- **Description:** Add a city to user's tracked locations list

**Request Body:**
```json
{
  "id": "city_unique_id",
  "name": "New York, NY",
  "lat": 40.7128,
  "lon": -74.0060
}
```

**Response (201):**
```json
{
  "message": "City added successfully",
  "city": {
    "id": "city_unique_id",
    "name": "New York, NY",
    "lat": 40.7128,
    "lon": -74.0060
  },
  "trackedCities": [...]
}
```

**Dependencies:**
- **Database:** MongoDB (User collection)
- **Libraries:** `zod` for request validation
- **Internal Services:**
  - `authenticate` middleware
  - `addTrackedCity()` from userRepository

**Error Responses:**
- 400: Validation error
- 401: Not authenticated
- 409: City already tracked
- 500: Server error

---

### 2. Remove Tracked City
- **Endpoint:** `DELETE /api/user/cities/:cityId`
- **Access:** Private
- **Authentication:** JWT Required
- **Description:** Remove a city from user's tracked locations list

**URL Parameters:**
- `cityId`: City identifier

**Response (200):**
```json
{
  "message": "City removed successfully",
  "trackedCities": [...]
}
```

**Dependencies:**
- **Database:** MongoDB (User collection)
- **Internal Services:**
  - `authenticate` middleware
  - `removeTrackedCity()` from userRepository

**Error Responses:**
- 400: City ID required
- 401: Not authenticated
- 500: Server error

---

### 3. Get Tracked Cities
- **Endpoint:** `GET /api/user/cities`
- **Access:** Private
- **Authentication:** JWT Required
- **Description:** Get all cities tracked by the user

**Response (200):**
```json
{
  "trackedCities": [
    {
      "id": "city_id",
      "name": "City Name",
      "lat": 40.0,
      "lon": -74.0
    }
  ],
  "count": 1
}
```

**Dependencies:**
- **Database:** MongoDB (User collection)
- **Internal Services:**
  - `authenticate` middleware
  - `getTrackedCities()` from userRepository

**Error Responses:**
- 401: Not authenticated
- 500: Server error

---

### 4. Get Weather for Tracked Cities
- **Endpoint:** `GET /api/user/cities/weather`
- **Access:** Private
- **Authentication:** JWT Required
- **Description:** Get current weather data for all user's tracked cities

**Response (200):**
```json
{
  "weatherData": [
    {
      "location": {
        "id": "city_id",
        "name": "City Name",
        "lat": 40.0,
        "lon": -74.0
      },
      "current": {
        "temperature": 72,
        "temperatureUnit": "F",
        "description": "Partly Cloudy",
        "humidity": 65,
        "windSpeed": 10,
        "windDirection": 180,
        "visibility": 10.0,
        "pressure": 29.92,
        "timestamp": "2024-01-01T12:00:00Z"
      },
      "forecast": [...],
      "lastUpdated": "2024-01-01T12:00:00Z"
    }
  ],
  "count": 1
}
```

**Dependencies:**
- **Database:** MongoDB (User collection)
- **External APIs:** 
  - **NWS API** (National Weather Service) - `https://api.weather.gov`
    - `/points/{lat},{lon}` - Get grid point data
    - `{forecastUrl}` - Get 7-day forecast
    - `{observationStationsUrl}` - Get nearby stations
    - `/stations/{stationId}/observations/latest` - Get current conditions
- **Libraries:** `axios` for HTTP requests
- **Internal Services:**
  - `authenticate` middleware
  - `getTrackedCities()` from userRepository
  - `nwsService.getWeatherData()` from nws service

**Notes:**
- Fetches weather data in parallel for all tracked cities
- Returns partial data if some cities fail to fetch
- Includes error message for failed cities

**Error Responses:**
- 401: Not authenticated
- 500: Server error

---

## Weather Routes

**Base Path:** `/api`

### 1. Get Weather for Single Location
- **Endpoint:** `GET /api/weather`
- **Access:** Public
- **Authentication:** None required
- **Description:** Get weather data for a specific location by coordinates

**Query Parameters:**
- `lat` (required): Latitude
- `lon` (required): Longitude
- `name` (optional): Location name for display

**Example:**
```
GET /api/weather?lat=40.7128&lon=-74.0060&name=New%20York
```

**Response (200):**
```json
{
  "location": {
    "id": "40.7128_-74.0060",
    "name": "New York",
    "lat": 40.7128,
    "lon": -74.0060
  },
  "current": {
    "temperature": 72,
    "temperatureUnit": "F",
    "description": "Partly Cloudy",
    "icon": "https://api.weather.gov/icons/...",
    "humidity": 65,
    "windSpeed": 10,
    "windDirection": 180,
    "visibility": 10.0,
    "pressure": 29.92,
    "timestamp": "2024-01-01T12:00:00Z"
  },
  "forecast": [
    {
      "number": 1,
      "name": "Today",
      "startTime": "2024-01-01T12:00:00-05:00",
      "endTime": "2024-01-01T18:00:00-05:00",
      "isDaytime": true,
      "temperature": 75,
      "temperatureUnit": "F",
      "windSpeed": "10 mph",
      "windDirection": "S",
      "shortForecast": "Partly Cloudy",
      "detailedForecast": "Partly cloudy with...",
      "icon": "https://api.weather.gov/icons/..."
    }
  ],
  "lastUpdated": "2024-01-01T12:00:00Z"
}
```

**Dependencies:**
- **External APIs:** 
  - **NWS API** (National Weather Service) - `https://api.weather.gov`
    - `/points/{lat},{lon}` - Get grid point data and forecast URL
    - `{forecastUrl}` - Get 7-day forecast periods
    - `{observationStationsUrl}` - Get list of nearby observation stations
    - `/stations/{stationId}/observations/latest` - Get current weather observations
- **Libraries:** `axios` for HTTP requests
- **Internal Services:**
  - `nwsService.getWeatherData()` from nws service

**NWS API Call Chain:**
1. `GET /points/{lat},{lon}` → Returns forecast URL and stations URL
2. `GET {forecastUrl}` → Returns 14-period forecast (7 days, day/night)
3. `GET {observationStationsUrl}` → Returns list of nearby stations
4. `GET /stations/{stationId}/observations/latest` → Returns current conditions

**Data Transformations:**
- Temperature: Celsius → Fahrenheit
- Wind Speed: km/h → mph
- Visibility: meters → miles
- Pressure: Pascals → inHg (inches of mercury)

**Error Responses:**
- 400: Missing or invalid coordinates
- 500: Failed to fetch weather data (NWS API error)

---

### 2. Get Weather for Multiple Locations
- **Endpoint:** `POST /api/weather/multiple`
- **Access:** Public
- **Authentication:** None required
- **Description:** Get weather data for multiple locations in a single request

**Request Body:**
```json
{
  "locations": [
    {
      "id": "location1",
      "name": "New York",
      "lat": 40.7128,
      "lon": -74.0060
    },
    {
      "id": "location2",
      "name": "Los Angeles",
      "lat": 34.0522,
      "lon": -118.2437
    }
  ]
}
```

**Response (200):**
```json
[
  {
    "location": {...},
    "current": {...},
    "forecast": [...],
    "lastUpdated": "2024-01-01T12:00:00Z"
  },
  {
    "location": {...},
    "current": {...},
    "forecast": [...],
    "lastUpdated": "2024-01-01T12:00:00Z"
  }
]
```

**Dependencies:**
- **External APIs:** 
  - **NWS API** (National Weather Service) - Same as single weather endpoint
- **Libraries:** `axios` for HTTP requests
- **Internal Services:**
  - `nwsService.getWeatherData()` from nws service

**Notes:**
- Fetches weather data in parallel for all locations
- Returns partial data if some locations fail
- Includes error field for failed locations

**Error Responses:**
- 400: Invalid request (locations must be non-empty array)
- 500: Server error

---

### 3. Search Locations
- **Endpoint:** `GET /api/search`
- **Access:** Public
- **Authentication:** None required
- **Description:** Search for locations by name (US only)

**Query Parameters:**
- `query` (required): Search term (city name, address, etc.)

**Example:**
```
GET /api/search?query=New%20York
```

**Response (200):**
```json
[
  {
    "id": "40.7128_-74.0060",
    "name": "New York, New York",
    "lat": 40.7128,
    "lon": -74.0060,
    "displayName": "New York, New York County, New York, United States"
  },
  {
    "id": "43.0003_-78.7869",
    "name": "New York, Erie",
    "lat": 43.0003,
    "lon": -78.7869,
    "displayName": "New York, Erie County, New York, United States"
  }
]
```

**Dependencies:**
- **External APIs:** 
  - **Nominatim API** (OpenStreetMap) - `https://nominatim.openstreetmap.org`
    - `/search` - Search for locations
    - Parameters:
      - `q`: Search query
      - `format`: json
      - `addressdetails`: 1 (include address components)
      - `countrycodes`: us (restrict to USA)
      - `limit`: 5 (max results)
- **Libraries:** `axios` for HTTP requests
- **Internal Services:**
  - `geocodingService.searchLocation()` from geocoding service
  - `geocodingService.formatLocationName()` for formatting

**Response Format:**
- Returns up to 5 matching locations
- Filtered to US locations only (NWS API requirement)
- Includes formatted name and full display name

**Error Responses:**
- 400: Missing or invalid query parameter
- 500: Failed to search locations

---

## Health Check

### Health Check Endpoint
- **Endpoint:** `GET /health`
- **Access:** Public
- **Authentication:** None required
- **Description:** Simple health check for monitoring

**Response (200):**
```json
{
  "status": "ok"
}
```

**Dependencies:** None

---

## External APIs Used

### 1. National Weather Service (NWS) API
- **Base URL:** `https://api.weather.gov`
- **Purpose:** Weather data for US locations
- **Authentication:** None (requires User-Agent header)
- **Rate Limiting:** Not specified, but recommended to cache data
- **Documentation:** https://www.weather.gov/documentation/services-web-api

**Endpoints Used:**
- `GET /points/{latitude},{longitude}` - Get grid point metadata
- `GET {forecastUrl}` - Get 7-day forecast (URL from points response)
- `GET {observationStationsUrl}` - Get nearby observation stations
- `GET /stations/{stationId}/observations/latest` - Get current observations

**Data Provided:**
- 7-day forecast with day/night periods
- Current temperature, humidity, wind, pressure
- Detailed weather descriptions
- Weather icons

**Requirements:**
- Valid User-Agent header required
- Coordinates must be within US territory
- Returns 404 for non-US locations

---

### 2. Nominatim API (OpenStreetMap)
- **Base URL:** `https://nominatim.openstreetmap.org`
- **Purpose:** Geocoding and location search
- **Authentication:** None (requires User-Agent header)
- **Rate Limiting:** 1 request per second
- **Documentation:** https://nominatim.org/release-docs/latest/api/Overview/

**Endpoints Used:**
- `GET /search` - Search for locations by name

**Data Provided:**
- Location coordinates (lat/lon)
- Display name and address components
- Place importance/relevance

**Requirements:**
- Valid User-Agent header required
- Filtered to US locations only (countrycodes=us)

---

## Database Models

### User Model
**Collection:** `users`

**Schema:**
```typescript
{
  _id: ObjectId,
  email: string (unique, required),
  username: string (required),
  password: string (hashed, required),
  trackedCities: [
    {
      id: string,
      name: string,
      lat: number,
      lon: number
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `email`: Unique index for fast lookups
- `trackedCities.id`: Index for efficient city operations

**Repository Operations:**
- `createUser(email, password, username)` - Create new user with hashed password
- `findUserByEmail(email)` - Find user by email
- `findUserById(id)` - Find user by MongoDB _id
- `comparePassword(user, password)` - Compare plaintext with hashed password
- `addTrackedCity(userId, city)` - Add city to tracked list
- `removeTrackedCity(userId, cityId)` - Remove city from tracked list
- `getTrackedCities(userId)` - Get user's tracked cities array
- `sanitizeUser(user)` - Remove password from user object

---

## Middleware

### Authentication Middleware (`authenticate`)
**Location:** `src/middleware/auth.ts`

**Purpose:** Verify JWT token and attach user to request

**Token Sources (in order of precedence):**
1. `auth_token` cookie (HttpOnly)
2. `Authorization: Bearer <token>` header

**Process:**
1. Extract token from cookie or header
2. Verify JWT signature and expiration
3. Extract userId from token payload
4. Find user in database by userId
5. Attach user object to `req.user`
6. Call `next()` to proceed

**Error Cases:**
- 401: No token provided
- 401: Token expired
- 401: Invalid token signature
- 401: User not found in database
- 500: Database or other error

**Usage:**
- Applied globally to `/api/user/*` routes
- Applied individually to `/api/auth/me` route

---

### Optional Authentication Middleware (`optionalAuthenticate`)
**Location:** `src/middleware/auth.ts`

**Purpose:** Attach user to request if token exists, but don't fail if missing

**Usage:** Not currently used but available for future routes that should work differently for authenticated vs anonymous users

---

## Configuration

### Environment Variables
- `JWT_SECRET` - Secret key for JWT signing
- `JWT_EXPIRES_IN` - JWT expiration time (e.g., "7d")
- `NODE_ENV` - Environment (development/production)
- `NWS_USER_AGENT` - User agent for NWS API requests
- `MONGODB_URI` - MongoDB connection string

### CORS Configuration
- **Origin:** `true` (allow all origins in development)
- **Credentials:** `true` (allow cookies)
- **Note:** Should be restricted in production

---

## Request/Response Patterns

### Common Response Formats

**Success Response:**
```json
{
  "message": "Operation successful",
  "data": {...}
}
```

**Error Response:**
```json
{
  "error": "Error message",
  "details": {...} // Optional, for validation errors
}
```

**Validation Error Response:**
```json
{
  "error": "Validation error",
  "details": [
    {
      "code": "invalid_type",
      "expected": "string",
      "received": "undefined",
      "path": ["email"],
      "message": "Invalid email address"
    }
  ]
}
```

### HTTP Status Codes Used
- **200** - Success (GET, DELETE)
- **201** - Created (POST for new resources)
- **400** - Bad Request (validation errors)
- **401** - Unauthorized (authentication required/failed)
- **404** - Not Found (catch-all route)
- **409** - Conflict (duplicate resource)
- **500** - Internal Server Error

---

## Summary Statistics

**Total Endpoints:** 12
- **Public:** 7 endpoints
- **Private (Auth Required):** 5 endpoints

**External API Dependencies:** 2
- NWS API (4 endpoint calls per weather request)
- Nominatim API (1 endpoint call per search)

**Database Collections:** 1
- Users (with embedded trackedCities)

**Route Groups:** 4
- Health (1 endpoint)
- Authentication (4 endpoints)
- User Cities (4 endpoints)
- Weather (3 endpoints)
