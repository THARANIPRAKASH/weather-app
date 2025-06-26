import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import React from 'react';
import { 
  Radar, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward,
  Settings,
  Layers,
  MapPin,
  Clock,
  Zap,
  CloudRain,
  Wind,
  Thermometer
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useWeather } from '../../contexts/WeatherContext.jsx';
import './WeatherRadar.scss';

const WeatherRadar = ({ isDarkMode }) => {
  const { location, currentWeather } = useWeather();
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [activeLayer, setActiveLayer] = useState('precipitation');
  const [timeRange, setTimeRange] = useState(3);
  const [radarData, setRadarData] = useState(null);

  const totalFrames = timeRange * 4; // 4 frames per hour

  useEffect(() => {
    initializeMap();
    generateRadarData();
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isDarkMode]);

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentFrame(prev => (prev + 1) % totalFrames);
      }, 1000 / animationSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, animationSpeed, totalFrames]);

  const initializeMap = () => {
    if (!mapRef.current || mapInstanceRef.current) return;

    mapInstanceRef.current = L.map(mapRef.current).setView([location.lat, location.lng], 8);

    const tileLayer = isDarkMode 
      ? L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
          attribution: '© OpenStreetMap contributors © CARTO',
          subdomains: 'abcd',
          maxZoom: 19
        })
      : L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19
        });

    tileLayer.addTo(mapInstanceRef.current);

    // Add location marker
    const customIcon = L.divIcon({
      html: `
        <div class="radar-marker">
          <div class="marker-pulse"></div>
          <div class="marker-center"></div>
        </div>
      `,
      className: 'custom-radar-marker',
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    });

    L.marker([location.lat, location.lng], { icon: customIcon })
      .addTo(mapInstanceRef.current)
      .bindPopup(`
        <div class="radar-popup">
          <h4>${currentWeather?.name || 'Current Location'}</h4>
          <p>Radar Center</p>
        </div>
      `);
  };

  const generateRadarData = () => {
    // Mock radar data generation
    const data = {
      precipitation: Array.from({ length: totalFrames }, (_, i) => ({
        intensity: Math.random() * 100,
        coverage: Math.random() * 80 + 20,
        timestamp: new Date(Date.now() - (totalFrames - i) * 15 * 60 * 1000)
      })),
      temperature: Array.from({ length: totalFrames }, (_, i) => ({
        value: 20 + Math.sin(i / 4) * 10 + Math.random() * 5,
        timestamp: new Date(Date.now() - (totalFrames - i) * 15 * 60 * 1000)
      })),
      wind: Array.from({ length: totalFrames }, (_, i) => ({
        speed: Math.random() * 30 + 5,
        direction: (i * 15 + Math.random() * 30) % 360,
        timestamp: new Date(Date.now() - (totalFrames - i) * 15 * 60 * 1000)
      }))
    };

    setRadarData(data);
  };

  const weatherLayers = [
    {
      id: 'precipitation',
      name: 'Precipitation',
      icon: CloudRain,
      description: 'Rain and snow intensity',
      color: '#4A90E2'
    },
    {
      id: 'temperature',
      name: 'Temperature',
      icon: Thermometer,
      description: 'Surface temperature',
      color: '#F97316'
    },
    {
      id: 'wind',
      name: 'Wind',
      icon: Wind,
      description: 'Wind speed and direction',
      color: '#14B8A6'
    },
    {
      id: 'lightning',
      name: 'Lightning',
      icon: Zap,
      description: 'Lightning strikes',
      color: '#EAB308'
    }
  ];

  const speedOptions = [
    { value: 0.5, label: 'Slow' },
    { value: 1, label: 'Normal' },
    { value: 2, label: 'Fast' },
    { value: 4, label: 'Turbo' }
  ];

  const timeRangeOptions = [
    { value: 1, label: '1 Hour' },
    { value: 3, label: '3 Hours' },
    { value: 6, label: '6 Hours' },
    { value: 12, label: '12 Hours' }
  ];

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  const skipToFrame = (frameIndex) => {
    setCurrentFrame(frameIndex);
  };

  const getCurrentFrameData = () => {
    if (!radarData || !radarData[activeLayer]) return null;
    return radarData[activeLayer][currentFrame];
  };

  const getCurrentTime = () => {
    if (!radarData || !radarData[activeLayer]) return new Date();
    return radarData[activeLayer][currentFrame]?.timestamp || new Date();
  };

  const frameData = getCurrentFrameData();

  return (
    <div className="weather-radar">
      <div className="radar-container">
        <motion.div 
          className="radar-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="header-content">
            <div className="header-info">
              <h1>
                <Radar size={32} />
                Weather Radar
              </h1>
              <p>Real-time weather radar with interactive timeline controls</p>
            </div>
            
            <div className="location-info">
              <MapPin size={16} />
              <span>{currentWeather?.name || 'Current Location'}</span>
            </div>
          </div>
        </motion.div>

        <div className="radar-content">
          <motion.div 
            className="radar-controls"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="control-section">
              <h3>
                <Layers size={18} />
                Weather Layers
              </h3>
              <div className="layer-buttons">
                {weatherLayers.map((layer) => {
                  const IconComponent = layer.icon;
                  return (
                    <button
                      key={layer.id}
                      className={`layer-btn ${activeLayer === layer.id ? 'active' : ''}`}
                      onClick={() => setActiveLayer(layer.id)}
                      style={{ '--layer-color': layer.color }}
                    >
                      <IconComponent size={16} />
                      <span>{layer.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="control-section">
              <h3>
                <Settings size={18} />
                Animation Settings
              </h3>
              
              <div className="setting-group">
                <label>Speed</label>
                <div className="speed-buttons">
                  {speedOptions.map((option) => (
                    <button
                      key={option.value}
                      className={`speed-btn ${animationSpeed === option.value ? 'active' : ''}`}
                      onClick={() => setAnimationSpeed(option.value)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="setting-group">
                <label>Time Range</label>
                <select 
                  value={timeRange}
                  onChange={(e) => setTimeRange(Number(e.target.value))}
                  className="time-select"
                >
                  {timeRangeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {frameData && (
              <div className="control-section">
                <h3>
                  <Clock size={18} />
                  Current Conditions
                </h3>
                <div className="current-data">
                  {activeLayer === 'precipitation' && (
                    <>
                      <div className="data-item">
                        <span className="data-label">Intensity:</span>
                        <span className="data-value">{frameData.intensity?.toFixed(1)}%</span>
                      </div>
                      <div className="data-item">
                        <span className="data-label">Coverage:</span>
                        <span className="data-value">{frameData.coverage?.toFixed(1)}%</span>
                      </div>
                    </>
                  )}
                  {activeLayer === 'temperature' && (
                    <div className="data-item">
                      <span className="data-label">Temperature:</span>
                      <span className="data-value">{frameData.value?.toFixed(1)}°C</span>
                    </div>
                  )}
                  {activeLayer === 'wind' && (
                    <>
                      <div className="data-item">
                        <span className="data-label">Speed:</span>
                        <span className="data-value">{frameData.speed?.toFixed(1)} m/s</span>
                      </div>
                      <div className="data-item">
                        <span className="data-label">Direction:</span>
                        <span className="data-value">{frameData.direction?.toFixed(0)}°</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </motion.div>

          <motion.div 
            className="radar-map-container"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div ref={mapRef} className="radar-map"></div>
            
            <div className="radar-overlay">
              <div className="current-time">
                <Clock size={16} />
                <span>{getCurrentTime().toLocaleTimeString()}</span>
              </div>
              
              <div className="layer-info">
                <div className="layer-indicator" style={{ backgroundColor: weatherLayers.find(l => l.id === activeLayer)?.color }}>
                  {React.createElement(weatherLayers.find(l => l.id === activeLayer)?.icon, { size: 16 })}
                </div>
                <span>{weatherLayers.find(l => l.id === activeLayer)?.name}</span>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div 
          className="timeline-controls"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="playback-controls">
            <button 
              className="control-btn"
              onClick={() => skipToFrame(0)}
            >
              <SkipBack size={20} />
            </button>
            
            <button 
              className="control-btn play-btn"
              onClick={togglePlayback}
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>
            
            <button 
              className="control-btn"
              onClick={() => skipToFrame(totalFrames - 1)}
            >
              <SkipForward size={20} />
            </button>
          </div>

          <div className="timeline-slider">
            <input
              type="range"
              min="0"
              max={totalFrames - 1}
              value={currentFrame}
              onChange={(e) => skipToFrame(Number(e.target.value))}
              className="timeline-input"
            />
            <div className="timeline-labels">
              <span>{timeRange} hours ago</span>
              <span>Now</span>
            </div>
          </div>

          <div className="frame-info">
            <span>Frame {currentFrame + 1} of {totalFrames}</span>
          </div>
        </motion.div>

        <motion.div 
          className="radar-features"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <Play size={24} />
              </div>
              <h3>Timeline Animation</h3>
              <p>Watch weather patterns evolve over time with smooth animation controls</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <Layers size={24} />
              </div>
              <h3>Multiple Layers</h3>
              <p>Switch between precipitation, temperature, wind, and lightning data</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <Settings size={24} />
              </div>
              <h3>Customizable</h3>
              <p>Adjust animation speed and time range to suit your needs</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <MapPin size={24} />
              </div>
              <h3>Location Focused</h3>
              <p>Centered on your location with detailed local weather data</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default WeatherRadar;