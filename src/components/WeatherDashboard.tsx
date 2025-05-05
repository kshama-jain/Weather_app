
import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import SearchBar from './SearchBar';
import CurrentWeather from './CurrentWeather';
import WeatherForecast from './WeatherForecast';
import WeatherDetails from './WeatherDetails';
import { getCurrentWeather, getForecastWeather } from '@/services/weatherService';
import type { CurrentWeather as CurrentWeatherType, ForecastWeather } from '@/services/weatherService';
import { CloudSun, Sparkles } from 'lucide-react';

const DEFAULT_CITY = 'London';

const WeatherDashboard: React.FC = () => {
  const [city, setCity] = useState<string>(DEFAULT_CITY);
  const [currentWeather, setCurrentWeather] = useState<CurrentWeatherType | null>(null);
  const [forecast, setForecast] = useState<ForecastWeather | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  const fetchWeatherData = async (cityName: string) => {
    setIsLoading(true);
    try {
      const [weatherData, forecastData] = await Promise.all([
        getCurrentWeather(cityName),
        getForecastWeather(cityName)
      ]);
      
      setCurrentWeather(weatherData);
      setForecast(forecastData);
      
      // Show success toast
      toast({
        title: "Weather Updated",
        description: `Latest weather data loaded for ${cityName}`,
        variant: "default",
      });
      
    } catch (error) {
      console.error("Error fetching weather data:", error);
      toast({
        title: "Error",
        description: `We couldn't find weather data for "${cityName}". Please try another city.`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData(city);
  }, [city]);

  const handleCitySelect = (selectedCity: string) => {
    setCity(selectedCity);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 relative">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="relative">
            <CloudSun className="h-12 w-12 text-primary animate-bounce" />
            <Sparkles className="h-6 w-6 text-yellow-400 absolute -top-1 -right-2 animate-pulse" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-gradient bg-gradient-to-r from-primary via-purple-500 to-weather-clear">
            Sky Whisperer
          </h1>
        </div>
        <p className="mt-1 text-lg font-medium italic bg-gradient-to-r from-primary to-weather-clear text-transparent bg-clip-text">
          Your Weather Adventure
        </p>
      </div>
      
      <SearchBar onCitySelect={handleCitySelect} />
      
      <div className="mt-8 space-y-8">
        <CurrentWeather data={currentWeather} isLoading={isLoading} />
        
        {currentWeather && <WeatherDetails data={currentWeather} />}
        
        <WeatherForecast forecast={forecast} isLoading={isLoading} />
      </div>
      
      <footer className="mt-16 text-center text-sm bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/10 glass-card">
        <p className="font-medium text-primary/80">Data provided by OpenMeteo API</p>
        <p className="mt-1">© {new Date().getFullYear()} Sky Whisperer - Your Weather Adventure</p>
      </footer>
    </div>
  );
};

export default WeatherDashboard;
