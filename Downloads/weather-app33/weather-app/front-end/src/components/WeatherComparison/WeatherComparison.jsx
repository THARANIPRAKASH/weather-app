import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Plus, 
  X, 
  Search, 
  MapPin, 
  Thermometer,
  Droplets,
  Wind,
  Eye,
  Gauge,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { weatherService } from '../../services/weatherService.js';
import toast from 'react-hot-toast';
import './WeatherComparison.scss';

const WeatherComparison = () => {
  const [locations, setLocations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [comparisonData, setComparisonData] = useState([]);

  useEffect(() => {
    if (locations.length > 0) {
      generateComparisonData();
    }
  }, [locations]);

  const searchLocations = async (query) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    const popularCities = [
      'London, UK', 'New York, US', 'Tokyo, JP', 'Paris, FR', 'Sydney, AU',
      'Berlin, DE', 'Mumbai, IN', 'Dubai, AE', 'Singapore, SG', 'Toronto, CA'
    ];

    const filtered = popularCities.filter(city => 
      city.toLowerCase().includes(query.toLowerCase())
    );

    setSearchResults(filtered);
  };

  const addLocation = async (cityName) => {
    if (locations.length >= 5) {
      toast.error('Maximum 5 locations allowed for comparison');
      return;
    }

    setLoading(true);
    try {
      const locationData = await weatherService.getLocationByCity(cityName.split(',')[0]);
      if (locationData) {
        const weatherData = await weatherService.getCurrentWeather(locationData.lat, locationData.lon);
        
        const newLocation = {
          id: Date.now(),
          name: weatherData.name,
          country: weatherData.sys.country,
          weather: weatherData,
          addedAt: new Date().toISOString()
        };

        setLocations([...locations, newLocation]);
        setSearchQuery('');
        setSearchResults([]);
        toast.success(`${weatherData.name} added to comparison`);
      }
    } catch (error) {
      toast.error('Failed to add location');
    } finally {
      setLoading(false);
    }
  };

  const removeLocation = (id) => {
    setLocations(locations.filter(loc => loc.id !== id));
  };

  const generateComparisonData = () => {
    const data = locations.map(location => ({
      name: `${location.name}, ${location.country}`,
      temperature: Math.round(location.weather.main.temp),
      humidity: location.weather.main.humidity,
      windSpeed: location.weather.wind.speed,
      pressure: location.weather.main.pressure,
      visibility: location.weather.visibility / 1000,
      feelsLike: Math.round(location.weather.main.feels_like)
    }));

    setComparisonData(data);
  };

  const getTemperatureComparison = () => {
    if (locations.length === 0) return { highest: null, lowest: null };
    
    const temps = locations.map(loc => ({
      name: loc.name,
      temp: loc.weather.main.temp
    }));

    const highest = temps.reduce((max, loc) => loc.temp > max.temp ? loc : max);
    const lowest = temps.reduce((min, loc) => loc.temp < min.temp ? loc : min);

    return { highest, lowest };
  };

  const tempComparison = getTemperatureComparison();

  return (
    <div className="weather-comparison">
      <div className="comparison-container">
        <motion.div 
          className="comparison-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="header-content">
            <div className="header-info">
              <h1>
                <BarChart3 size={32} />
                Weather Comparison
              </h1>
              <p>Compare weather conditions across multiple locations simultaneously</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="location-search"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="search-container">
            <div className="search-input-group">
              <Search className="search-icon" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  searchLocations(e.target.value);
                }}
                placeholder="Search for a city to compare..."
                className="search-input"
              />
              <button 
                className="add-current-btn"
                onClick={() => {
                  navigator.geolocation.getCurrentPosition(
                    async (position) => {
                      const { latitude, longitude } = position.coords;
                      const weatherData = await weatherService.getCurrentWeather(latitude, longitude);
                      const newLocation = {
                        id: Date.now(),
                        name: weatherData.name,
                        country: weatherData.sys.country,
                        weather: weatherData,
                        addedAt: new Date().toISOString()
                      };
                      setLocations([...locations, newLocation]);
                    },
                    () => toast.error('Unable to get current location')
                  );
                }}
              >
                <MapPin size={16} />
                Current Location
              </button>
            </div>

            {searchResults.length > 0 && (
              <div className="search-results">
                {searchResults.map((city, index) => (
                  <button
                    key={index}
                    className="search-result-item"
                    onClick={() => addLocation(city)}
                  >
                    <MapPin size={16} />
                    {city}
                  </button>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {locations.length > 0 && (
          <>
            <motion.div 
              className="comparison-overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="overview-stats">
                <div className="stat-card highest">
                  <div className="stat-icon">
                    <TrendingUp size={24} />
                  </div>
                  <div className="stat-content">
                    <h3>Highest Temperature</h3>
                    {tempComparison.highest && (
                      <>
                        <p className="stat-value">{Math.round(tempComparison.highest.temp)}°C</p>
                        <p className="stat-location">{tempComparison.highest.name}</p>
                      </>
                    )}
                  </div>
                </div>

                <div className="stat-card lowest">
                  <div className="stat-icon">
                    <TrendingDown size={24} />
                  </div>
                  <div className="stat-content">
                    <h3>Lowest Temperature</h3>
                    {tempComparison.lowest && (
                      <>
                        <p className="stat-value">{Math.round(tempComparison.lowest.temp)}°C</p>
                        <p className="stat-location">{tempComparison.lowest.name}</p>
                      </>
                    )}
                  </div>
                </div>

                <div className="stat-card total">
                  <div className="stat-icon">
                    <BarChart3 size={24} />
                  </div>
                  <div className="stat-content">
                    <h3>Locations Compared</h3>
                    <p className="stat-value">{locations.length}</p>
                    <p className="stat-location">of 5 maximum</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="location-cards"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <h2>Current Conditions</h2>
              <div className="cards-grid">
                {locations.map((location) => (
                  <div key={location.id} className="location-card">
                    <button 
                      className="remove-btn"
                      onClick={() => removeLocation(location.id)}
                    >
                      <X size={16} />
                    </button>

                    <div className="card-header">
                      <h3>{location.name}, {location.country}</h3>
                      <div className="weather-main">
                        <img 
                          src={`https://openweathermap.org/img/wn/${location.weather.weather[0].icon}@2x.png`}
                          alt={location.weather.weather[0].description}
                        />
                        <div className="temp-info">
                          <span className="temperature">{Math.round(location.weather.main.temp)}°C</span>
                          <span className="description">{location.weather.weather[0].description}</span>
                        </div>
                      </div>
                    </div>

                    <div className="card-details">
                      <div className="detail-item">
                        <Thermometer size={16} />
                        <span>Feels like {Math.round(location.weather.main.feels_like)}°C</span>
                      </div>
                      <div className="detail-item">
                        <Droplets size={16} />
                        <span>{location.weather.main.humidity}% humidity</span>
                      </div>
                      <div className="detail-item">
                        <Wind size={16} />
                        <span>{location.weather.wind.speed} m/s wind</span>
                      </div>
                      <div className="detail-item">
                        <Gauge size={16} />
                        <span>{location.weather.main.pressure} hPa</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div 
              className="comparison-charts"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <div className="charts-grid">
                <div className="chart-container">
                  <h3>Temperature Comparison</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={comparisonData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis 
                        dataKey="name" 
                        stroke="rgba(255,255,255,0.7)"
                        fontSize={12}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis stroke="rgba(255,255,255,0.7)" fontSize={12} />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'rgba(255,255,255,0.1)',
                          backdropFilter: 'blur(20px)',
                          border: '1px solid rgba(255,255,255,0.2)',
                          borderRadius: '12px',
                          color: '#fff'
                        }}
                      />
                      <Bar dataKey="temperature" fill="#4A90E2" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="chart-container">
                  <h3>Humidity Levels</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={comparisonData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis 
                        dataKey="name" 
                        stroke="rgba(255,255,255,0.7)"
                        fontSize={12}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis stroke="rgba(255,255,255,0.7)" fontSize={12} />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'rgba(255,255,255,0.1)',
                          backdropFilter: 'blur(20px)',
                          border: '1px solid rgba(255,255,255,0.2)',
                          borderRadius: '12px',
                          color: '#fff'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="humidity" 
                        stroke="#14B8A6" 
                        strokeWidth={3}
                        dot={{ fill: '#14B8A6', strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="chart-container">
                  <h3>Wind Speed</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={comparisonData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis 
                        dataKey="name" 
                        stroke="rgba(255,255,255,0.7)"
                        fontSize={12}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis stroke="rgba(255,255,255,0.7)" fontSize={12} />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'rgba(255,255,255,0.1)',
                          backdropFilter: 'blur(20px)',
                          border: '1px solid rgba(255,255,255,0.2)',
                          borderRadius: '12px',
                          color: '#fff'
                        }}
                      />
                      <Bar dataKey="windSpeed" fill="#F97316" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="chart-container">
                  <h3>Atmospheric Pressure</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={comparisonData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis 
                        dataKey="name" 
                        stroke="rgba(255,255,255,0.7)"
                        fontSize={12}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis stroke="rgba(255,255,255,0.7)" fontSize={12} />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'rgba(255,255,255,0.1)',
                          backdropFilter: 'blur(20px)',
                          border: '1px solid rgba(255,255,255,0.2)',
                          borderRadius: '12px',
                          color: '#fff'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="pressure" 
                        stroke="#9333EA" 
                        strokeWidth={3}
                        dot={{ fill: '#9333EA', strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>
          </>
        )}

        {locations.length === 0 && (
          <motion.div 
            className="empty-state"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <BarChart3 size={64} />
            <h3>No locations to compare</h3>
            <p>Add locations using the search bar above to start comparing weather conditions</p>
            <div className="quick-add-buttons">
              <button onClick={() => addLocation('London, UK')} className="quick-add-btn">
                Add London
              </button>
              <button onClick={() => addLocation('New York, US')} className="quick-add-btn">
                Add New York
              </button>
              <button onClick={() => addLocation('Tokyo, JP')} className="quick-add-btn">
                Add Tokyo
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default WeatherComparison;