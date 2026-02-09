# MongoDB Native Driver → Mongoose Migration

This document describes the migration from MongoDB native driver to Mongoose ODM.

## Summary of Changes

### 1. Dependencies
- ❌ Removed: `mongodb` (^6.0.0)
- ✅ Added: `mongoose` (^8.0.0)

### 2. Folder Structure Reorganization

**Before:**
```
backend/src/
├── models/
│   └── User.ts          # Mixed: schema + operations
└── db/
    └── connection.ts    # Native MongoDB connection
```

**After:**
```
backend/src/
└── db/                  # All DB code centralized here
    ├── connection.ts    # Mongoose connection
    ├── models/          # Mongoose schemas
    │   └── User.ts
    ├── repositories/    # Data access layer
    │   └── userRepository.ts
    ├── index.ts         # Centralized exports
    └── README.md        # Documentation
```

### 3. Key Improvements

#### Architecture
- ✅ **Repository Pattern** - Separation of concerns
- ✅ **Centralized DB Code** - Everything in `db/` folder
- ✅ **Better Organization** - Models, repositories, connection separated
- ✅ **Single Source of Truth** - One place for all DB operations

#### Developer Experience
- ✅ **Schema Validation** - Mongoose enforces data structure
- ✅ **Automatic Timestamps** - `createdAt` and `updatedAt` auto-managed
- ✅ **Middleware Support** - Pre/post save hooks
- ✅ **Instance Methods** - Custom methods on documents
- ✅ **Better TypeScript** - Improved type inference
- ✅ **Cleaner Syntax** - More intuitive API

## Code Changes

### Connection

**Before (Native MongoDB):**
```typescript
import { MongoClient, Db } from 'mongodb';

let client: MongoClient | null = null;
let db: Db | null = null;

export const connectToMongoDB = async (): Promise<Db> => {
  client = new MongoClient(config.mongodb.url, { /* options */ });
  await client.connect();
  db = client.db(config.mongodb.dbName);
  return db;
};

export const getDb = (): Db => {
  if (!db) throw new Error('Database not initialized');
  return db;
};
```

**After (Mongoose):**
```typescript
import mongoose from 'mongoose';

export const connectToMongoDB = async (): Promise<typeof mongoose> => {
  await mongoose.connect(config.mongodb.url, {
    dbName: config.mongodb.dbName,
    maxPoolSize: 10,
    minPoolSize: 2,
  });
  return mongoose;
};

// No need for getDb() - just use models directly
```

### Model Definition

**Before (Native MongoDB):**
```typescript
import { ObjectId, Collection } from 'mongodb';
import { getDb } from '../db/connection';

interface User {
  _id?: ObjectId;
  email: string;
  password: string;
  username: string;
  trackedCities: TrackedCity[];
  createdAt: Date;
  updatedAt: Date;
}

const getUsersCollection = (): Collection<User> => {
  return getDb().collection<User>('users');
};

export const createUser = async (
  email: string,
  password: string,
  username: string
): Promise<User> => {
  const users = getUsersCollection();
  const hashedPassword = await hashPassword(password);
  
  const user: User = {
    email,
    password: hashedPassword,
    username,
    trackedCities: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  const result = await users.insertOne(user);
  user._id = result.insertedId;
  return user;
};
```

**After (Mongoose):**
```typescript
import mongoose, { Document, Schema } from 'mongoose';

interface IUser {
  email: string;
  password: string;
  username: string;
  trackedCities: TrackedCity[];
}

interface IUserDocument extends IUser, Document {
  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUserDocument>(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    username: { type: String, required: true, unique: true },
    trackedCities: [trackedCitySchema],
  },
  { timestamps: true } // Auto-creates createdAt, updatedAt
);

// Auto-hash password on save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Instance method
userSchema.methods.comparePassword = async function (password: string) {
  return bcrypt.compare(password, this.password);
};

export const User = mongoose.model<IUserDocument>('User', userSchema);
```

### Data Access (Repository)

**Before (Mixed in Model):**
```typescript
// User.ts had both schema and operations mixed together
export const createUser = async (...) => { /* implementation */ };
export const findUserByEmail = async (...) => { /* implementation */ };
export const addTrackedCity = async (...) => { /* implementation */ };
```

**After (Separated Repository):**
```typescript
// db/models/User.ts - Schema only
export const User = mongoose.model<IUserDocument>('User', userSchema);

// db/repositories/userRepository.ts - Operations only
export const createUser = async (
  email: string,
  password: string,
  username: string
): Promise<IUserDocument> => {
  const user = new User({ email, password, username });
  await user.save(); // Password auto-hashed via middleware
  return user;
};

export const findUserByEmail = async (email: string) => {
  return User.findOne({ email });
};

export const addTrackedCity = async (userId, city) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');
  user.trackedCities.push({ ...city, addedAt: new Date() });
  await user.save();
  return user;
};
```

