// src/controllers/weather.controller.ts

import { Request, Response } from 'express';
import nwsService from '../service/nws';
import geocodingService from '../service/geocoding';
import { Location } from '../types/Weather';

/**
 * Get weather data for a specific location
 */
export const getWeather = async (req: Request, res: Response): Promise<void> => {
  try {
    const { lat, lon, name } = req.query;

    if (!lat || !lon) {
      res.status(400).json({ 
        error: 'Missing required parameters: lat and lon' 
      });
      return;
    }

    const latitude = parseFloat(lat as string);
    const longitude = parseFloat(lon as string);

    if (isNaN(latitude) || isNaN(longitude)) {
      res.status(400).json({ 
        error: 'Invalid coordinates' 
      });
      return;
    }

    const location: Location = {
      id: `${latitude}_${longitude}`,
      name: (name as string) || `${latitude}, ${longitude}`,
      lat: latitude,
      lon: longitude
    };

    const weatherData = await nwsService.getWeatherData(location);
    res.json(weatherData);
  } catch (error) {
    console.error('Error in getWeather:', error);
    res.status(500).json({ 
      error: 'Failed to fetch weather data',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Get weather data for multiple locations
 */
export const getMultipleWeather = async (req: Request, res: Response): Promise<void> => {
  try {
    const { locations } = req.body;

    if (!Array.isArray(locations) || locations.length === 0) {
      res.status(400).json({ 
        error: 'Invalid request: locations must be a non-empty array' 
      });
      return;
    }

    // Validate locations
    for (const loc of locations) {
      if (!loc.lat || !loc.lon) {
        res.status(400).json({ 
          error: 'Each location must have lat and lon properties' 
        });
        return;
      }
    }

    // Fetch weather data for all locations in parallel
    const weatherPromises = locations.map(async (loc) => {
      const location: Location = {
        id: loc.id || `${loc.lat}_${loc.lon}`,
        name: loc.name || `${loc.lat}, ${loc.lon}`,
        lat: parseFloat(loc.lat),
        lon: parseFloat(loc.lon)
      };

      try {
        return await nwsService.getWeatherData(location);
      } catch (error) {
        console.error(`Error fetching weather for ${location.name}:`, error);
        return {
          location,
          current: null,
          forecast: [],
          lastUpdated: new Date().toISOString(),
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    });

    const weatherDataArray = await Promise.all(weatherPromises);
    res.json(weatherDataArray);
  } catch (error) {
    console.error('Error in getMultipleWeather:', error);
    res.status(500).json({ 
      error: 'Failed to fetch weather data',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Search for locations by name
 */
export const searchLocations = async (req: Request, res: Response): Promise<void> => {
  try {
    const { query } = req.query;

    if (!query || typeof query !== 'string') {
      res.status(400).json({ 
        error: 'Missing or invalid query parameter' 
      });
      return;
    }

    const results = await geocodingService.searchLocation(query);
    
    // Transform results into Location objects
    const locations = results.map(result => ({
      id: `${result.lat}_${result.lon}`,
      name: geocodingService.formatLocationName(result),
      lat: parseFloat(result.lat),
      lon: parseFloat(result.lon),
      displayName: result.display_name
    }));

    res.json(locations);
  } catch (error) {
    console.error('Error in searchLocations:', error);
    res.status(500).json({ 
      error: 'Failed to search locations',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};