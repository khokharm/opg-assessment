"use client";

import WeatherDisplayCard from "./WeatherDisplayCard";

interface Location {
  id: string;
  name: string;
  lat: number;
  lon: number;
}

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

interface WeatherData {
  location: Location;
  current: WeatherCurrent | null;
  forecast: ForecastPeriod[];
  lastUpdated: string;
  error?: string;
}

interface WeatherCardListProps {
  weatherData: WeatherData[];
  onDeleteLocation?: (locationId: string) => void;
}

export default function WeatherCardList({ weatherData, onDeleteLocation }: WeatherCardListProps) {
  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {weatherData.map((data) => (
          <WeatherDisplayCard
            key={data.location.id}
            locationName={data.location.name}
            current={data.current}
            forecast={data.forecast}
            error={data.error}
            onDelete={onDeleteLocation ? () => onDeleteLocation(data.location.id) : undefined}
          />
        ))}
      </div>
    </div>
  );
}