### Controller Usage

**Before:**
```typescript
import { createUser, findUserByEmail } from '../models/User';

const user = await createUser(email, password, username);
```

**After:**
```typescript
import { createUser, findUserByEmail } from '../db/repositories/userRepository';

const user = await createUser(email, password, username);
// Same API, but better organized backend
```

## Benefits Realized

### 1. Automatic Features
- ✅ **Password Hashing**: Automatic via pre-save middleware
- ✅ **Timestamps**: Auto-generated `createdAt` and `updatedAt`
- ✅ **Validation**: Schema-level validation
- ✅ **Indexes**: Automatically created from schema

### 2. Better Code Organization
- ✅ **Separation of Concerns**: Models vs. Operations
- ✅ **Repository Pattern**: Clean data access layer
- ✅ **Centralized DB Code**: All in `db/` folder
- ✅ **Reusability**: Easy to import and use anywhere

### 3. Developer Experience
- ✅ **Less Boilerplate**: No manual timestamp management
- ✅ **Type Safety**: Better TypeScript integration
- ✅ **Cleaner API**: More intuitive method names
- ✅ **Instance Methods**: Custom methods on documents

### 4. Maintainability
- ✅ **Single Source**: One schema definition
- ✅ **Easy Updates**: Change schema in one place
- ✅ **Testing**: Easier to mock repositories
- ✅ **Documentation**: Clear separation of concerns

## Migration Checklist

- [x] Install Mongoose
- [x] Remove MongoDB native driver
- [x] Update connection.ts to use Mongoose
- [x] Create Mongoose User schema in db/models/User.ts
- [x] Create userRepository.ts in db/repositories/
- [x] Move all DB operations to repository
- [x] Update controllers to use new imports
- [x] Update middleware to use new imports
- [x] Update TypeScript types
- [x] Delete old models/User.ts
- [x] Remove empty models/ folder
- [x] Create db/index.ts for exports
- [x] Update documentation
- [x] Run type checking
- [x] Run build
- [x] Test all endpoints

## Files Changed

### Created
- `backend/src/db/models/User.ts` - Mongoose schema
- `backend/src/db/repositories/userRepository.ts` - Repository
- `backend/src/db/index.ts` - Centralized exports
- `backend/src/db/README.md` - DB documentation

### Modified
- `backend/src/db/connection.ts` - Mongoose connection
- `backend/src/controllers/auth.ts` - Updated imports
- `backend/src/controllers/userCities.ts` - Updated imports
- `backend/src/middleware/auth.ts` - Updated imports
- `backend/src/types/express.d.ts` - Updated User type
- `backend/package.json` - Mongoose dependency

### Deleted
- `backend/src/models/User.ts` - Moved to db/
- `backend/src/models/` folder - Now empty, removed

## Testing

All functionality remains the same from the API perspective:

```bash
# Start MongoDB
cd db && docker-compose up -d

# Start backend
cd backend && npm run dev

# Test registration
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","username":"testuser"}'

# Test login
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{"email":"test@example.com","password":"password123"}'

# Test protected endpoint
curl -X GET http://localhost:4000/api/auth/me -b cookies.txt
```

## Performance Considerations

### Connection Pooling
Both implementations use connection pooling:
- Native: Configured via `MongoClient` options
- Mongoose: Configured via `mongoose.connect()` options

Both use same pool sizes (10 max, 2 min).

### Query Performance
Mongoose adds minimal overhead:
- Schema validation: Negligible
- Middleware: Only runs when needed
- Type casting: Minimal impact

For 99% of applications, the difference is imperceptible.

## Future Improvements

With Mongoose in place, we can now easily add:

1. **Plugins** - Add functionality like soft deletes, pagination
2. **Virtuals** - Computed properties
3. **Population** - Automatic reference resolution
4. **Transactions** - Multi-document ACID operations
5. **Change Streams** - Real-time data change notifications
6. **Discriminators** - Polymorphic models (inheritance)
7. **Sub-documents** - Nested document schemas
8. **Query Helpers** - Custom query methods

## Conclusion

The migration to Mongoose provides:
- ✅ Better code organization (Repository Pattern)
- ✅ Improved developer experience
- ✅ More maintainable codebase
- ✅ Same API compatibility
- ✅ Foundation for future enhancements

No breaking changes to the public API - all endpoints work exactly the same!
