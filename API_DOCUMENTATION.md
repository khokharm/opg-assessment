# Weather Tracker API Documentation

Complete guide to all API endpoints and how they work together.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [API Architecture](#api-architecture)
3. [Authentication System](#authentication-system)
4. [API Endpoints](#api-endpoints)
   - [Health Check](#health-check)
   - [Authentication APIs](#authentication-apis)
   - [Location Search API](#location-search-api)
   - [Weather APIs](#weather-apis)
   - [User Tracked Cities APIs](#user-tracked-cities-apis)
5. [External API Integration](#external-api-integration)
6. [Error Handling](#error-handling)
7. [Testing Guide](#testing-guide)

---

## Overview

The Weather Tracker API is a RESTful backend service that provides:
- **User authentication** and profile management
- **Location search** for US cities
- **Real-time weather data** from the National Weather Service
- **Personal tracking** of favorite cities

**Base URL:** `http://localhost:4000`

**Tech Stack:**
- **Runtime:** Node.js with TypeScript
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Authentication:** JWT (JSON Web Tokens) with httpOnly cookies
- **External APIs:** NWS (weather data), Nominatim (geocoding)

---

## API Architecture

### How Everything Works Together

```
┌────────────────────────────────────────────────────────────────┐
│                        CLIENT APPLICATION                       │
│                      (React Frontend)                           │
└──────────────────────────────┬─────────────────────────────────┘
                               │
                               │ HTTP Requests
                               ▼
┌────────────────────────────────────────────────────────────────┐
│                     EXPRESS.JS SERVER                           │
│                                                                 │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────┐       │
│  │   Routes    │  │  Middleware  │  │  Controllers   │       │
│  │ /api/auth   │  │  - CORS      │  │  - auth.ts     │       │
│  │ /api/weather│  │  - JWT Auth  │  │  - weather.ts  │       │
│  │ /api/user   │  │  - Error     │  │  - userCities  │       │
│  │ /api/search │  │    Handling  │  │                │       │
│  └─────────────┘  └──────────────┘  └────────────────┘       │
│                                                                 │
└───────────┬────────────────────────────────┬───────────────────┘
            │                                │
            ▼                                ▼
┌─────────────────────┐         ┌────────────────────────────┐
│   MongoDB Database  │         │   External APIs            │
│   - Users           │         │   - NWS (Weather Data)     │
│   - Tracked Cities  │         │   - Nominatim (Geocoding)  │
└─────────────────────┘         └────────────────────────────┘
```

### Request Flow Example

**User wants weather for Boston:**

1. **Search Location:** `GET /api/search?query=Boston`
   - Calls Nominatim API
   - Returns Boston coordinates (42.3601, -71.0589)

2. **Get Weather:** `GET /api/weather?lat=42.3601&lon=-71.0589`
   - Calls NWS API (4 separate requests)
   - Returns current conditions + 7-day forecast

3. **Save to Favorites (if logged in):** `POST /api/user/cities`
   - Saves to MongoDB
   - Returns updated tracked cities list

4. **View Dashboard:** `GET /api/user/cities/weather`
   - Fetches weather for all saved cities
   - Returns array of weather data

---

## Authentication System

### How JWT Authentication Works

```
┌──────────────┐
│ User Registers│
│   or Logs In │
└──────┬───────┘
       │
       ▼
┌──────────────────────────────────┐
│ Server Creates JWT Token         │
│ - Contains: userId, email        │
│ - Expires: 7 days                │
│ - Signed with: JWT_SECRET        │
└──────┬───────────────────────────┘
       │
       ▼
┌──────────────────────────────────┐
│ Token Stored in httpOnly Cookie  │
│ - Name: auth_token               │
│ - HttpOnly: true (JS can't read) │
│ - Secure: true (production)      │
└──────┬───────────────────────────┘
       │
       ▼
┌──────────────────────────────────┐
│ Future Requests Include Cookie   │
│ - Browser sends automatically    │
│ - Server validates JWT           │
│ - User object attached to request│
└──────────────────────────────────┘
```

### Token Structure

**Decoded JWT:**
```json
{
  "userId": "507f1f77bcf86cd799439011",
  "email": "user@example.com",
  "iat": 1704067200,
  "exp": 1704672000
}
```

### Protected Routes

Routes requiring authentication (JWT token):
- `GET /api/auth/me` - Get current user
- `POST /api/user/cities` - Add tracked city
- `GET /api/user/cities` - Get tracked cities
- `DELETE /api/user/cities/:cityId` - Remove city
- `GET /api/user/cities/weather` - Get weather for tracked cities

**Authentication Methods:**
1. **Cookie:** `auth_token` (preferred, automatic)
2. **Header:** `Authorization: Bearer <token>` (alternative)

---

## API Endpoints

### Health Check

Simple endpoint to verify server is running.

#### Check Server Health

```http
GET /health
```

**Response (200):**
```json
{
  "status": "ok"
}
```

---

### Authentication APIs

#### 1. Register User

Create a new user account.

```http
POST /api/auth/register
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepass123",
  "username": "johndoe"
}
```

**Validation Rules:**
- `email`: Valid email format, unique
- `password`: Minimum 6 characters
- `username`: 3-30 characters, unique

**Success Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "john@example.com",
    "username": "johndoe",
    "trackedCities": [],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Cookies Set:**
- `auth_token`: JWT token (7-day expiration, httpOnly)

**Error Responses:**
- `400` - Validation error (invalid email, short password, etc.)
- `409` - Email or username already exists
- `500` - Server error

**What Happens Internally:**
1. Validates request data with Zod schema
2. Checks if email/username already exists
3. Hashes password with bcrypt (10 rounds)
4. Creates user document in MongoDB
5. Generates JWT token
6. Sets httpOnly cookie
7. Returns user data (without password)

---

#### 2. Login User

Authenticate existing user.

```http
POST /api/auth/login
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepass123"
}
```

**Success Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "john@example.com",
    "username": "johndoe",
    "trackedCities": [
      {
        "id": "42.3601_-71.0589",
        "name": "Boston, MA",
        "lat": 42.3601,
        "lon": -71.0589
      }
    ],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Cookies Set:**
- `auth_token`: JWT token (7-day expiration, httpOnly)

**Error Responses:**
- `400` - Validation error
- `401` - Invalid email or password
- `500` - Server error

**What Happens Internally:**
1. Finds user by email
2. Compares password with bcrypt hash
3. Generates new JWT token
4. Sets httpOnly cookie
5. Returns user data with tracked cities

---

#### 3. Logout User

Clear authentication cookie.

```http
POST /api/auth/logout
```

**Success Response (200):**
```json
{
  "message": "Logout successful"
}
```

**What Happens:**
- Clears `auth_token` cookie
- Client should redirect to login page

---

#### 4. Get Current User

Get authenticated user's profile.

```http
GET /api/auth/me
Cookie: auth_token=<token>
```

**🔒 Requires Authentication**

**Success Response (200):**
```json
{
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "john@example.com",
    "username": "johndoe",
    "trackedCities": [...],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**
- `401` - Not authenticated or invalid token
- `500` - Server error

**Use Case:**
- Check if user is logged in on app load
- Restore user session after page refresh

---

### Location Search API

Search for US cities by name.

#### Search Locations

```http
GET /api/search?query={searchTerm}
```

**Query Parameters:**
- `query` (required): City name, address, or location

**Example:**
```http
GET /api/search?query=New%20York
```

**Success Response (200):**
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

**Features:**
- Returns up to 5 results
- Filtered to US locations only (required by NWS API)
- Sorted by relevance

**External API:**
- **Nominatim** (OpenStreetMap Geocoding)
- `GET https://nominatim.openstreetmap.org/search`
- Parameters: `q`, `format=json`, `addressdetails=1`, `countrycodes=us`, `limit=5`

**Error Responses:**
- `400` - Missing or empty query parameter
- `500` - Geocoding service error

**What Happens Internally:**
1. Validates query parameter
2. Calls Nominatim API with search term
3. Filters results to US only
4. Formats location names (City, State)
5. Creates unique ID from coordinates
6. Returns formatted array

---

### Weather APIs

Get weather data from National Weather Service.

#### 1. Get Weather for Location

Get current weather and 7-day forecast for specific coordinates.

```http
GET /api/weather?lat={latitude}&lon={longitude}&name={locationName}
```

**Query Parameters:**
- `lat` (required): Latitude (decimal degrees)
- `lon` (required): Longitude (decimal degrees)
- `name` (optional): Display name for location

**Example:**
```http
GET /api/weather?lat=42.3601&lon=-71.0589&name=Boston
```

**Success Response (200):**
```json
{
  "location": {
    "id": "42.3601_-71.0589",
    "name": "Boston",
    "lat": 42.3601,
    "lon": -71.0589
  },
  "current": {
    "temperature": 72,
    "temperatureUnit": "F",
    "description": "Partly Cloudy",
    "icon": "https://api.weather.gov/icons/land/day/sct?size=medium",
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
      "name": "This Afternoon",
      "startTime": "2024-01-01T14:00:00-05:00",
      "endTime": "2024-01-01T18:00:00-05:00",
      "isDaytime": true,
      "temperature": 75,
      "temperatureUnit": "F",
      "windSpeed": "10 mph",
      "windDirection": "S",
      "shortForecast": "Partly Cloudy",
      "detailedForecast": "Partly cloudy with a high near 75. South wind around 10 mph.",
      "icon": "https://api.weather.gov/icons/land/day/sct?size=medium"
    },
    {
      "number": 2,
      "name": "Tonight",
      "startTime": "2024-01-01T18:00:00-05:00",
      "endTime": "2024-01-02T06:00:00-05:00",
      "isDaytime": false,
      "temperature": 58,
      "temperatureUnit": "F",
      "windSpeed": "5 mph",
      "windDirection": "S",
      "shortForecast": "Mostly Clear",
      "detailedForecast": "Mostly clear with a low around 58. South wind around 5 mph.",
      "icon": "https://api.weather.gov/icons/land/night/few?size=medium"
    }
    // ... up to 14 periods (7 days)
  ],
  "lastUpdated": "2024-01-01T12:00:00Z"
}
```

**How It Works - NWS API Call Chain:**

```
1. GET /points/{lat},{lon}
   ├─ Returns: gridId, gridX, gridY
   ├─ Returns: forecastUrl
   └─ Returns: observationStationsUrl
   
2. GET {forecastUrl}
   └─ Returns: 14-period forecast (7 days × 2 periods)
   
3. GET {observationStationsUrl}
   └─ Returns: List of nearby weather stations
   
4. GET /stations/{stationId}/observations/latest
   └─ Returns: Current temperature, humidity, wind, etc.
```

**Data Transformations:**
- Temperature: Celsius → Fahrenheit (`(C × 9/5) + 32`)
- Wind Speed: km/h → mph (`km/h × 0.621371`)
- Visibility: meters → miles (`meters × 0.000621371`)
- Pressure: Pascals → inHg (`Pa × 0.0002953`)

**Error Responses:**
- `400` - Missing or invalid coordinates
- `500` - NWS API error (location outside US, service down, etc.)

**Why 4 API Calls?**
NWS architecture separates data:
1. Points → Grid system mapping
2. Forecast → Future predictions
3. Stations → Nearby observation points
4. Observations → Real-time conditions

---

#### 2. Get Weather for Multiple Locations

Get weather for multiple cities in one request (batch operation).

```http
POST /api/weather/multiple
Content-Type: application/json
```

**Request Body:**
```json
{
  "locations": [
    {
      "id": "42.3601_-71.0589",
      "name": "Boston, MA",
      "lat": 42.3601,
      "lon": -71.0589
    },
    {
      "id": "40.7128_-74.0060",
      "name": "New York, NY",
      "lat": 40.7128,
      "lon": -74.0060
    }
  ]
}
```

**Success Response (200):**
```json
[
  {
    "location": {
      "id": "42.3601_-71.0589",
      "name": "Boston, MA",
      "lat": 42.3601,
      "lon": -71.0589
    },
    "current": { /* current weather */ },
    "forecast": [ /* 14 periods */ ],
    "lastUpdated": "2024-01-01T12:00:00Z"
  },
  {
    "location": {
      "id": "40.7128_-74.0060",
      "name": "New York, NY",
      "lat": 40.7128,
      "lon": -74.0060
    },
    "current": { /* current weather */ },
    "forecast": [ /* 14 periods */ ],
    "lastUpdated": "2024-01-01T12:00:00Z"
  }
]
```

**Features:**
- Parallel fetching for better performance
- Partial success (returns data for successful locations)
- Error handling per location

**Error Responses:**
- `400` - Invalid request (locations must be non-empty array)
- `500` - Server error

**Performance:**
- Multiple locations fetched in parallel using `Promise.all()`
- Each location makes 4 NWS API calls
- Example: 3 cities = 12 parallel API calls

---

### User Tracked Cities APIs

Manage user's favorite/tracked cities.

**🔒 All endpoints require authentication**

#### 1. Add Tracked City

Add a city to user's favorites.

```http
POST /api/user/cities
Content-Type: application/json
Cookie: auth_token=<token>
```

**Request Body:**
```json
{
  "id": "42.3601_-71.0589",
  "name": "Boston, MA",
  "lat": 42.3601,
  "lon": -71.0589
}
```

**Success Response (201):**
```json
{
  "message": "City added successfully",
  "city": {
    "id": "42.3601_-71.0589",
    "name": "Boston, MA",
    "lat": 42.3601,
    "lon": -71.0589
  },
  "trackedCities": [
    {
      "id": "42.3601_-71.0589",
      "name": "Boston, MA",
      "lat": 42.3601,
      "lon": -71.0589
    }
  ]
}
```

**Error Responses:**
- `400` - Validation error (missing/invalid fields)
- `401` - Not authenticated
- `409` - City already tracked
- `500` - Server error

**What Happens:**
1. Validates city data
2. Checks if city already tracked (by ID)
3. Adds to user's `trackedCities` array in MongoDB
4. Returns updated list

**Database Operation:**
```javascript
User.findByIdAndUpdate(
  userId,
  { $push: { trackedCities: city } },
  { new: true }
)
```

---

#### 2. Get Tracked Cities

Get all cities the user is tracking.

```http
GET /api/user/cities
Cookie: auth_token=<token>
```

**Success Response (200):**
```json
{
  "trackedCities": [
    {
      "id": "42.3601_-71.0589",
      "name": "Boston, MA",
      "lat": 42.3601,
      "lon": -71.0589
    },
    {
      "id": "40.7128_-74.0060",
      "name": "New York, NY",
      "lat": 40.7128,
      "lon": -74.0060
    }
  ],
  "count": 2
}
```

**Error Responses:**
- `401` - Not authenticated
- `500` - Server error

---

#### 3. Remove Tracked City

Remove a city from favorites.

```http
DELETE /api/user/cities/:cityId
Cookie: auth_token=<token>
```

**URL Parameters:**
- `cityId`: City identifier (e.g., "42.3601_-71.0589")

**Example:**
```http
DELETE /api/user/cities/42.3601_-71.0589
```

**Success Response (200):**
```json
{
  "message": "City removed successfully",
  "trackedCities": [
    {
      "id": "40.7128_-74.0060",
      "name": "New York, NY",
      "lat": 40.7128,
      "lon": -74.0060
    }
  ]
}
```

**Error Responses:**
- `400` - City ID required
- `401` - Not authenticated
- `500` - Server error

**Database Operation:**
```javascript
User.findByIdAndUpdate(
  userId,
  { $pull: { trackedCities: { id: cityId } } },
  { new: true }
)
```

---

#### 4. Get Weather for Tracked Cities

Get weather for all user's tracked cities.

```http
GET /api/user/cities/weather
Cookie: auth_token=<token>
```

**Success Response (200):**
```json
{
  "weatherData": [
    {
      "location": {
        "id": "42.3601_-71.0589",
        "name": "Boston, MA",
        "lat": 42.3601,
        "lon": -71.0589
      },
      "current": {
        "temperature": 72,
        "temperatureUnit": "F",
        "description": "Partly Cloudy",
        "icon": "https://...",
        "humidity": 65,
        "windSpeed": 10,
        "windDirection": 180,
        "visibility": 10.0,
        "pressure": 29.92,
        "timestamp": "2024-01-01T12:00:00Z"
      },
      "forecast": [ /* 14 periods */ ],
      "lastUpdated": "2024-01-01T12:00:00Z"
    },
    {
      "location": { /* New York */ },
      "current": { /* weather data */ },
      "forecast": [ /* forecast */ ],
      "lastUpdated": "2024-01-01T12:00:00Z"
    }
  ],
  "count": 2
}
```

**Error Responses:**
- `401` - Not authenticated
- `500` - Server error

**How It Works:**
1. Fetches user's tracked cities from MongoDB
2. Calls NWS API for each city (in parallel)
3. Returns array of weather data
4. Includes partial data if some cities fail

**Use Case:**
Perfect for dashboard displaying all favorite cities' weather at once.

---

## External API Integration

### 1. National Weather Service (NWS) API

**Base URL:** `https://api.weather.gov`

**Purpose:** Official US government weather data

**Authentication:** None (requires User-Agent header)

**Coverage:** US territory only (including territories and protectorates)

**Rate Limiting:** No official limit, but be respectful

#### Endpoints Used

1. **Points Endpoint**
   ```http
   GET /points/{latitude},{longitude}
   User-Agent: WeatherTracker/1.0 (contact@example.com)
   ```
   - Converts coordinates to NWS grid system
   - Returns URLs for forecast and observations
   - Returns: gridId, gridX, gridY, forecast URL, stations URL

2. **Forecast Endpoint**
   ```http
   GET /gridpoints/{office}/{gridX},{gridY}/forecast
   User-Agent: WeatherTracker/1.0 (contact@example.com)
   ```
   - Returns 7-day forecast
   - 14 periods (day and night for each day)
   - Includes temperature, wind, detailed descriptions

3. **Observation Stations**
   ```http
   GET /gridpoints/{office}/{gridX},{gridY}/stations
   User-Agent: WeatherTracker/1.0 (contact@example.com)
   ```
   - Returns list of nearby weather stations
   - Sorted by distance
   - Used to get current conditions

4. **Latest Observation**
   ```http
   GET /stations/{stationId}/observations/latest
   User-Agent: WeatherTracker/1.0 (contact@example.com)
   ```
   - Current weather from nearest station
   - Real-time temperature, humidity, pressure, wind
   - Updated every hour (typically)

#### Data Quality Notes

- **Forecast:** High quality, updated multiple times per day
- **Current conditions:** From nearest weather station (may be miles away)
- **Coverage:** Excellent in populated areas, sparse in remote regions
- **Reliability:** Very high (government-operated)

**Limitations:**
- US locations only
- Returns 404 for non-US coordinates
- Occasional service interruptions during maintenance
- Some remote areas have limited observation stations

---

### 2. Nominatim API (OpenStreetMap)

**Base URL:** `https://nominatim.openstreetmap.org`

**Purpose:** Convert location names to coordinates (geocoding)

**Authentication:** None (requires User-Agent header)

**Rate Limiting:** 1 request per second

#### Endpoint Used

```http
GET /search?q={query}&format=json&addressdetails=1&countrycodes=us&limit=5
User-Agent: WeatherTracker/1.0 (contact@example.com)
```

**Parameters:**
- `q`: Search query (city name, address)
- `format`: Response format (json)
- `addressdetails`: Include address components (1 = yes)
- `countrycodes`: Restrict to US (us)
- `limit`: Max results (5)

**Response Example:**
```json
[
  {
    "place_id": 12345,
    "lat": "42.3600825",
    "lon": "-71.0588801",
    "display_name": "Boston, Suffolk County, Massachusetts, United States",
    "address": {
      "city": "Boston",
      "county": "Suffolk County",
      "state": "Massachusetts",
      "country": "United States"
    }
  }
]
```

**Best Practices:**
- Respect 1 req/sec limit
- Include descriptive User-Agent
- Cache results when possible
- Handle empty results gracefully

---

## Error Handling

### Standard Error Response Format

All errors follow this structure:

```json
{
  "error": "Error message",
  "details": {} // Optional, for validation errors
}
```

### HTTP Status Codes

| Code | Meaning | When Used |
|------|---------|-----------|
| 200 | OK | Successful GET/DELETE request |
| 201 | Created | Successful POST creating resource |
| 400 | Bad Request | Validation error, missing parameters |
| 401 | Unauthorized | Missing or invalid authentication |
| 404 | Not Found | Resource not found, invalid endpoint |
| 409 | Conflict | Duplicate resource (email, city already tracked) |
| 500 | Internal Server Error | Server/database/external API error |

### Validation Errors

Detailed validation errors using Zod:

```json
{
  "error": "Validation error",
  "details": [
    {
      "code": "invalid_type",
      "expected": "string",
      "received": "undefined",
      "path": ["email"],
      "message": "Email is required"
    },
    {
      "code": "too_small",
      "minimum": 6,
      "path": ["password"],
      "message": "Password must be at least 6 characters"
    }
  ]
}
```

### Authentication Errors

```json
{
  "error": "Not authenticated"
}
```

```json
{
  "error": "Invalid or expired token"
}
```

### External API Errors

When NWS or Nominatim fails:

```json
{
  "error": "Failed to fetch weather data",
  "message": "Location outside of supported area"
}
```

```json
{
  "error": "Failed to search locations",
  "message": "Geocoding service temporarily unavailable"
}
```

---

## Testing Guide

### Using cURL

#### 1. Register and Login

```bash
# Register
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "username": "testuser"
  }'

# Login
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Get current user
curl -X GET http://localhost:4000/api/auth/me \
  -b cookies.txt
```

#### 2. Search and Get Weather

```bash
# Search for a city
curl -X GET "http://localhost:4000/api/search?query=Boston"

# Get weather (no auth needed)
curl -X GET "http://localhost:4000/api/weather?lat=42.3601&lon=-71.0589&name=Boston"
```

#### 3. Manage Tracked Cities

```bash
# Add city (requires auth)
curl -X POST http://localhost:4000/api/user/cities \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "id": "42.3601_-71.0589",
    "name": "Boston, MA",
    "lat": 42.3601,
    "lon": -71.0589
  }'

# Get tracked cities
curl -X GET http://localhost:4000/api/user/cities \
  -b cookies.txt

# Get weather for tracked cities
curl -X GET http://localhost:4000/api/user/cities/weather \
  -b cookies.txt

# Remove city
curl -X DELETE "http://localhost:4000/api/user/cities/42.3601_-71.0589" \
  -b cookies.txt

# Logout
curl -X POST http://localhost:4000/api/auth/logout \
  -b cookies.txt
```

### Using JavaScript (Fetch)

```javascript
// Configure base URL
const API_URL = 'http://localhost:4000';

// Register
async function register(email, password, username) {
  const response = await fetch(`${API_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // Important: send cookies
    body: JSON.stringify({ email, password, username })
  });
  return response.json();
}

// Login
async function login(email, password) {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password })
  });
  return response.json();
}

// Search location
async function searchLocation(query) {
  const response = await fetch(
    `${API_URL}/api/search?query=${encodeURIComponent(query)}`
  );
  return response.json();
}

// Get weather
async function getWeather(lat, lon, name) {
  const params = new URLSearchParams({ lat, lon, name });
  const response = await fetch(`${API_URL}/api/weather?${params}`);
  return response.json();
}

// Add tracked city (requires auth)
async function addTrackedCity(city) {
  const response = await fetch(`${API_URL}/api/user/cities`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // Sends auth cookie
    body: JSON.stringify(city)
  });
  return response.json();
}

// Get tracked cities weather
async function getTrackedCitiesWeather() {
  const response = await fetch(`${API_URL}/api/user/cities/weather`, {
    credentials: 'include'
  });
  return response.json();
}

// Example usage
async function demo() {
  // Register user
  await register('john@example.com', 'password123', 'johndoe');
  
  // Search for Boston
  const locations = await searchLocation('Boston');
  const boston = locations[0];
  
  // Get Boston weather
  const weather = await getWeather(boston.lat, boston.lon, boston.name);
  console.log('Current temp:', weather.current.temperature);
  
  // Add to tracked cities
  await addTrackedCity(boston);
  
  // Get all tracked cities weather
  const trackedWeather = await getTrackedCitiesWeather();
  console.log('Tracked cities:', trackedWeather.weatherData);
}
```

### Using Postman

1. **Import Collection:**
   - Located in: `backend/test/postman/`
   - Files: `backend-api-integration-tests.postman_collection.json`

2. **Set Environment:**
   - Create environment with `BASE_URL` = `http://localhost:4000`

3. **Test Authentication:**
   - Run Register → Login
   - Cookies automatically saved

4. **Test Protected Routes:**
   - Cookies automatically sent with requests
   - Try Add City, Get Cities, etc.

### Environment Variables

Create `.env` file in backend directory:

```env
# Database
MONGODB_URL=mongodb://admin:admin123@localhost:27017/weather_tracker?authSource=admin
MONGODB_DB_NAME=weather_tracker

# JWT
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
JWT_EXPIRES_IN=7d

# External APIs
NWS_USER_AGENT=WeatherTracker/1.0 (your-email@example.com)

# Server
PORT=4000
NODE_ENV=development
```

---

## Quick Reference

### Base URL
```
http://localhost:4000
```

### All Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/health` | No | Health check |
| POST | `/api/auth/register` | No | Register user |
| POST | `/api/auth/login` | No | Login user |
| POST | `/api/auth/logout` | No | Logout user |
| GET | `/api/auth/me` | Yes | Get current user |
| GET | `/api/search` | No | Search locations |
| GET | `/api/weather` | No | Get weather for location |
| POST | `/api/weather/multiple` | No | Get weather for multiple locations |
| POST | `/api/user/cities` | Yes | Add tracked city |
| GET | `/api/user/cities` | Yes | Get tracked cities |
| DELETE | `/api/user/cities/:cityId` | Yes | Remove tracked city |
| GET | `/api/user/cities/weather` | Yes | Get weather for tracked cities |

### Common Workflows

**1. New User Journey:**
```
Register → Search City → Get Weather → Add to Favorites → View Dashboard
```

**2. Returning User:**
```
Login → View Dashboard (tracked cities) → Search New City → Add to Favorites
```

**3. Anonymous User:**
```
Search City → Get Weather → [Prompted to Register]
```

---

## Need Help?

**Documentation:**
- Backend Routes: `backend/ai_notes/BACKEND_ROUTES_DOCUMENTATION.md`
- Auth API: `backend/AUTH_API_DOCUMENTATION.md`
- NWS API Flow: `backend/ai_notes/NWS-API-DIAGRAM.md`

**Postman Collections:**
- `backend/test/postman/backend-api-integration-tests.postman_collection.json`
- `backend/test/postman/auth-api.postman_collection.json`

**External API Docs:**
- NWS API: https://www.weather.gov/documentation/services-web-api
- Nominatim: https://nominatim.org/release-docs/latest/api/Search/

---

**Last Updated:** February 2026
**API Version:** 1.0
