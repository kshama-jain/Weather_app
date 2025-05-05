
import React from 'react';
import { CurrentWeather as CurrentWeatherType } from '@/services/weatherService';
import { Card, CardContent } from '@/components/ui/card';
import { Droplet, Wind, Gauge, Eye, Thermometer, Compass, CloudSun, Star } from 'lucide-react';
import { getWindDirection } from '@/utils/weatherUtils';

interface WeatherDetailsProps {
  data: CurrentWeatherType | null;
}

const WeatherDetails: React.FC<WeatherDetailsProps> = ({ data }) => {
  if (!data) {
    return null;
  }
  
  // Generate a fun fact based on the weather data
  const getFunWeatherFact = () => {
    const weatherType = data.weather[0].main.toLowerCase();
    const temp = Math.round(data.main.temp);
    const humidity = data.main.humidity;
    const windSpeed = Math.round(data.wind.speed);
    
    if (weatherType === 'clear' && temp > 25) {
      return "On a hot day like today, sidewalks can get hot enough to fry an egg! But please don't try it!";
    } else if (weatherType.includes('rain')) {
      return "The smell of rain has a name! It's called 'petrichor' and comes from oils released by plants mixed with bacteria in the soil.";
    } else if (weatherType.includes('snow')) {
      return "No two snowflakes are exactly alike! Each one is a unique masterpiece of nature's art!";
    } else if (humidity > 80) {
      return "Humid day! Your hair might get curly today. Humidity affects hair because water molecules attach to the proteins in hair.";
    } else if (windSpeed > 10) {
      return "It's windy! Perfect day for kites! The world record for the longest kite flight is 180 hours. That's 7.5 days!";
    }
    
    return "Weather fact: Clouds can weigh millions of pounds! An average cumulus cloud weighs about 1.1 million pounds!";
  };
  
  return (
    <Card className="glass-card backdrop-blur-lg border-white/40 transform transition-all hover:rotate-1">
      <CardContent className="p-8">
        <h3 className="text-2xl font-semibold mb-6 flex items-center">
          <Star className="mr-2 text-primary/80 animate-pulse" />
          Weather Details
          <Star className="ml-2 text-primary/80 animate-pulse" />
        </h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          <div className="glass-card p-4 text-center border-white/40 hover:border-primary/40 transition-all duration-300 transform hover:scale-105 hover:-rotate-3">
            <div className="flex justify-center mb-2">
              <Droplet className="h-6 w-6 text-blue-400 animate-bounce" />
            </div>
            <p className="text-sm text-gray-600">Humidity</p>
            <p className="text-xl font-semibold">{data.main.humidity}%</p>
          </div>
          
          <div className="glass-card p-4 text-center border-white/40 hover:border-primary/40 transition-all duration-300 transform hover:scale-105 hover:rotate-3">
            <div className="flex justify-center mb-2">
              <Wind className="h-6 w-6 text-purple-400 animate-float" />
            </div>
            <p className="text-sm text-gray-600">Wind Speed</p>
            <p className="text-xl font-semibold">{Math.round(data.wind.speed)} m/s</p>
            <p className="text-xs mt-1 text-gray-500">{getWindDirection(data.wind.deg)}</p>
          </div>
          
          <div className="glass-card p-4 text-center border-white/40 hover:border-primary/40 transition-all duration-300 transform hover:scale-105 hover:-rotate-3">
            <div className="flex justify-center mb-2">
              <Gauge className="h-6 w-6 text-green-400 animate-pulse" />
            </div>
            <p className="text-sm text-gray-600">Pressure</p>
            <p className="text-xl font-semibold">{data.main.pressure} hPa</p>
          </div>
          
          <div className="glass-card p-4 text-center border-white/40 hover:border-primary/40 transition-all duration-300 transform hover:scale-105 hover:rotate-3">
            <div className="flex justify-center mb-2">
              <Eye className="h-6 w-6 text-yellow-400 animate-float" />
            </div>
            <p className="text-sm text-gray-600">Visibility</p>
            <p className="text-xl font-semibold">{data.visibility ? `${(data.visibility / 1000).toFixed(1)} km` : 'N/A'}</p>
          </div>
        </div>
        
        <div className="mt-8 p-4 glass-card bg-gradient-to-r from-white/10 to-white/20">
          <div className="flex items-center mb-2">
            <CloudSun className="h-5 w-5 text-yellow-400 mr-2" />
            <h4 className="font-medium">Weather Fact</h4>
          </div>
          <p className="text-sm italic">{getFunWeatherFact()}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherDetails;
