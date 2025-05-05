
// Format date from timestamp
export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
};

// Format time from timestamp
export const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

// Get weather background based on weather condition
export const getWeatherBackground = (condition: string): string => {
  switch (condition.toLowerCase()) {
    case 'clear':
      return 'bg-gradient-to-br from-yellow-200 to-weather-clear';
    case 'clouds':
      return 'bg-gradient-to-br from-gray-100 to-weather-cloudy';
    case 'rain':
    case 'drizzle':
      return 'bg-gradient-to-br from-blue-100 to-weather-rain';
    case 'thunderstorm':
      return 'bg-gradient-to-br from-gray-700 to-weather-thunderstorm';
    case 'snow':
      return 'bg-gradient-to-br from-blue-50 to-weather-snow';
    case 'mist':
    case 'fog':
    case 'haze':
      return 'bg-gradient-to-br from-gray-200 to-weather-mist';
    default:
      return 'bg-gradient-to-br from-blue-100 to-blue-300';
  }
};

// Group forecast data by day
export const groupForecastByDay = (forecastList: any[]) => {
  const groupedData = forecastList.reduce((acc, item) => {
    const date = new Date(item.dt * 1000).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(item);
    return acc;
  }, {});

  // Get the middle entry for each day (or closest to noon)
  return Object.keys(groupedData).map(date => {
    const midIndex = Math.floor(groupedData[date].length / 2);
    return groupedData[date][midIndex];
  }).slice(0, 5); // Limit to 5 days
};

// Convert temperature from Celsius to Fahrenheit
export const celsiusToFahrenheit = (celsius: number): number => {
  return (celsius * 9/5) + 32;
};

// Get appropriate icon based on weather condition
export const getWeatherIcon = (condition: string): string => {
  switch (condition.toLowerCase()) {
    case 'clear':
      return 'sun';
    case 'clouds':
      return 'cloud';
    case 'rain':
    case 'drizzle':
      return 'cloud-rain';
    case 'thunderstorm':
      return 'cloud-lightning';
    case 'snow':
      return 'cloud-snow';
    case 'mist':
    case 'fog':
    case 'haze':
      return 'cloud-fog';
    default:
      return 'cloud';
  }
};

// Get readable description of wind direction
export const getWindDirection = (degrees: number): string => {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
};
