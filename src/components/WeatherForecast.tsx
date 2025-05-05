
import React from 'react';
import { ForecastWeather } from '@/services/weatherService';
import { formatDate, getWeatherIcon } from '@/utils/weatherUtils';
import { Card, CardContent } from '@/components/ui/card';
import { Cloud, CloudRain, CloudSnow, CloudSun, Sun, Droplet, Thermometer, Gift, Sparkles } from 'lucide-react';

interface WeatherForecastProps {
  forecast: ForecastWeather | null;
  isLoading: boolean;
}

const WeatherIcon: React.FC<{ type: string; className?: string }> = ({ type, className }) => {
  const iconClass = `${className || 'w-12 h-12'} text-primary`;
  
  switch (type) {
    case 'sun':
      return <Sun className={iconClass} />;
    case 'cloud':
      return <Cloud className={iconClass} />;
    case 'cloud-rain':
      return <CloudRain className={iconClass} />;
    case 'cloud-snow':
      return <CloudSnow className={iconClass} />;
    case 'cloud-sun':
      return <CloudSun className={iconClass} />;
    default:
      return <Sun className={iconClass} />;
  }
};

// Activity suggestions based on weather
const getActivitySuggestion = (weatherType: string, temp: number) => {
  if (weatherType.toLowerCase().includes('clear') && temp > 20) {
    return "Perfect for a picnic!";
  } else if (weatherType.toLowerCase().includes('rain')) {
    return "Movie marathon day!";
  } else if (weatherType.toLowerCase().includes('snow')) {
    return "Build a snowman!";
  } else if (weatherType.toLowerCase().includes('cloud') && temp > 15) {
    return "Go fly a kite!";
  } else if (temp < 5) {
    return "Hot chocolate time!";
  } else if (temp > 25) {
    return "Beach day!";
  }
  return "Perfect for a walk!";
};

const WeatherForecast: React.FC<WeatherForecastProps> = ({ forecast, isLoading }) => {
  if (isLoading) {
    return (
      <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-4">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="weather-card shimmer p-4 h-48">
            <div className="h-4 bg-gray-200/40 rounded w-1/2 mb-4"></div>
            <div className="h-16 bg-gray-200/40 rounded-full w-16 mx-auto mb-4"></div>
            <div className="h-6 bg-gray-200/40 rounded w-1/3 mx-auto"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!forecast || !forecast.list || forecast.list.length === 0) {
    return (
      <Card className="glass-card mt-6">
        <CardContent className="p-6 text-center">
          <h3 className="text-lg font-medium">No forecast data available</h3>
        </CardContent>
      </Card>
    );
  }

  // Group forecast by day
  const fiveDayForecast = [];
  const uniqueDays = new Set();
  
  for (const item of forecast.list) {
    const date = new Date(item.dt * 1000);
    const day = date.toLocaleDateString('en-US', { weekday: 'short' });
    
    if (!uniqueDays.has(day) && uniqueDays.size < 5) {
      uniqueDays.add(day);
      fiveDayForecast.push(item);
    }

    if (uniqueDays.size === 5) break;
  }

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-semibold mb-6 flex items-center">
        <Gift className="mr-2 text-primary/80 animate-bounce" />
        5-Day Forecast
        <Sparkles className="ml-2 h-5 w-5 text-yellow-400 animate-pulse" />
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-5">
        {fiveDayForecast.map((day, index) => {
          const weatherCondition = day.weather[0].main;
          const iconType = getWeatherIcon(weatherCondition);
          const temp = Math.round(day.main.temp);
          const activitySuggestion = getActivitySuggestion(weatherCondition, temp);
          
          return (
            <Card 
              key={index} 
              className="glass-card overflow-hidden transform hover:scale-105 transition-all duration-300 border-white/30 hover:border-primary/50"
              style={{
                animationDelay: `${index * 0.2}s`,
                transform: `rotate(${Math.random() > 0.5 ? 2 : -2}deg)`,
              }}
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 to-weather-clear/50"></div>
              <CardContent className="p-5 text-center">
                <h4 className="font-bold text-lg flex items-center justify-center">
                  {formatDate(day.dt)}
                </h4>
                <div className="my-4 flex justify-center relative">
                  <WeatherIcon type={iconType} className="animate-float" />
                </div>
                <p className="text-2xl font-bold">{temp}°C</p>
                <p className="text-sm mt-1 opacity-80 capitalize">{day.weather[0].description}</p>
                <div className="mt-3 flex justify-center items-center text-xs opacity-80 gap-1">
                  <Droplet className="h-3 w-3 text-primary/80" />
                  <span>{day.main.humidity}%</span>
                </div>
                <div className="mt-2 flex justify-between text-xs text-gray-500 pt-2 border-t border-gray-100/20">
                  <div className="flex items-center gap-1">
                    <Thermometer className="h-3 w-3" />
                    <span>Min: {Math.round(day.main.temp_min)}°</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Thermometer className="h-3 w-3" />
                    <span>Max: {Math.round(day.main.temp_max)}°</span>
                  </div>
                </div>
                
                <div className="mt-3 text-center bg-white/30 text-xs py-1.5 px-2 rounded-lg backdrop-blur-sm font-medium">
                  {activitySuggestion}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default WeatherForecast;
