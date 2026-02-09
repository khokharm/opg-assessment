// src/routes/weather.routes.ts

import { Router } from 'express';
import {
  getWeather,
  getMultipleWeather,
  searchLocations
} from '../controllers/weather';

const router = Router();

/**
 * @route   GET /api/weather
 * @desc    Get weather data for a single location
 * @query   lat, lon, name (optional)
 */
router.get('/weather', getWeather);

/**
 * @route   POST /api/weather/multiple
 * @desc    Get weather data for multiple locations
 * @body    { locations: [{ lat, lon, name, id }] }
 */
router.post('/weather/multiple', getMultipleWeather);

/**
 * @route   GET /api/search
 * @desc    Search for locations
 * @query   query
 */
router.get('/search', searchLocations);

export default router;