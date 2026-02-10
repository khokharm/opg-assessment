import axios, { AxiosInstance } from 'axios';
import {
  NWSPointsResponse,
  NWSForecastResponse,
  NWSObservationStationsResponse,
  NWSObservation,
  WeatherData,
  Location
} from '../types/Weather';

class NWSService {
  private axiosInstance: AxiosInstance;

  constructor() {
    // Initialize axios with NWS API base URL and required headers
    this.axiosInstance = axios.create({
      baseURL: 'https://api.weather.gov',
      headers: {
        'User-Agent': `(WeatherApp, ${process.env.NWS_USER_AGENT})`, // NWS requires a User-Agent
        'Accept': 'application/geo+json'
      },
      timeout: 10000
    });
  }

  /**
   * Get weather data for a specific location
   */
  async getWeatherData(location: Location): Promise<WeatherData> {
    console.log(`Fetching data for ${location.name}`);

    try {
      // Step 1: Get grid point data
      const pointsData = await this.getPoints(location.lat, location.lon);
      
      // Step 2: Get forecast
      const forecast = await this.getForecast(pointsData.properties.forecast);
      
      // Step 3: Get current observations
      let current = null;
      try {
        const observationStations = await this.getObservationStations(
          pointsData.properties.observationStations
        );
        
        if (observationStations.features.length > 0) {
          const stationId = observationStations.features[0].properties.stationIdentifier;
          current = await this.getCurrentObservation(stationId);
        }
      } catch (error) {
        console.warn(`Could not fetch current observations for ${location.name}:`, error);
        // Continue without current data if observations fail
      }

      const weatherData: WeatherData = {
        location,
        current,
        forecast: forecast.properties.periods,
        lastUpdated: new Date().toISOString()
      };

      return weatherData;
    } catch (error) {
      console.error(`Error fetching weather data for ${location.name}:`, error);
      throw new Error(`Failed to fetch weather data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get grid point information for coordinates
   */
  private async getPoints(lat: number, lon: number): Promise<NWSPointsResponse> {
    const response = await this.axiosInstance.get<NWSPointsResponse>(
      `/points/${lat.toFixed(4)},${lon.toFixed(4)}`
    );
    return response.data;
  }

  /**
   * Get forecast from forecast URL
   */
  private async getForecast(forecastUrl: string): Promise<NWSForecastResponse> {
    const response = await this.axiosInstance.get<NWSForecastResponse>(forecastUrl);
    return response.data;
  }

  /**
   * Get observation stations
   */
  private async getObservationStations(stationsUrl: string): Promise<NWSObservationStationsResponse> {
    const response = await this.axiosInstance.get<NWSObservationStationsResponse>(stationsUrl);
    return response.data;
  }

  /**
   * Get current observation from a station
   */
  private async getCurrentObservation(stationId: string) {
    try {
      const response = await this.axiosInstance.get<NWSObservation>(
        `/stations/${stationId}/observations/latest`
      );
      
      const obs = response.data.properties;
      
      // Convert from Celsius to Fahrenheit if needed
      const tempC = obs.temperature.value;
      const tempF = tempC !== null ? (tempC * 9/5) + 32 : null;
      
      // Convert wind speed from km/h to mph
      const windKmh = obs.windSpeed.value;
      const windMph = windKmh !== null ? windKmh * 0.621371 : null;
      
      // Convert visibility from meters to miles
      const visibilityM = obs.visibility.value;
      const visibilityMi = visibilityM !== null ? visibilityM * 0.000621371 : null;
      
      // Convert pressure from Pa to inHg
      const pressurePa = obs.barometricPressure.value;
      const pressureInHg = pressurePa !== null ? pressurePa * 0.0002953 : null;

      return {
        temperature: tempF !== null ? Math.round(tempF) : 0,
        temperatureUnit: 'F',
        description: obs.textDescription || 'No description available',
        icon: obs.icon || '',
        humidity: obs.relativeHumidity.value || 0,
        windSpeed: windMph !== null ? Math.round(windMph) : 0,
        windDirection: obs.windDirection.value || 0,
        visibility: visibilityMi !== null ? parseFloat(visibilityMi.toFixed(1)) : 0,
        pressure: pressureInHg !== null ? parseFloat(pressureInHg.toFixed(2)) : 0,
        timestamp: obs.timestamp
      };
    } catch (error) {
      console.error(`Error fetching current observation for ${stationId}:`, error);
      return null;
    }
  }

}

export default new NWSService();