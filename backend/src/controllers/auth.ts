import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import {
  createUser,
  findUserByEmail,
  comparePassword,
  sanitizeUser,
} from '../db/repositories/userRepository';
import { config } from '../config';

/**
 * Validation schemas
 */
const registerSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  username: z.string().min(3, 'Username must be at least 3 characters').max(30),
});

const loginSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

/**
 * Generate JWT token
 */
const generateToken = (userId: string): string => {
  return jwt.sign(
    { userId },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn } as jwt.SignOptions
  );
};

/**
 * Set auth cookie
 */
const setAuthCookie = (res: Response, token: string): void => {
  res.cookie('auth_token', token, {
    httpOnly: true,
    secure: config.nodeEnv === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

/**
 * Register a new user
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate request body
    const validationResult = registerSchema.safeParse(req.body);
    if (!validationResult.success) {
      res.status(400).json({
        error: 'Validation error',
        details: validationResult.error.issues,
      });
      return;
    }

    const { email, password, username } = validationResult.data;

    // Create user
    const user = await createUser(email, password, username);

    // Generate token
    const token = generateToken(user._id!.toString());

    // Set cookie
    setAuthCookie(res, token);

    // Return user without password
    res.status(201).json({
      message: 'User registered successfully',
      user: sanitizeUser(user),
      token,
    });
  } catch (error) {
    console.error('Error in register:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('already exists')) {
        res.status(409).json({ error: error.message });
        return;
      }
    }

    res.status(500).json({
      error: 'Failed to register user',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * Login user
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate request body
    const validationResult = loginSchema.safeParse(req.body);
    if (!validationResult.success) {
      res.status(400).json({
        error: 'Validation error',
        details: validationResult.error.issues,
      });
      return;
    }

    const { email, password } = validationResult.data;

    // Find user
    const user = await findUserByEmail(email);
    if (!user) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    // Verify password
    const isPasswordValid = await comparePassword(user, password);
    if (!isPasswordValid) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    // Generate token
    const token = generateToken(user._id!.toString());

    // Set cookie
    setAuthCookie(res, token);

    // Return user without password
    res.json({
      message: 'Login successful',
      user: sanitizeUser(user),
      token,
    });
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({
      error: 'Failed to login',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * Logout user
 */
export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    // Clear auth cookie
    res.clearCookie('auth_token', {
      httpOnly: true,
      secure: config.nodeEnv === 'production',
      sameSite: 'strict',
    });

    res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Error in logout:', error);
    res.status(500).json({
      error: 'Failed to logout',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * Get current authenticated user
 */
export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    // Return user without password
    res.json({
      user: sanitizeUser(req.user),
    });
  } catch (error) {
    console.error('Error in getCurrentUser:', error);
    res.status(500).json({
      error: 'Failed to get user',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
