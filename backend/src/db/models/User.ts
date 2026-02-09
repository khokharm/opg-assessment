import mongoose, { Document, Schema, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

/**
 * Tracked city interface
 */
export interface TrackedCity {
  id: string;
  name: string;
  lat: number;
  lon: number;
  addedAt: Date;
}

/**
 * User interface
 */
export interface IUser {
  email: string;
  password: string;
  username: string;
  trackedCities: TrackedCity[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * User document interface (includes Mongoose document methods)
 */
export interface IUserDocument extends IUser, Document {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

/**
 * User model interface
 */
export interface IUserModel extends Model<IUserDocument> {
  hashPassword(password: string): Promise<string>;
}

/**
 * Tracked city schema
 */
const trackedCitySchema = new Schema<TrackedCity>(
  {
    id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    lat: {
      type: Number,
      required: true,
    },
    lon: {
      type: Number,
      required: true,
    },
    addedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

/**
 * User schema
 */
const userSchema = new Schema<IUserDocument, IUserModel>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
      index: true,
    },
    trackedCities: {
      type: [trackedCitySchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Pre-save middleware to hash password
 */
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

/**
 * Instance method to compare password
 */
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

/**
 * Static method to hash password
 */
userSchema.statics.hashPassword = async function (password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

/**
 * Remove password from JSON output
 */
userSchema.set('toJSON', {
  transform: function (doc, ret) {
    const { password, ...rest } = ret;
    return rest;
  },
});

/**
 * User model
 */
export const User = mongoose.model<IUserDocument, IUserModel>('User', userSchema);
