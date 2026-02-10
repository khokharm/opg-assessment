"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import WeatherCardList from "@/components/WeatherCardList";
import { SearchBar, Location } from "@/components/SearchBar";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  searchLocations,
  addTrackedCity,
  getTrackedCitiesWeather,
  removeTrackedCity,
  WeatherData,
} from "@/lib/api";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  // State management
  const [locationSuggestions, setLocationSuggestions] = useState<Location[]>([]);
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Ref for debounce timeout
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load tracked cities weather on mount
  const loadWeatherData = useCallback(async () => {
    if (!user) return;
    
    setIsLoadingWeather(true);
    setError(null);
    
    try {
      const response = await getTrackedCitiesWeather();
      setWeatherData(response.weatherData);
    } catch (err) {
      console.error('Error loading weather data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load weather data');
    } finally {
      setIsLoadingWeather(false);
    }
  }, [user]);

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  // Load weather data on mount
  useEffect(() => {
    if (user && !loading) {
      loadWeatherData();
    }
  }, [user, loading, loadWeatherData]);

  // Debounced search handler
  const handleSearch = useCallback((query: string) => {
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Clear suggestions if query is empty
    if (!query || query.trim() === '') {
      setLocationSuggestions([]);
      return;
    }

    // Set loading state
    setIsSearching(true);

    // Debounce API call
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const locations = await searchLocations(query);
        setLocationSuggestions(locations);
      } catch (err) {
        console.error('Error searching locations:', err);
        setLocationSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    }, 300); // 300ms debounce delay
  }, []);

  // Handle location selection
  const handleSelectSuggestion = useCallback(async (location: Location) => {
    setError(null);
    setSuccessMessage(null);
    
    try {
      await addTrackedCity(location);
      setSuccessMessage(`${location.name} added to your tracked cities!`);
      
      // Clear suggestions
      setLocationSuggestions([]);
      
      // Reload weather data
      await loadWeatherData();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Error adding city:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to add city';
      
      // Handle duplicate city error
      if (errorMessage.includes('already tracked')) {
        setError('This city is already in your tracked list');
      } else {
        setError(errorMessage);
      }
      
      // Clear error after 5 seconds
      setTimeout(() => setError(null), 5000);
    }
  }, [loadWeatherData]);

  // Handle location deletion
  const handleDeleteLocation = useCallback(async (locationId: string) => {
    setError(null);
    
    try {
      await removeTrackedCity(locationId);
      
      // Remove from local state immediately for better UX
      setWeatherData(prev => prev.filter(data => data.location.id !== locationId));
      
      setSuccessMessage('City removed from your tracked list');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Error removing city:', err);
      setError(err instanceof Error ? err.message : 'Failed to remove city');
      
      // Reload data to ensure consistency
      await loadWeatherData();
      
      setTimeout(() => setError(null), 5000);
    }
  }, [loadWeatherData]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <p className="text-sm font-medium text-gray-600">Weather Updates</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-2">
                      {weatherData.length}
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
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="mb-6">
                <SearchBar
                  suggestions={locationSuggestions}
                  onSearch={handleSearch}
                  onSelectSuggestion={handleSelectSuggestion}
                  placeholder="Search for a US city to track..."
                  className="shadow-sm"
                />
                
                {/* Success Message */}
                {successMessage && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-sm text-green-800 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {successMessage}
                    </p>
                  </div>
                )}
                
                {/* Error Message */}
                {error && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-800 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {error}
                    </p>
                  </div>
                )}
              </div>
              
              {/* Loading State */}
              {isLoadingWeather ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600 mb-4" />
                  <p className="text-gray-600">Loading weather data...</p>
                </div>
              ) : weatherData.length > 0 ? (
                <WeatherCardList 
                  weatherData={weatherData}
                  onDeleteLocation={handleDeleteLocation}
                />
              ) : (
                <div className="text-center py-12">
                  <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No tracked cities yet</h3>
                  <p className="text-gray-600">Search for a city above to start tracking weather</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
