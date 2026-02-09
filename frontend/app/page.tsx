"use client";

import { useState } from "react";
import WeatherCardList from "@/components/WeatherCardList";
import { SearchBar } from "@/components/SearchBar";
import Header from "@/components/Header";

export default function Home() {
  const weatherData = [
    { location: 'London', temperature: '22°C' },
    { location: 'New York', temperature: '18°C' },
    { location: 'Tokyo', temperature: '25°C' },
    { location: 'Sydney', temperature: '28°C' },
    { location: 'Paris', temperature: '20°C' },
    { location: 'Dubai', temperature: '45°C' },
  ];

  const [filteredData, setFilteredData] = useState(weatherData);
  const [selectedCity, setSelectedCity] = useState<string>("");

  // Extract city names for suggestions
  const citySuggestions = weatherData.map(data => data.location);

  const handleSearch = (query: string) => {
    if (query.trim() === "") {
      setFilteredData(weatherData);
      setSelectedCity("");
    } else {
      const filtered = weatherData.filter(data =>
        data.location.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredData(filtered);
    }
  };

  const handleSelectSuggestion = (city: string) => {
    setSelectedCity(city);
    const filtered = weatherData.filter(data => data.location === city);
    setFilteredData(filtered);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8 max-w-md mx-auto">
            <h1 className="text-3xl font-bold text-center mb-4 text-gray-800">
              Weather Dashboard
            </h1>
            <SearchBar
              suggestions={citySuggestions}
              onSearch={handleSearch}
              onSelectSuggestion={handleSelectSuggestion}
              placeholder="Search for a city..."
              className="mb-2"
            />
            {selectedCity && (
              <p className="text-sm text-gray-600 text-center">
                Showing weather for: <span className="font-semibold">{selectedCity}</span>
              </p>
            )}
          </div>
          <WeatherCardList weatherData={filteredData} />
        </div>
      </div>
    </>
  );
}
