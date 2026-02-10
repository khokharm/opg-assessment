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

export interface Location {
  id: string;
  name: string;
  lat: number;
  lon: number;
  displayName?: string;
}

export interface TrackedCity {
  id: string;
  name: string;
  lat: number;
  lon: number;
  addedAt: string;
}

export interface WeatherCurrent {
  temperature: number;
  feelsLike?: number;
  description: string;
  humidity?: number;
  windSpeed?: number;
  windDirection?: string;
  pressure?: number;
  visibility?: number;
  icon?: string;
}

export interface ForecastPeriod {
  name: string;
  temperature: number;
  shortForecast: string;
  detailedForecast: string;
  isDaytime: boolean;
  windSpeed: string;
  windDirection: string;
  icon: string;
}

export interface WeatherData {
  location: Location;
  current: WeatherCurrent | null;
  forecast: ForecastPeriod[];
  lastUpdated: string;
  error?: string;
}

export interface AddCityResponse {
  message: string;
  city: Location;
  trackedCities: TrackedCity[];
}

export interface TrackedCitiesResponse {
  trackedCities: TrackedCity[];
  count: number;
}

export interface WeatherDataResponse {
  weatherData: WeatherData[];
  count: number;
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

/**
 * Search for locations by name
 */
export async function searchLocations(query: string): Promise<Location[]> {
  if (!query || query.trim() === '') {
    return [];
  }

  const response = await fetch(`${API_BASE_URL}/search?query=${encodeURIComponent(query)}`, {
    credentials: 'include', // Include cookies
  });

  // Check if response is JSON
  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    throw new Error(`Server returned ${response.status}: Expected JSON response but got ${contentType}`);
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to search locations');
  }

  return data;
}

/**
 * Add a city to user's tracked cities
 */
export async function addTrackedCity(city: Location): Promise<AddCityResponse> {
  const response = await fetch(`${API_BASE_URL}/user/cities`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Include cookies
    body: JSON.stringify({
      id: city.id,
      name: city.name,
      lat: city.lat,
      lon: city.lon,
    }),
  });

  // Check if response is JSON
  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    throw new Error(`Server returned ${response.status}: Expected JSON response but got ${contentType}`);
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to add city');
  }

  return data;
}

/**
 * Get all tracked cities for the current user
 */
export async function getTrackedCities(): Promise<TrackedCitiesResponse> {
  const response = await fetch(`${API_BASE_URL}/user/cities`, {
    credentials: 'include', // Include cookies
  });

  // Check if response is JSON
  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    throw new Error(`Server returned ${response.status}: Expected JSON response but got ${contentType}`);
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to get tracked cities');
  }

  return data;
}

/**
 * Get weather data for all tracked cities
 */
export async function getTrackedCitiesWeather(): Promise<WeatherDataResponse> {
  const response = await fetch(`${API_BASE_URL}/user/cities/weather`, {
    credentials: 'include', // Include cookies
  });

  // Check if response is JSON
  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    throw new Error(`Server returned ${response.status}: Expected JSON response but got ${contentType}`);
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to get weather data');
  }

  return data;
}

/**
 * Remove a city from user's tracked cities
 */
export async function removeTrackedCity(cityId: string): Promise<{ message: string; trackedCities: TrackedCity[] }> {
  const response = await fetch(`${API_BASE_URL}/user/cities/${encodeURIComponent(cityId)}`, {
    method: 'DELETE',
    credentials: 'include', // Include cookies
  });

  // Check if response is JSON
  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    throw new Error(`Server returned ${response.status}: Expected JSON response but got ${contentType}`);
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to remove city');
  }

  return data;
}
