
import React from 'react';
import { CurrentWeather as CurrentWeatherType } from '@/services/weatherService';
import { formatDate, formatTime, getWeatherBackground, getWeatherIcon } from '@/utils/weatherUtils';
import { Cloud, CloudRain, CloudSnow, CloudSun, Sun, Sunrise, Sunset, Wind, Droplet, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface CurrentWeatherProps {
  data: CurrentWeatherType | null;
  isLoading: boolean;
}

const WeatherIcon: React.FC<{ type: string; className?: string }> = ({ type, className }) => {
  const iconClass = `${className || 'w-16 h-16'} weather-icon`;
  
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

const CurrentWeather: React.FC<CurrentWeatherProps> = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <div className="weather-card shimmer p-6 h-64 transform transition-all hover:rotate-1">
        <div className="h-6 bg-gray-200/40 rounded w-1/2 mb-4"></div>
        <div className="h-12 bg-gray-200/40 rounded w-1/3 mb-6"></div>
        <div className="h-4 bg-gray-200/40 rounded w-full mb-3"></div>
        <div className="h-4 bg-gray-200/40 rounded w-2/3 mb-3"></div>
        <div className="h-4 bg-gray-200/40 rounded w-3/4"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <Card className="glass-card">
        <CardContent className="p-6 text-center">
          <h2 className="text-xl font-medium">No weather data available</h2>
          <p className="text-gray-500">Search for a city to see the weather</p>
        </CardContent>
      </Card>
    );
  }

  const weatherCondition = data.weather[0].main;
  const backgroundClass = getWeatherBackground(weatherCondition);
  const iconType = getWeatherIcon(weatherCondition);
  
  // Get weather emoji based on weather condition
  const getWeatherEmoji = () => {
    switch(weatherCondition.toLowerCase()) {
      case 'clear': return '😎';
      case 'clouds': return '☁️';
      case 'rain': 
      case 'drizzle': return '🌧️';
      case 'thunderstorm': return '⚡';
      case 'snow': return '☃️';
      case 'mist':
      case 'fog': return '🌫️';
      default: return '🌤️';
    }
  };

  return (
    <div className={`weather-card shadow-2xl ${backgroundClass} transition-all duration-500 transform hover:scale-[1.02] hover:-rotate-1`}>
      <div className="p-8 relative z-10">
        <div className="absolute top-2 right-3 text-2xl animate-bounce">{getWeatherEmoji()}</div>
        
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-3xl font-semibold flex items-center">
              {data.name}, {data.sys.country}
              <Sparkles className="ml-2 h-5 w-5 text-yellow-400 animate-pulse" />
            </h2>
            <p className="text-sm opacity-80 mt-1">{formatDate(data.dt)}</p>
          </div>
          <div className="relative">
            <WeatherIcon type={iconType} className="w-20 h-20" />
            <div className="absolute -right-2 -bottom-2 bg-white/30 rounded-full p-1 backdrop-blur-md animate-pulse">
              <Sparkles className="h-4 w-4 text-yellow-400" />
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-6xl font-bold mb-2 flex items-end">
                {Math.round(data.main.temp)}
                <span className="text-xl ml-1">°C</span>
              </div>
              <div className="text-base capitalize opacity-75">{data.weather[0].description}</div>
            </div>
            <div className="text-right">
              <div className="text-base opacity-75">Feels like: {Math.round(data.main.feels_like)}°C</div>
              <div className="text-sm opacity-75 flex items-center justify-end gap-1 mt-1">
                <span>Min:</span> 
                <span className="font-medium">{Math.round(data.main.temp_min)}°C</span>
              </div>
              <div className="text-sm opacity-75 flex items-center justify-end gap-1 mt-1">
                <span>Max:</span> 
                <span className="font-medium">{Math.round(data.main.temp_max)}°C</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mt-8">
          <div className="text-center bg-white/20 backdrop-blur-md rounded-lg p-2 transform transition-all hover:scale-110">
            <div className="flex justify-center">
              <Droplet className="h-5 w-5 text-primary/80 mr-1" />
            </div>
            <p className="text-xs uppercase opacity-70 mt-1">Humidity</p>
            <p className="font-medium">{data.main.humidity}%</p>
          </div>
          <div className="text-center bg-white/20 backdrop-blur-md rounded-lg p-2 transform transition-all hover:scale-110">
            <div className="flex justify-center">
              <Wind className="h-5 w-5 text-primary/80 mr-1" />
            </div>
            <p className="text-xs uppercase opacity-70 mt-1">Wind</p>
            <p className="font-medium">{Math.round(data.wind.speed)} m/s</p>
          </div>
          <div className="text-center bg-white/20 backdrop-blur-md rounded-lg p-2 transform transition-all hover:scale-110">
            <div className="flex justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary/80">
                <path d="M12 2v2"></path>
                <path d="M12 8v2"></path>
                <path d="M12 14v2"></path>
                <circle cx="12" cy="22" r="2"></circle>
                <path d="M12 18a4 4 0 0 0 0-8"></path>
              </svg>
            </div>
            <p className="text-xs uppercase opacity-70 mt-1">Pressure</p>
            <p className="font-medium">{data.main.pressure} hPa</p>
          </div>
        </div>
        
        <div className="mt-8 flex justify-between text-sm">
          <div className="flex items-center glass-card px-3 py-1">
            <Sunrise className="h-4 w-4 mr-1 text-weather-clear" />
            <span className="font-medium">{formatTime(data.sys.sunrise)}</span>
          </div>
          <div className="flex items-center glass-card px-3 py-1">
            <Sunset className="h-4 w-4 mr-1 text-weather-clear" />
            <span className="font-medium">{formatTime(data.sys.sunset)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;
