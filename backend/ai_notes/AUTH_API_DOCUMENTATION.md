# Authentication API Documentation

This document describes the authentication and user management endpoints for the Weather Tracker application.

## Table of Contents

1. [Authentication Flow](#authentication-flow)
2. [Authentication Endpoints](#authentication-endpoints)
3. [User Cities Endpoints](#user-cities-endpoints)
4. [Testing Examples](#testing-examples)

## Authentication Flow

The application uses JWT (JSON Web Token) based authentication with httpOnly cookies:

1. User registers or logs in
2. Server generates a JWT token
3. Token is stored in an httpOnly cookie (secure, not accessible to JavaScript)
4. Client sends cookie with subsequent requests
5. Server validates token via middleware

## Authentication Endpoints

### Register New User

**POST** `/api/auth/register`

Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "username": "johndoe"
}
```

**Validation:**
- Email: Must be a valid email address
- Password: Minimum 6 characters
- Username: 3-30 characters

**Success Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "username": "johndoe",
    "trackedCities": [],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `400` - Validation error (invalid email, password too short, etc.)
- `409` - Email or username already exists
- `500` - Server error

---

### Login

**POST** `/api/auth/login`

Authenticate an existing user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "username": "johndoe",
    "trackedCities": [...],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `400` - Validation error
- `401` - Invalid email or password
- `500` - Server error

---

### Logout

**POST** `/api/auth/logout`

Clear the authentication cookie.

**Success Response (200):**
```json
{
  "message": "Logout successful"
}
```

---

### Get Current User

**GET** `/api/auth/me`

Get the currently authenticated user's information.

**Authentication:** Required (JWT token in cookie)

**Success Response (200):**
```json
{
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
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

---

## User Cities Endpoints

All user cities endpoints require authentication (JWT token in cookie).

### Add City

**POST** `/api/user/cities`

Add a city to the user's tracked cities list.

**Authentication:** Required

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
      "lon": -71.0589,
      "addedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

**Error Responses:**
- `400` - Validation error (missing or invalid fields)
- `401` - Not authenticated
- `409` - City already tracked
- `500` - Server error

---

### Remove City

**DELETE** `/api/user/cities/:cityId`

Remove a city from the user's tracked cities list.

**Authentication:** Required

**URL Parameters:**
- `cityId` - The ID of the city to remove (e.g., "42.3601_-71.0589")

**Success Response (200):**
```json
{
  "message": "City removed successfully",
  "trackedCities": [...]
}
```

**Error Responses:**
- `400` - City ID is required
- `401` - Not authenticated
- `500` - Server error

---

### Get Tracked Cities

**GET** `/api/user/cities`

Get all cities tracked by the user.

**Authentication:** Required

**Success Response (200):**
```json
{
  "trackedCities": [
    {
      "id": "42.3601_-71.0589",
      "name": "Boston, MA",
      "lat": 42.3601,
      "lon": -71.0589,
      "addedAt": "2024-01-01T00:00:00.000Z"
    },
    {
      "id": "40.7128_-74.0060",
      "name": "New York, NY",
      "lat": 40.7128,
      "lon": -74.0060,
      "addedAt": "2024-01-02T00:00:00.000Z"
    }
  ],
  "count": 2
}
```

**Error Responses:**
- `401` - Not authenticated
- `500` - Server error

---

### Get Weather for Tracked Cities

**GET** `/api/user/cities/weather`

Get current weather and forecast for all tracked cities.

**Authentication:** Required

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
        "visibility": 10000,
        "pressure": 1013,
        "timestamp": "2024-01-01T12:00:00Z"
      },
      "forecast": [...],
      "lastUpdated": "2024-01-01T12:00:00Z"
    }
  ],
  "count": 1
}
```

**Error Responses:**
- `401` - Not authenticated
- `500` - Server error

---

## Testing Examples

### Using cURL

#### Register a User
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

#### Login
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

#### Get Current User (using saved cookies)
```bash
curl -X GET http://localhost:4000/api/auth/me \
  -b cookies.txt
```

#### Add a City
```bash
curl -X POST http://localhost:4000/api/user/cities \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "id": "42.3601_-71.0589",
    "name": "Boston, MA",
    "lat": 42.3601,
    "lon": -71.0589
  }'
```

#### Get Tracked Cities
```bash
curl -X GET http://localhost:4000/api/user/cities \
  -b cookies.txt
```

#### Get Weather for Tracked Cities
```bash
curl -X GET http://localhost:4000/api/user/cities/weather \
  -b cookies.txt
```

#### Remove a City
```bash
curl -X DELETE http://localhost:4000/api/user/cities/42.3601_-71.0589 \
  -b cookies.txt
```

#### Logout
```bash
curl -X POST http://localhost:4000/api/auth/logout \
  -b cookies.txt
```

### Using Postman

1. **Set up environment:**
   - Create a new environment
   - Add variable `BASE_URL` = `http://localhost:4000`

2. **Register/Login:**
   - Make POST request to `{{BASE_URL}}/api/auth/register` or `/api/auth/login`
   - Postman will automatically save cookies

3. **Use protected endpoints:**
   - Cookies are automatically included in subsequent requests
   - Test all user/cities endpoints

### Using JavaScript (Fetch API)

```javascript
// Register
const response = await fetch('http://localhost:4000/api/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include', // Important: send cookies
  body: JSON.stringify({
    email: 'test@example.com',
    password: 'password123',
    username: 'testuser',
  }),
});

const data = await response.json();
console.log(data);

// Add city (authenticated)
const cityResponse = await fetch('http://localhost:4000/api/user/cities', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include', // Important: send cookies
  body: JSON.stringify({
    id: '42.3601_-71.0589',
    name: 'Boston, MA',
    lat: 42.3601,
    lon: -71.0589,
  }),
});

const cityData = await cityResponse.json();
console.log(cityData);
```

## Security Notes

1. **httpOnly Cookies:** JWT tokens are stored in httpOnly cookies to prevent XSS attacks
2. **Password Hashing:** Passwords are hashed using bcrypt with 10 salt rounds
3. **CORS:** Configure CORS properly for production environments
4. **JWT Secret:** Use a strong, random JWT secret in production (minimum 32 characters)
5. **HTTPS:** Always use HTTPS in production to protect cookies and tokens in transit
6. **Token Expiration:** Tokens expire after 7 days by default (configurable)

## Environment Variables

Ensure these environment variables are set in your `.env` file:

```env
MONGODB_URL=mongodb://admin:admin123@localhost:27017/weather_tracker?authSource=admin
MONGODB_DB_NAME=weather_tracker
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-minimum-32-chars
JWT_EXPIRES_IN=7d
```
