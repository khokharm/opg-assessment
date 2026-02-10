"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import WeatherCardList from "@/components/WeatherCardList";
import { SearchBar } from "@/components/SearchBar";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  const { user } = useAuth();
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
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20" />
        
        <div className="relative container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Your Weather,
              <span className="block text-blue-200">Anywhere, Anytime</span>
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-blue-100 leading-relaxed">
              Get real-time weather updates for cities around the world. 
              Plan your day with confidence and stay ahead of the weather.
            </p>
            
            {!user ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/register">
                  <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 text-lg px-8 py-6 h-auto font-semibold shadow-xl">
                    Get Started Free
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-6 h-auto font-semibold">
                    Sign In
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="mt-8">
                <p className="text-xl mb-6">Welcome back, {user.username}! Start exploring weather data below.</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Wave decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose Our Weather Dashboard?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to keep you informed and prepared
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="border-2 hover:shadow-xl transition-shadow duration-300">
              <CardContent className="pt-8 pb-8 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Real-Time Updates</h3>
                <p className="text-gray-600 leading-relaxed">
                  Get accurate, up-to-the-minute weather data for cities worldwide with instant updates.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-xl transition-shadow duration-300">
              <CardContent className="pt-8 pb-8 text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Smart Search</h3>
                <p className="text-gray-600 leading-relaxed">
                  Find weather information for any city instantly with our intelligent search and autocomplete.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-xl transition-shadow duration-300">
              <CardContent className="pt-8 pb-8 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Mobile Friendly</h3>
                <p className="text-gray-600 leading-relaxed">
                  Access weather data on any device with our fully responsive, mobile-optimized design.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Try It Now
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Search for any city and see live weather data
            </p>
          </div>

          <div className="mb-8 max-w-md mx-auto">
            <SearchBar
              suggestions={citySuggestions}
              onSearch={handleSearch}
              onSelectSuggestion={handleSelectSuggestion}
              placeholder="Search for a city..."
              className="mb-2 shadow-lg"
            />
            {selectedCity && (
              <p className="text-sm text-gray-600 text-center mt-4">
                Showing weather for: <span className="font-semibold">{selectedCity}</span>
              </p>
            )}
          </div>
          
          <WeatherCardList weatherData={filteredData} />
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl mb-10 max-w-2xl mx-auto text-blue-100">
              Join thousands of users who trust our weather dashboard for accurate, reliable weather information.
            </p>
            <Link href="/register">
              <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 text-lg px-10 py-6 h-auto font-semibold shadow-xl">
                Create Free Account
              </Button>
            </Link>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Weather Dashboard</h3>
              <p className="text-gray-400">
                Your trusted source for accurate weather information worldwide.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link href="/login" className="hover:text-white transition-colors">Sign In</Link></li>
                <li><Link href="/register" className="hover:text-white transition-colors">Sign Up</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Contact</h4>
              <p className="text-gray-400">
                Questions? Get in touch with our support team.
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500">
            <p>&copy; 2026 Weather Dashboard. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
