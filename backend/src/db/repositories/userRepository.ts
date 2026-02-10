import { User, IUserDocument, TrackedCity } from '../models/User';
import { Types } from 'mongoose';

/**
 * User without password (for responses)
 */
export type UserWithoutPassword = Omit<IUserDocument, 'password' | 'comparePassword'>;

/**
 * Create a new user
 */
export const createUser = async (
  email: string,
  password: string,
  username: string
): Promise<IUserDocument> => {
  // Check if user already exists
  const existingUser = await User.findOne({ 
    $or: [{ email }, { username }] 
  });

  if (existingUser) {
    if (existingUser.email === email) {
      throw new Error('Email already exists');
    }
    if (existingUser.username === username) {
      throw new Error('Username already exists');
    }
  }

  // Create user (password will be hashed by pre-save middleware)
  const user = new User({
    email,
    password,
    username,
    trackedCities: [],
  });

  await user.save();
  return user;
};

/**
 * Find user by email
 */
export const findUserByEmail = async (email: string): Promise<IUserDocument | null> => {
  return User.findOne({ email });
};

/**
 * Find user by ID
 */
export const findUserById = async (id: string | Types.ObjectId): Promise<IUserDocument | null> => {
  return User.findById(id);
};

/**
 * Find user by username
 */
export const findUserByUsername = async (username: string): Promise<IUserDocument | null> => {
  return User.findOne({ username });
};

/**
 * Remove password from user object (convert to JSON)
 */
export const sanitizeUser = (user: IUserDocument): any => {
  return user.toJSON();
};

/**
 * Add city to user's tracked cities
 */
export const addTrackedCity = async (
  userId: string | Types.ObjectId,
  city: Omit<TrackedCity, 'addedAt'>
): Promise<IUserDocument | null> => {
  // Check if city already exists
  const user = await findUserById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  const cityExists = user.trackedCities.some(c => c.id === city.id);
  if (cityExists) {
    throw new Error('City already tracked');
  }

  // Add city with timestamp
  const trackedCity: TrackedCity = {
    ...city,
    addedAt: new Date(),
  };

  user.trackedCities.push(trackedCity);
  await user.save();

  return user;
};

/**
 * Remove city from user's tracked cities
 */
export const removeTrackedCity = async (
  userId: string | Types.ObjectId,
  cityId: string
): Promise<IUserDocument | null> => {
  const user = await findUserById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  user.trackedCities = user.trackedCities.filter(c => c.id !== cityId);
  await user.save();

  return user;
};

/**
 * Get user's tracked cities
 */
export const getTrackedCities = async (
  userId: string | Types.ObjectId
): Promise<TrackedCity[]> => {
  const user = await findUserById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  return user.trackedCities;
};

/**
 * Update user
 */
export const updateUser = async (
  userId: string | Types.ObjectId,
  updates: Partial<Omit<IUserDocument, '_id' | 'password' | 'createdAt'>>
): Promise<IUserDocument | null> => {
  return User.findByIdAndUpdate(
    userId,
    { $set: updates },
    { new: true, runValidators: true }
  );
};

/**
 * Delete user
 */
export const deleteUser = async (userId: string | Types.ObjectId): Promise<boolean> => {
  const result = await User.findByIdAndDelete(userId);
  return result !== null;
};

/**
 * Compare password
 */
export const comparePassword = async (
  user: IUserDocument,
  password: string
): Promise<boolean> => {
  return user.comparePassword(password);
};
