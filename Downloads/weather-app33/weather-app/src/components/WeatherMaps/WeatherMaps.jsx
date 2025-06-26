import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Map, 
  Layers, 
  Cloud, 
  CloudRain, 
  Wind, 
  Thermometer,
  Eye,
  Zap,
  Sun
} from 'lucide-react';
import WeatherMap from '../WeatherMap/WeatherMap.jsx';
import { useWeather } from '../../contexts/WeatherContext.jsx';
import './WeatherMaps.scss';

const WeatherMaps = ({ isDarkMode }) => {
  const [activeLayer, setActiveLayer] = useState('clouds');
  const [mapType, setMapType] = useState('standard');
  const { location, currentWeather } = useWeather();

  const mapLayers = [
    {
      id: 'clouds',
      name: 'Clouds',
      icon: Cloud,
      description: 'Cloud coverage',
      color: '#87CEEB'
    },
    {
      id: 'precipitation',
      name: 'Precipitation',
      icon: CloudRain,
      description: 'Rain and snow',
      color: '#4169E1'
    },
    {
      id: 'wind',
      name: 'Wind Speed',
      icon: Wind,
      description: 'Wind patterns',
      color: '#32CD32'
    },
    {
      id: 'temp',
      name: 'Temperature',
      icon: Thermometer,
      description: 'Temperature map',
      color: '#FF6347'
    },
    {
      id: 'pressure',
      name: 'Pressure',
      icon: Eye,
      description: 'Atmospheric pressure',
      color: '#9370DB'
    }
  ];

  const mapTypes = [
    { id: 'standard', name: 'Standard', description: 'Default map view' },
    { id: 'satellite', name: 'Satellite', description: 'Satellite imagery' },
    { id: 'terrain', name: 'Terrain', description: 'Topographic view' }
  ];

  return (
    <div className="weather-maps">
      <div className="maps-container">
        <motion.div 
          className="maps-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="header-content">
            <div className="header-info">
              <h1>
                <Map size={32} />
                Weather Maps
              </h1>
              <p>Interactive weather visualization with multiple data layers</p>
            </div>
            
            <div className="map-controls">
              <div className="control-group">
                <label>Map Type</label>
                <div className="control-buttons">
                  {mapTypes.map((type) => (
                    <button
                      key={type.id}
                      className={`control-btn ${mapType === type.id ? 'active' : ''}`}
                      onClick={() => setMapType(type.id)}
                    >
                      {type.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="maps-content">
          <motion.div 
            className="layer-controls"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3>
              <Layers size={20} />
              Weather Layers
            </h3>
            
            <div className="layer-list">
              {mapLayers.map((layer) => {
                const IconComponent = layer.icon;
                return (
                  <button
                    key={layer.id}
                    className={`layer-item ${activeLayer === layer.id ? 'active' : ''}`}
                    onClick={() => setActiveLayer(layer.id)}
                  >
                    <div className="layer-icon" style={{ color: layer.color }}>
                      <IconComponent size={20} />
                    </div>
                    <div className="layer-info">
                      <h4>{layer.name}</h4>
                      <p>{layer.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="layer-legend">
              <h4>Legend</h4>
              <div className="legend-items">
                {activeLayer === 'clouds' && (
                  <div className="legend-item">
                    <div className="legend-color" style={{ background: 'rgba(255, 255, 255, 0.8)' }}></div>
                    <span>Cloud Coverage</span>
                  </div>
                )}
                {activeLayer === 'precipitation' && (
                  <>
                    <div className="legend-item">
                      <div className="legend-color" style={{ background: '#87CEEB' }}></div>
                      <span>Light Rain</span>
                    </div>
                    <div className="legend-item">
                      <div className="legend-color" style={{ background: '#4169E1' }}></div>
                      <span>Heavy Rain</span>
                    </div>
                  </>
                )}
                {activeLayer === 'wind' && (
                  <>
                    <div className="legend-item">
                      <div className="legend-color" style={{ background: '#90EE90' }}></div>
                      <span>Light Wind</span>
                    </div>
                    <div className="legend-item">
                      <div className="legend-color" style={{ background: '#32CD32' }}></div>
                      <span>Strong Wind</span>
                    </div>
                  </>
                )}
                {activeLayer === 'temp' && (
                  <>
                    <div className="legend-item">
                      <div className="legend-color" style={{ background: '#87CEEB' }}></div>
                      <span>Cold</span>
                    </div>
                    <div className="legend-item">
                      <div className="legend-color" style={{ background: '#FFD700' }}></div>
                      <span>Warm</span>
                    </div>
                    <div className="legend-item">
                      <div className="legend-color" style={{ background: '#FF6347' }}></div>
                      <span>Hot</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="map-container"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <WeatherMap 
              location={location}
              isDarkMode={isDarkMode}
              weatherData={currentWeather}
              activeLayer={activeLayer}
              mapType={mapType}
            />
            
            <div className="map-overlay-info">
              {currentWeather && (
                <div className="current-location-info">
                  <h4>{currentWeather.name}, {currentWeather.sys.country}</h4>
                  <div className="weather-summary">
                    <img 
                      src={`https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png`}
                      alt={currentWeather.weather[0].description}
                    />
                    <div>
                      <span className="temp">{Math.round(currentWeather.main.temp)}°C</span>
                      <span className="desc">{currentWeather.weather[0].description}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        <motion.div 
          className="maps-features"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <Cloud size={24} />
              </div>
              <h3>Real-time Data</h3>
              <p>Live weather data updated every 10 minutes from global weather stations</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <Layers size={24} />
              </div>
              <h3>Multiple Layers</h3>
              <p>Overlay different weather parameters to get comprehensive insights</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <Zap size={24} />
              </div>
              <h3>Interactive</h3>
              <p>Click anywhere on the map to get detailed weather information</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <Sun size={24} />
              </div>
              <h3>Global Coverage</h3>
              <p>Weather data available for any location worldwide</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default WeatherMaps;