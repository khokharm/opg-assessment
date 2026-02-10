"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import WeatherCardList from "@/components/WeatherCardList";
import { SearchBar } from "@/components/SearchBar";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

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

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

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

  const handleDeleteLocation = (location: string) => {
    // Remove from the main weather data (you might want to persist this to backend)
    const updatedData = weatherData.filter(data => data.location !== location);
    setFilteredData(updatedData.filter(data => 
      selectedCity === "" || data.location === selectedCity
    ));
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50">
      <Navbar />
      
      {/* Dashboard Header */}
      <section className="bg-linear-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-3">
                  Welcome back, {user.username}!
                </h1>
                <p className="text-xl text-blue-100">
                  Your AI-powered weather dashboard
                </p>
              </div>
              <div className="flex gap-3">
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Overview */}
      <section className="container mx-auto px-4 -mt-8 mb-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="shadow-lg border-0">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Locations Tracked</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-2">
                      {weatherData.length}
                    </h3>
                  </div>
                  <div className="h-14 w-14 rounded-full bg-blue-100 flex items-center justify-center">
                    <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">AI Predictions</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-2">
                      {filteredData.length}
                    </h3>
                  </div>
                  <div className="h-14 w-14 rounded-full bg-indigo-100 flex items-center justify-center">
                    <svg className="w-7 h-7 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Accuracy Rate</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-2">98.5%</h3>
                  </div>
                  <div className="h-14 w-14 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>



      {/* Weather Predictions Section */}
      <section className="container mx-auto px-4 pb-12">
        <div className="max-w-7xl mx-auto">
          <Card className="shadow-lg border-0">
            <CardHeader className="border-b bg-white">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl">Weather Predictions</CardTitle>
                  <CardDescription className="text-base mt-2">
                    AI-powered forecasts for your tracked locations
                  </CardDescription>
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="sm">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="mb-6">
                <SearchBar
                  suggestions={citySuggestions}
                  onSearch={handleSearch}
                  onSelectSuggestion={handleSelectSuggestion}
                  placeholder="Search for a location..."
                  className="shadow-sm"
                />
                {selectedCity && (
                  <div className="mt-4 flex items-center gap-2">
                    <p className="text-sm text-gray-600">
                      Showing weather for: <span className="font-semibold text-gray-900">{selectedCity}</span>
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedCity("");
                        setFilteredData(weatherData);
                      }}
                      className="h-auto py-1 px-2 text-xs"
                    >
                      Clear
                    </Button>
                  </div>
                )}
              </div>
              
              {filteredData.length > 0 ? (
                <WeatherCardList 
                  weatherData={filteredData}
                  onDeleteLocation={handleDeleteLocation}
                />
              ) : (
                <div className="text-center py-12">
                  <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No locations found</h3>
                  <p className="text-gray-600">Try searching for a different city</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
