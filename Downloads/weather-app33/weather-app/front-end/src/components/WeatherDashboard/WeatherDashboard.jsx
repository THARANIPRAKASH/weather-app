import { useState, useEffect } from 'react';
import SearchBar from '../SearchBar/SearchBar.jsx';
import CurrentWeather from '../CurrentWeather/CurrentWeather.jsx';
import WeatherForecast from '../WeatherForecast/WeatherForecast.jsx';
import WeatherMap from '../WeatherMap/WeatherMap.jsx';
import WeatherAlerts from '../WeatherAlerts/WeatherAlerts.jsx';
import { weatherService } from '../../services/weatherService.js';
import './WeatherDashboard.scss';

const WeatherDashboard = ({ isDarkMode }) => {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [location, setLocation] = useState({ lat: 51.505, lng: -0.09 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
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
          // Default to London
          fetchWeatherData(51.505, -0.09);
        }
      );
    } else {
      // Default to London
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
    } catch (err) {
      setError('Failed to fetch weather data. Please try again.');
      console.error('Weather fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSearch = async (city) => {
    try {
      const locationData = await weatherService.getLocationByCity(city);
      if (locationData) {
        fetchWeatherData(locationData.lat, locationData.lon);
      }
    } catch (err) {
      setError('City not found. Please try again.');
    }
  };

  return (
    <div className="weather-dashboard">
      <div className="dashboard-container">
        <SearchBar onSearch={handleLocationSearch} />
        
        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}

        {loading ? (
          <div className="loading-content">
            <div className="spinner"></div>
            <p>Loading weather data...</p>
          </div>
        ) : (
          <>
            <div className="weather-grid">
              <div className="current-section" id="current">
                {currentWeather && (
                  <CurrentWeather data={currentWeather} />
                )}
              </div>

              <div className="forecast-section" id="forecast">
                {forecast && (
                  <WeatherForecast data={forecast} />
                )}
              </div>
            </div>

            <div className="map-section" id="map">
              <WeatherMap 
                location={location} 
                isDarkMode={isDarkMode}
                weatherData={currentWeather}
              />
            </div>

            <div className="alerts-section" id="alerts">
              {currentWeather && (
                <WeatherAlerts weatherData={currentWeather} />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WeatherDashboard;