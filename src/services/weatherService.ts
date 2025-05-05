
// OpenMeteo API endpoints
const BASE_URL = "https://api.open-meteo.com/v1";
const GEO_BASE_URL = "https://geocoding-api.open-meteo.com/v1";

// Interface for Current Weather Data
export interface CurrentWeather {
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
    pressure: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  wind: {
    speed: number;
    deg: number;
  };
  name: string;
  dt: number;
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  visibility: number;
}

// Interface for Forecast Weather Data
export interface ForecastWeather {
  list: {
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      temp_min: number;
      temp_max: number;
      humidity: number;
    };
    weather: {
      id: number;
      main: string;
      description: string;
      icon: string;
    }[];
    dt_txt: string;
  }[];
  city: {
    name: string;
    country: string;
  };
}

// Interface for OpenMeteo Geocoding
interface GeocodingResult {
  results?: {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    country: string;
    admin1?: string;
    admin2?: string;
  }[];
}

// Convert OpenMeteo data to our CurrentWeather format
const convertToCurrentWeather = (data: any, cityName: string, countryCode: string): CurrentWeather => {
  // Generate a weather condition based on weather code
  const weatherCode = data.current.weather_code;
  const weatherCondition = getWeatherCondition(weatherCode);

  // Map weather codes to ids similar to OpenWeatherMap
  const weatherId = weatherCode < 3 ? 800 : // clear/fair
                     weatherCode < 50 ? 700 : // fog
                     weatherCode < 70 ? 600 : // snow
                     weatherCode < 80 ? 300 : // drizzle
                     weatherCode < 100 ? 500 : 800; // rain or default
  
  // Get icon based on is_day and weather code
  const isDay = data.current.is_day;
  const icon = getWeatherIconCode(weatherCode, isDay);
  
  return {
    main: {
      temp: data.current.temperature_2m,
      feels_like: data.current.apparent_temperature,
      temp_min: data.daily.temperature_2m_min[0],
      temp_max: data.daily.temperature_2m_max[0],
      humidity: data.current.relative_humidity_2m,
      pressure: data.current.surface_pressure,
    },
    weather: [{
      id: weatherId,
      main: weatherCondition,
      description: weatherCondition.toLowerCase(),
      icon: icon,
    }],
    wind: {
      speed: data.current.wind_speed_10m,
      deg: data.current.wind_direction_10m,
    },
    name: cityName,
    dt: Math.floor(new Date(data.current.time).getTime() / 1000),
    sys: {
      country: countryCode,
      sunrise: Math.floor(new Date(data.daily.sunrise[0]).getTime() / 1000),
      sunset: Math.floor(new Date(data.daily.sunset[0]).getTime() / 1000),
    },
    visibility: data.current.visibility || 10000, // Some APIs might not have visibility
  };
};

// Convert OpenMeteo data to our ForecastWeather format
const convertToForecastWeather = (data: any, cityName: string, countryCode: string): ForecastWeather => {
  const forecastList = [];
  
  // Create forecast entries for each day
  for (let i = 0; i < 5; i++) {
    if (i < data.daily.time.length) {
      const time = data.daily.time[i];
      const weatherCode = data.daily.weather_code[i];
      const weatherCondition = getWeatherCondition(weatherCode);
      const icon = getWeatherIconCode(weatherCode, true); // We assume day for forecasts
      
      forecastList.push({
        dt: Math.floor(new Date(time).getTime() / 1000),
        main: {
          temp: (data.daily.temperature_2m_min[i] + data.daily.temperature_2m_max[i]) / 2, // average temp
          feels_like: (data.daily.apparent_temperature_min[i] + data.daily.apparent_temperature_max[i]) / 2,
          temp_min: data.daily.temperature_2m_min[i],
          temp_max: data.daily.temperature_2m_max[i],
          humidity: data.daily.relative_humidity_2m_max[i],
        },
        weather: [{
          id: weatherCode,
          main: weatherCondition,
          description: weatherCondition.toLowerCase(),
          icon: icon,
        }],
        dt_txt: new Date(time).toISOString(),
      });
    }
  }
  
  return {
    list: forecastList,
    city: {
      name: cityName,
      country: countryCode,
    }
  };
};

