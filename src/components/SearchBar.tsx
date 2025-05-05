
import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Compass } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { searchCities } from '@/services/weatherService';

interface SearchBarProps {
  onCitySelect: (city: string) => void;
}

interface CityResult {
  name: string;
  country: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onCitySelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [cityResults, setCityResults] = useState<CityResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Quick search cities
  const quickSearchCities = ['New York', 'London', 'Tokyo', 'Sydney', 'Berlin', 'Paris'];

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchCities = async () => {
      if (searchQuery.length < 3) {
        setCityResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const results = await searchCities(searchQuery);
        setCityResults(results);
        setIsDropdownOpen(results.length > 0);
      } catch (error) {
        console.error("Error searching cities:", error);
        toast({
          title: "Oops!",
          description: "Unable to search cities. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimeout = setTimeout(fetchCities, 500);
    return () => clearTimeout(debounceTimeout);
  }, [searchQuery, toast]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim().length > 0) {
      onCitySelect(searchQuery);
      setSearchQuery('');
      setIsDropdownOpen(false);
      
      // Show toast
      toast({
        title: "Searching",
        description: `Checking the weather in ${searchQuery}...`,
      });
    }
  };

  const handleCityClick = (cityName: string) => {
    onCitySelect(cityName);
    setSearchQuery('');
    setIsDropdownOpen(false);
    
    // Show toast
    toast({
      title: "Loading",
      description: `Getting weather for ${cityName}...`,
    });
  };
  
  const handleQuickSearch = (city: string) => {
    onCitySelect(city);
    setSearchQuery('');
    setIsDropdownOpen(false);
    
    toast({
      title: "Quick Search",
      description: `Loading weather for ${city}...`,
    });
  };

  return (
    <div className="relative w-full max-w-md mx-auto" ref={dropdownRef}>
      <div className="flex flex-wrap justify-center gap-2 mb-3">
        {quickSearchCities.map((city) => (
          <button
            key={city}
            onClick={() => handleQuickSearch(city)}
            className="px-3 py-1 text-xs bg-white/40 hover:bg-white/60 backdrop-blur-md rounded-full border border-primary/20 transition-colors flex items-center gap-1"
          >
            <Compass className="h-3 w-3" />
            {city}
          </button>
        ))}
      </div>
      
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Where to? Type a city name..."
            className="pl-10 pr-24 py-3 rounded-full border-0 focus:ring-2 focus:ring-primary shadow-lg bg-white/70 backdrop-blur-md"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary" />
          <Button
            type="submit"
            size="sm"
            className="absolute right-1.5 top-1/2 transform -translate-y-1/2 h-8 px-3 rounded-full bg-gradient-to-r from-primary to-weather-clear hover:from-primary/80 hover:to-weather-clear/80"
            disabled={isLoading}
          >
            {isLoading ? "..." : "Search"}
          </Button>
        </div>
      </form>

      {isDropdownOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white/80 backdrop-blur-md border border-primary/20 shadow-lg rounded-lg overflow-hidden">
          {cityResults.map((city, index) => (
            <button
              key={`${city.name}-${city.country}-${index}`}
              className="flex items-center w-full p-3 hover:bg-primary/10 text-left text-sm transition-colors"
              onClick={() => handleCityClick(city.name)}
            >
              <MapPin className="h-4 w-4 mr-2 text-primary" />
              <span>
                {city.name}, <span className="text-gray-500">{city.country}</span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
