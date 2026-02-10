"use client";

import WeatherDisplayCard from "./WeatherDisplayCard";

interface WeatherData {
  location: string;
  temperature: string;
}

interface WeatherCardListProps {
  weatherData: WeatherData[];
  onDeleteLocation?: (location: string) => void;
}

export default function WeatherCardList({ weatherData, onDeleteLocation }: WeatherCardListProps) {
  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {weatherData.map((data, index) => (
          <WeatherDisplayCard
            key={`${data.location}-${index}`}
            location={data.location}
            temperature={data.temperature}
            onDelete={onDeleteLocation ? () => onDeleteLocation(data.location) : undefined}
          />
        ))}
      </div>
    </div>
  );
}
