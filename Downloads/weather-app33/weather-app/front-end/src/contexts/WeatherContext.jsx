import { createContext, useContext, useState, useEffect } from 'react';
import { weatherService } from '../services/weatherService.js';

const WeatherContext = createContext();

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
};

export const WeatherProvider = ({ children }) => {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [location, setLocation] = useState({ lat: 51.505, lng: -0.09 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [weatherHistory, setWeatherHistory] = useState([]);

  useEffect(() => {
    // Load saved data
    const savedFavorites = localStorage.getItem('weatherFavorites');
    const savedSearches = localStorage.getItem('recentSearches');
    const savedHistory = localStorage.getItem('weatherHistory');
    
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
    if (savedSearches) setRecentSearches(JSON.parse(savedSearches));
    if (savedHistory) setWeatherHistory(JSON.parse(savedHistory));
    
    getCurrentLocation();
  }, []);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });
          fetchWeatherData(latitude, longitude);
        },
        (error) => {
          console.log('Geolocation error:', error);
          fetchWeatherData(51.505, -0.09);
        }
      );
    } else {
      fetchWeatherData(51.505, -0.09);
    }
  };

  const fetchWeatherData = async (lat, lng) => {
    setLoading(true);
    setError(null);
    
    try {
      const [currentData, forecastData] = await Promise.all([
        weatherService.getCurrentWeather(lat, lng),
        weatherService.getForecast(lat, lng)
      ]);
      
      setCurrentWeather(currentData);
      setForecast(forecastData);
      setLocation({ lat, lng });
      
      // Add to history
      const historyEntry = {
        id: Date.now(),
        location: currentData.name,
        country: currentData.sys.country,
        weather: currentData.weather[0],
        temp: currentData.main.temp,
        timestamp: new Date().toISOString()
      };
      
      const updatedHistory = [historyEntry, ...weatherHistory.slice(0, 49)];
      setWeatherHistory(updatedHistory);
      localStorage.setItem('weatherHistory', JSON.stringify(updatedHistory));
      
    } catch (err) {
      setError('Failed to fetch weather data. Please try again.');
      console.error('Weather fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const searchLocation = async (city) => {
    try {
      const locationData = await weatherService.getLocationByCity(city);
      if (locationData) {
        fetchWeatherData(locationData.lat, locationData.lon);
        
        // Add to recent searches
        const searchEntry = {
          id: Date.now(),
          city,
          timestamp: new Date().toISOString()
        };
        
        const updatedSearches = [searchEntry, ...recentSearches.filter(s => s.city !== city).slice(0, 9)];
        setRecentSearches(updatedSearches);
        localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
      }
    } catch (err) {
      setError('City not found. Please try again.');
    }
  };

  const addToFavorites = (weatherData) => {
    const favorite = {
      id: Date.now(),
      name: weatherData.name,
      country: weatherData.sys.country,
      lat: weatherData.coord.lat,
      lng: weatherData.coord.lon,
      addedAt: new Date().toISOString()
    };
    
    const updatedFavorites = [favorite, ...favorites.filter(f => f.name !== weatherData.name)];
    setFavorites(updatedFavorites);
    localStorage.setItem('weatherFavorites', JSON.stringify(updatedFavorites));
  };

  const removeFromFavorites = (locationName) => {
    const updatedFavorites = favorites.filter(f => f.name !== locationName);
    setFavorites(updatedFavorites);
    localStorage.setItem('weatherFavorites', JSON.stringify(updatedFavorites));
  };

  const value = {
    currentWeather,
    forecast,
    location,
    loading,
    error,
    favorites,
    recentSearches,
    weatherHistory,
    fetchWeatherData,
    searchLocation,
    addToFavorites,
    removeFromFavorites,
    getCurrentLocation
  };

  return (
    <WeatherContext.Provider value={value}>
      {children}
    </WeatherContext.Provider>
  );
};