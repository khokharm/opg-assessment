// src/services/geocoding.service.ts

import axios, { AxiosInstance } from 'axios';
import { GeocodingResult } from '../types/Weather';

class GeocodingService {
  private axiosInstance: AxiosInstance;

  constructor() {
    // Using Nominatim (OpenStreetMap) for free geocoding
    this.axiosInstance = axios.create({
      baseURL: 'https://nominatim.openstreetmap.org',
      headers: {
        'User-Agent': 'WeatherApp/1.0'
      },
      timeout: 5000
    });
  }

  /**
   * Search for locations by query string
   * Filtered to US only to work with NWS API
   */
  async searchLocation(query: string): Promise<GeocodingResult[]> {
    try {
      const response = await this.axiosInstance.get<GeocodingResult[]>('/search', {
        params: {
          q: query,
          format: 'json',
          addressdetails: 1,
          countrycodes: 'us', // Restrict to US only
          limit: 5
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error searching location:', error);
      throw new Error('Failed to search location');
    }
  }

  /**
   * Format geocoding result into a friendly display name
   */
  formatLocationName(result: GeocodingResult): string {
    const city = result.address.city || result.address.town || result.address.village || '';
    const state = result.address.state || '';
    
    if (city && state) {
      return `${city}, ${state}`;
    } else if (city) {
      return city;
    } else if (state) {
      return state;
    }
    
    return result.display_name;
  }
}

export default new GeocodingService();