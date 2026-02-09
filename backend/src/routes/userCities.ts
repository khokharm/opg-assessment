import { Router } from 'express';
import {
  addCity,
  removeCity,
  getTrackedCities,
  getTrackedCitiesWeather,
} from '../controllers/userCities';

const router = Router();

/**
 * @route   POST /api/user/cities
 * @desc    Add city to user's tracked list
 * @access  Private
 */
router.post('/cities', addCity);

/**
 * @route   DELETE /api/user/cities/:cityId
 * @desc    Remove city from user's tracked list
 * @access  Private
 */
router.delete('/cities/:cityId', removeCity);

/**
 * @route   GET /api/user/cities
 * @desc    Get all tracked cities for user
 * @access  Private
 */
router.get('/cities', getTrackedCities);

/**
 * @route   GET /api/user/cities/weather
 * @desc    Get weather data for all tracked cities
 * @access  Private
 */
router.get('/cities/weather', getTrackedCitiesWeather);

export default router;
