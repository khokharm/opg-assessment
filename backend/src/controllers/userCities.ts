import { Request, Response } from 'express';
import { z } from 'zod';
import {
  addTrackedCity as addCityToUser,
  removeTrackedCity as removeCityFromUser,
  getTrackedCities as getUserTrackedCities,
} from '../db/repositories/userRepository';
import { Location } from '../types/Weather';
import nwsService from '../service/nws';

/**
 * Validation schemas
 */
const addCitySchema = z.object({
  id: z.string(),
  name: z.string(),
  lat: z.number(),
  lon: z.number(),
});

/**
 * Add city to user's tracked list
 */
export const addCity = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    // Validate request body
    const validationResult = addCitySchema.safeParse(req.body);
    if (!validationResult.success) {
      res.status(400).json({
        error: 'Validation error',
        details: validationResult.error.issues,
      });
      return;
    }

    const cityData = validationResult.data;

    // Add city to user
    const updatedUser = await addCityToUser(req.user._id!, cityData);

    if (!updatedUser) {
      res.status(500).json({ error: 'Failed to add city' });
      return;
    }

    res.status(201).json({
      message: 'City added successfully',
      city: cityData,
      trackedCities: updatedUser.trackedCities,
    });
  } catch (error) {
    console.error('Error in addCity:', error);

    if (error instanceof Error) {
      if (error.message === 'City already tracked') {
        res.status(409).json({ error: error.message });
        return;
      }
    }

    res.status(500).json({
      error: 'Failed to add city',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * Remove city from user's tracked list
 */
export const removeCity = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { cityId } = req.params;

    if (!cityId) {
      res.status(400).json({ error: 'City ID is required' });
      return;
    }

    // Remove city from user
    const updatedUser = await removeCityFromUser(req.user._id!, cityId);

    if (!updatedUser) {
      res.status(500).json({ error: 'Failed to remove city' });
      return;
    }

    res.json({
      message: 'City removed successfully',
      trackedCities: updatedUser.trackedCities,
    });
  } catch (error) {
    console.error('Error in removeCity:', error);
    res.status(500).json({
      error: 'Failed to remove city',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * Get all tracked cities for user
 */
export const getTrackedCities = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const cities = await getUserTrackedCities(req.user._id!);

    res.json({
      trackedCities: cities,
      count: cities.length,
    });
  } catch (error) {
    console.error('Error in getTrackedCities:', error);
    res.status(500).json({
      error: 'Failed to get tracked cities',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * Get weather data for all tracked cities
 */
export const getTrackedCitiesWeather = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    // Get user's tracked cities
    const cities = await getUserTrackedCities(req.user._id!);

    if (cities.length === 0) {
      res.json({
        weatherData: [],
        count: 0,
        message: 'No tracked cities found',
      });
      return;
    }

    // Fetch weather data for each city in parallel
    const weatherPromises = cities.map(async (city) => {
      const location: Location = {
        id: city.id,
        name: city.name,
        lat: city.lat,
        lon: city.lon,
      };

      try {
        return await nwsService.getWeatherData(location);
      } catch (error) {
        console.error(`Error fetching weather for ${city.name}:`, error);
        return {
          location,
          current: null,
          forecast: [],
          lastUpdated: new Date().toISOString(),
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    });

    const weatherData = await Promise.all(weatherPromises);

    res.json({
      weatherData,
      count: weatherData.length,
    });
  } catch (error) {
    console.error('Error in getTrackedCitiesWeather:', error);
    res.status(500).json({
      error: 'Failed to get weather data',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
