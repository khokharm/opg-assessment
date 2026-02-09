# Database Layer Documentation

This folder contains all database-related code for the Weather Tracker application using Mongoose ODM.

## Structure

```
db/
├── connection.ts           # Mongoose connection setup
├── models/                 # Mongoose schemas and models
│   └── User.ts            # User schema with password hashing
├── repositories/          # Database operations (Repository pattern)
│   └── userRepository.ts  # User CRUD operations
└── index.ts              # Centralized exports
```

## Architecture

The database layer follows the **Repository Pattern** to separate business logic from data access:

1. **Models** (`models/`) - Define Mongoose schemas and models
2. **Repositories** (`repositories/`) - Provide data access methods
3. **Connection** (`connection.ts`) - Manage MongoDB connection

## Connection (connection.ts)

Handles MongoDB connection using Mongoose with:
- Connection pooling (10 max, 2 min)
- Timeout configurations
- Event listeners for connection states
- Graceful shutdown support

### Usage

```typescript
import { connectToMongoDB, closeMongoDB, isConnected } from './db/connection';

// Connect on startup
await connectToMongoDB();

// Check connection
if (isConnected()) {
  console.log('Connected!');
}

// Close on shutdown
await closeMongoDB();
```

## Models

### User Model (models/User.ts)

Defines the User schema with Mongoose.

**Schema Definition:**
```typescript
{
  email: String (unique, indexed, lowercase, required)
  password: String (hashed, required, min 6 chars)
  username: String (unique, indexed, required, 3-30 chars)
  trackedCities: Array of TrackedCity
  timestamps: true (auto-generates createdAt, updatedAt)
}
```

**Features:**

1. **Password Hashing:**
   - Pre-save middleware automatically hashes passwords
   - Uses bcrypt with 10 salt rounds
   - Only hashes when password is modified

2. **Instance Methods:**
   - `comparePassword(password)` - Compare plain text with hash

3. **Static Methods:**
   - `User.hashPassword(password)` - Manually hash a password

4. **JSON Transform:**
   - Automatically removes password from JSON output
   - Use `user.toJSON()` to get sanitized user object

**Interfaces:**
- `IUser` - Base user interface
- `IUserDocument` - Mongoose document with methods
- `IUserModel` - Model with static methods
- `TrackedCity` - Embedded city interface

### Usage Example

```typescript
import { User, IUserDocument } from './db/models/User';

// Create user (password will be auto-hashed)
const user = new User({
  email: 'test@example.com',
  password: 'password123',
  username: 'testuser',
});
await user.save();

// Compare password
const isValid = await user.comparePassword('password123'); // true

// Get sanitized user (no password)
const sanitizedUser = user.toJSON();
```

## Repositories

### User Repository (repositories/userRepository.ts)

Provides high-level data access methods for User operations.

**Available Functions:**

#### User Management
- `createUser(email, password, username)` - Create new user with validation
- `findUserByEmail(email)` - Find user by email
- `findUserById(id)` - Find user by ID
- `findUserByUsername(username)` - Find user by username
- `updateUser(userId, updates)` - Update user fields
- `deleteUser(userId)` - Delete user
- `sanitizeUser(user)` - Remove password from user object

#### Authentication
- `comparePassword(user, password)` - Verify password

#### City Tracking
- `addTrackedCity(userId, city)` - Add city to user's list
- `removeTrackedCity(userId, cityId)` - Remove city from list
- `getTrackedCities(userId)` - Get all tracked cities

### Usage Example

```typescript
import {
  createUser,
  findUserByEmail,
  comparePassword,
  addTrackedCity,
} from './db/repositories/userRepository';

// Create user
const user = await createUser('test@example.com', 'password123', 'testuser');

// Find and authenticate
const foundUser = await findUserByEmail('test@example.com');
if (foundUser) {
  const isValid = await comparePassword(foundUser, 'password123');
}

// Add city
await addTrackedCity(user._id, {
  id: '42.3601_-71.0589',
  name: 'Boston, MA',
  lat: 42.3601,
  lon: -71.0589,
});
```

## Error Handling

All repository functions throw descriptive errors:

```typescript
try {
  await createUser(email, password, username);
} catch (error) {
  // "Email already exists" or "Username already exists"
  console.error(error.message);
}

try {
  await addTrackedCity(userId, city);
} catch (error) {
  // "User not found" or "City already tracked"
  console.error(error.message);
}
```

## Import Best Practices

### Option 1: Use the index file (recommended)

```typescript
import { 
  connectToMongoDB,
  User,
  createUser,
  findUserByEmail,
} from './db';
```

### Option 2: Import directly from modules

```typescript
import { connectToMongoDB } from './db/connection';
import { User } from './db/models/User';
import { createUser } from './db/repositories/userRepository';
```

## Testing

When writing tests, you can:

1. Mock the repository functions
2. Use an in-memory MongoDB instance
3. Use a test database

Example with Jest:

```typescript
jest.mock('./db/repositories/userRepository');

import { createUser } from './db/repositories/userRepository';

test('should create user', async () => {
  (createUser as jest.Mock).mockResolvedValue({
    _id: '123',
    email: 'test@example.com',
    username: 'testuser',
  });

  const user = await createUser('test@example.com', 'password', 'testuser');
  expect(user.email).toBe('test@example.com');
});
```

## Migration from Native MongoDB Driver

This codebase was migrated from the native MongoDB driver to Mongoose. Key differences:

### Before (Native Driver)
```typescript
import { ObjectId, Collection } from 'mongodb';
import { getDb } from './db/connection';

const collection = getDb().collection('users');
const user = await collection.findOne({ email });
```

### After (Mongoose)
```typescript
import { User } from './db/models/User';

const user = await User.findOne({ email });
```

### Benefits of Mongoose

1. **Schema Validation** - Define and enforce data structure
2. **Middleware** - Pre/post hooks for operations
3. **Type Safety** - Better TypeScript integration
4. **Instance Methods** - Add custom methods to documents
5. **Built-in Timestamps** - Automatic createdAt/updatedAt
6. **Cleaner Syntax** - More intuitive API

## Environment Configuration

Required environment variables:

```env
MONGODB_URL=mongodb://admin:admin123@localhost:27017/weather_tracker?authSource=admin
MONGODB_DB_NAME=weather_tracker
```

The connection string includes:
- Host: localhost:27017
- Database: weather_tracker
- Authentication: admin/admin123
- Auth source: admin database

## Indexes

The User model automatically creates indexes on:
- `email` (unique)
- `username` (unique)

Indexes are created when the application starts and connects to MongoDB.

## Best Practices

1. **Always use repositories** - Don't access models directly from controllers
2. **Handle errors** - Always wrap repository calls in try-catch
3. **Sanitize output** - Use `sanitizeUser()` before sending to client
4. **Validate input** - Use Zod or similar before calling repositories
5. **Use transactions** - For operations that modify multiple documents
6. **Close connections** - Always close in graceful shutdown

## Future Enhancements

Potential improvements to the database layer:

1. **Caching** - Add Redis caching for frequently accessed data
2. **Soft Deletes** - Add deleted flag instead of hard deletes
3. **Audit Trail** - Track all changes to user data
4. **Database Migrations** - Use a migration tool for schema changes
5. **Connection Retry Logic** - Auto-reconnect on connection loss
6. **Query Builder** - Abstract complex queries
7. **Database Seeding** - Add seed data for development
