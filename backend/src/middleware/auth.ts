import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { findUserById } from '../db/repositories/userRepository';
import { config } from '../config';

/**
 * JWT payload interface
 */
interface JwtPayload {
  userId: string;
}

/**
 * Authentication middleware
 * Verifies JWT token and attaches user to request
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from cookie or Authorization header
    let token = req.cookies?.auth_token;

    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    // Verify token
    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        res.status(401).json({ error: 'Token expired' });
        return;
      }
      res.status(401).json({ error: 'Invalid token' });
      return;
    }

    // Find user
    const user = await findUserById(decoded.userId);
    if (!user) {
      res.status(401).json({ error: 'User not found' });
      return;
    }

    // Attach user to request
    req.user = user;

    next();
  } catch (error) {
    console.error('Error in authenticate middleware:', error);
    res.status(500).json({
      error: 'Authentication error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * Optional authentication middleware
 * Attaches user to request if token exists, but doesn't fail if not
 */
export const optionalAuthenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from cookie or Authorization header
    let token = req.cookies?.auth_token;

    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      // No token, continue without user
      next();
      return;
    }

    // Verify token
    try {
      const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;

      // Find user
      const user = await findUserById(decoded.userId);
      if (user) {
        req.user = user;
      }
    } catch (error) {
      // Invalid token, continue without user
      console.log('Invalid token in optional auth:', error);
    }

    next();
  } catch (error) {
    console.error('Error in optionalAuthenticate middleware:', error);
    next();
  }
};