// Map OpenMeteo weather codes to conditions
const getWeatherCondition = (code: number): string => {
  if (code === 0) return "Clear";
  if (code === 1) return "Mainly Clear";
  if (code === 2) return "Partly Cloudy";
  if (code === 3) return "Cloudy";
  if (code <= 49) return "Fog";
  if (code <= 59) return "Drizzle";
  if (code <= 69) return "Rain";
  if (code <= 79) return "Snow";
  if (code <= 99) return "Thunderstorm";
  return "Clear";
};

// Map weather codes to icon codes similar to OpenWeatherMap
const getWeatherIconCode = (code: number, isDay: number | boolean): string => {
  const dayPrefix = isDay ? "01" : "02";
  
  if (code === 0) return `${dayPrefix}d`; // clear sky
  if (code <= 3) return `${parseInt(dayPrefix) + code}d`; // few clouds to scattered clouds
  if (code <= 49) return "50d"; // mist
  if (code <= 59) return "09d"; // rain
  if (code <= 69) return "10d"; // rain
  if (code <= 79) return "13d"; // snow
  if (code <= 99) return "11d"; // thunderstorm
  return "01d"; // default
};

// Get city coordinates from name
const getCityCoordinates = async (city: string): Promise<{latitude: number, longitude: number, name: string, country: string}> => {
  try {
    const response = await fetch(
      `${GEO_BASE_URL}/search?name=${encodeURIComponent(city)}&count=1`
    );
    
    if (!response.ok) {
      throw new Error("Geocoding failed");
    }
    
    const data: GeocodingResult = await response.json();
    
    if (!data.results || data.results.length === 0) {
      throw new Error("City not found");
    }
    
    const result = data.results[0];
    return {
      latitude: result.latitude,
      longitude: result.longitude,
      name: result.name,
      country: result.country,
    };
  } catch (error) {
    console.error("Error in geocoding:", error);
    throw error;
  }
};

// Get current weather data by city name
export const getCurrentWeather = async (city: string): Promise<CurrentWeather> => {
  try {
    // First get coordinates
    const { latitude, longitude, name, country } = await getCityCoordinates(city);
    
    // Then fetch weather data
    const response = await fetch(
      `${BASE_URL}/forecast?latitude=${latitude}&longitude=${longitude}` +
      `&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m,visibility` +
      `&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,relative_humidity_2m_max` +
      `&timezone=auto&forecast_days=1`
    );
    
    if (!response.ok) {
      throw new Error("Weather data not found");
    }
    
    const data = await response.json();
    return convertToCurrentWeather(data, name, country);
  } catch (error) {
    console.error("Error fetching current weather:", error);
    throw error;
  }
};

// Get 5-day forecast by city name
export const getForecastWeather = async (city: string): Promise<ForecastWeather> => {
  try {
    // First get coordinates
    const { latitude, longitude, name, country } = await getCityCoordinates(city);
    
    // Then fetch weather data
    const response = await fetch(
      `${BASE_URL}/forecast?latitude=${latitude}&longitude=${longitude}` +
      `&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,relative_humidity_2m_max` +
      `&timezone=auto&forecast_days=5`
    );
    
    if (!response.ok) {
      throw new Error("Forecast data not found");
    }
    
    const data = await response.json();
    return convertToForecastWeather(data, name, country);
  } catch (error) {
    console.error("Error fetching forecast:", error);
    throw error;
  }
};

// Search cities by query (for autocomplete)
export const searchCities = async (query: string) => {
  try {
    const response = await fetch(
      `${GEO_BASE_URL}/search?name=${encodeURIComponent(query)}&count=5`
    );
    
    if (!response.ok) {
      throw new Error("City search failed");
    }
    
    const data: GeocodingResult = await response.json();
    
    if (!data.results) {
      return [];
    }
    
    return data.results.map(city => ({
      name: city.name,
      country: city.country,
    }));
  } catch (error) {
    console.error("Error searching cities:", error);
    throw error;
  }
};
