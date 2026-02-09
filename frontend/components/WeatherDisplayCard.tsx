"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface WeatherDisplayCardProps {
  location: string;
  temperature: string;
}

export default function WeatherDisplayCard({ location, temperature }: WeatherDisplayCardProps) {
  return (
    <div className="w-full max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Weather Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
            <span className="text-sm font-medium text-gray-700">Location</span>
            <span className="text-lg font-semibold text-gray-900">{location}</span>
          </div>

          <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
            <span className="text-sm font-medium text-gray-700">Temperature</span>
            <span className="text-lg font-semibold text-gray-900">{temperature}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
