"use client";

import { Card, CardContent } from "@/components/ui/card";

interface WeatherCurrent {
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

interface ForecastPeriod {
  name: string;
  temperature: number;
  shortForecast: string;
  detailedForecast: string;
  isDaytime: boolean;
  windSpeed: string;
  windDirection: string;
  icon: string;
}

interface WeatherDisplayCardProps {
  locationName: string;
  current: WeatherCurrent | null;
  forecast: ForecastPeriod[];
  error?: string;
  onDelete?: () => void;
}

export default function WeatherDisplayCard({ 
  locationName, 
  current, 
  forecast, 
  error,
  onDelete 
}: WeatherDisplayCardProps) {
  // Handle error state
  if (error) {
    return (
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-0 shadow-lg bg-red-50 relative">
        <CardContent className="p-6">
          {/* Delete Button - Top Right */}
          {onDelete && (
            <button
              onClick={onDelete}
              className="absolute top-3 right-3 p-1 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200"
              aria-label="Remove location"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}

          {/* Location Name */}
          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {locationName}
            </h3>
          </div>

          {/* Error Message */}
          <div className="flex items-start gap-2 text-red-800">
            <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Use current weather data or forecast if current is not available
  const temperature = current?.temperature ?? (forecast[0]?.temperature || null);
  const description = current?.description || forecast[0]?.shortForecast || 'No data available';
  const humidity = current?.humidity;
  const windSpeed = current?.windSpeed;
  const pressure = current?.pressure;

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-0 shadow-lg bg-gray-50 relative">
      <CardContent className="p-6">
        {/* Delete Button - Top Right */}
        {onDelete && (
          <button
            onClick={onDelete}
            className="absolute top-3 right-3 p-1 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200"
            aria-label="Remove location"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {/* Location Name - Top Left */}
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {locationName}
          </h3>
          {description && (
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          )}
        </div>

        {/* Temperature Display */}
        {temperature !== null ? (
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">Current Temperature</p>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-blue-600">{Math.round(temperature)}°F</span>
              </div>
              {current?.feelsLike && (
                <p className="text-xs text-gray-500 mt-1">
                  Feels like {Math.round(current.feelsLike)}°F
                </p>
              )}
            </div>
            <div className="h-20 w-20 rounded-full bg-linear-to-br from-blue-400 to-indigo-600 flex items-center justify-center shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-500">Temperature data unavailable</p>
          </div>
        )}

        {/* Additional Weather Info */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs text-gray-500 mb-1">Humidity</p>
              <p className="text-sm font-semibold text-gray-700">
                {humidity !== undefined ? `${Math.round(humidity)}%` : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Wind</p>
              <p className="text-sm font-semibold text-gray-700">
                {windSpeed !== undefined ? `${Math.round(windSpeed)} mph` : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Pressure</p>
              <p className="text-sm font-semibold text-gray-700">
                {pressure !== undefined ? `${Math.round(pressure)} mb` : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
