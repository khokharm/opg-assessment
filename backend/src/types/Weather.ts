// backend/src/types/Weather.ts

export interface Location {
  id: string;
  name: string;
  lat: number;
  lon: number;
}

export interface NWSPointsResponse {
  properties: {
    gridId: string;
    gridX: number;
    gridY: number;
    forecast: string;
    forecastHourly: string;
    forecastGridData: string;
    observationStations: string;
  };
}

export interface NWSPeriod {
  number: number;
  name: string;
  startTime: string;
  endTime: string;
  isDaytime: boolean;
  temperature: number;
  temperatureUnit: string;
  temperatureTrend: string | null;
  windSpeed: string;
  windDirection: string;
  icon: string;
  shortForecast: string;
  detailedForecast: string;
}

export interface NWSForecastResponse {
  properties: {
    updated: string;
    units: string;
    forecastGenerator: string;
    generatedAt: string;
    updateTime: string;
    validTimes: string;
    elevation: {
      value: number;
      unitCode: string;
    };
    periods: NWSPeriod[];
  };
}

export interface NWSObservationStation {
  id: string;
  type: string;
  geometry: {
    type: string;
    coordinates: number[];
  };
  properties: {
    stationIdentifier: string;
    name: string;
  };
}

export interface NWSObservationStationsResponse {
  features: NWSObservationStation[];
}

export interface NWSObservation {
  properties: {
    timestamp: string;
    textDescription: string;
    icon: string;
    temperature: {
      value: number;
      unitCode: string;
    };
    dewpoint: {
      value: number;
      unitCode: string;
    };
    windDirection: {
      value: number;
      unitCode: string;
    };
    windSpeed: {
      value: number;
      unitCode: string;
    };
    windGust: {
      value: number | null;
      unitCode: string;
    };
    barometricPressure: {
      value: number;
      unitCode: string;
    };
    visibility: {
      value: number;
      unitCode: string;
    };
    relativeHumidity: {
      value: number;
      unitCode: string;
    };
  };
}

export interface WeatherData {
  location: Location;
  current:
    | {
        temperature: number;
        temperatureUnit: string;
        description: string;
        icon: string;
        humidity: number;
        windSpeed: number;
        windDirection: number;
        visibility: number;
        pressure: number;
        timestamp: string;
      }
    | null;
  forecast: NWSPeriod[];
  lastUpdated: string;
}

export interface GeocodingResult {
  display_name: string;
  lat: string;
  lon: string;
  address: {
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    country?: string;
  };
}