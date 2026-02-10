/**
 * API utility functions for making requests to the backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export interface User {
  _id: string;
  email: string;
  username: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export interface ErrorResponse {
  error: string;
  details?: unknown;
  message?: string;
}

/**
 * Register a new user
 */
export async function register(
  email: string,
  password: string,
  username: string
): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Include cookies
    body: JSON.stringify({ email, password, username }),
  });

  // Check if response is JSON
  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    throw new Error(`Server returned ${response.status}: Expected JSON response but got ${contentType}`);
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to register');
  }

  return data;
}

/**
 * Login user
 */
export async function login(email: string, password: string): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Include cookies
    body: JSON.stringify({ email, password }),
  });

  // Check if response is JSON
  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    throw new Error(`Server returned ${response.status}: Expected JSON response but got ${contentType}`);
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to login');
  }

  return data;
}

/**
 * Logout user
 */
export async function logout(): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: 'POST',
    credentials: 'include', // Include cookies
  });

  if (!response.ok) {
    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to logout');
    } else {
      throw new Error(`Server returned ${response.status}: Failed to logout`);
    }
  }
}

/**
 * Get current authenticated user
 */
export async function getCurrentUser(): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    credentials: 'include', // Include cookies
  });

  // Check if response is JSON
  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    throw new Error(`Server returned ${response.status}: Expected JSON response but got ${contentType}`);
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to get user');
  }

  return data.user;
}
