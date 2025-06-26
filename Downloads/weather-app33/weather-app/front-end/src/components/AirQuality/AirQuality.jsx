import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Wind, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Info,
  Thermometer,
  Droplets,
  Eye,
  Activity,
  TrendingUp,
  TrendingDown,
  MapPin
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useWeather } from '../../contexts/WeatherContext.jsx';
import './AirQuality.scss';

const AirQuality = () => {
  const { location, currentWeather } = useWeather();
  const [airQualityData, setAirQualityData] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [pollutantData, setPollutantData] = useState([]);

  useEffect(() => {
    generateAirQualityData();
    generateHistoricalData();
    generatePollutantData();
  }, [location]);

  const generateAirQualityData = () => {
    // Mock air quality data
    const aqi = Math.floor(Math.random() * 200) + 1;
    const data = {
      aqi,
      category: getAQICategory(aqi),
      color: getAQIColor(aqi),
      pollutants: {
        pm25: Math.floor(Math.random() * 50) + 5,
        pm10: Math.floor(Math.random() * 80) + 10,
        o3: Math.floor(Math.random() * 150) + 20,
        no2: Math.floor(Math.random() * 100) + 10,
        so2: Math.floor(Math.random() * 50) + 5,
        co: Math.floor(Math.random() * 10) + 1
      },
      recommendations: getRecommendations(aqi),
      healthEffects: getHealthEffects(aqi),
      lastUpdated: new Date().toISOString()
    };

    setAirQualityData(data);
  };

  const generateHistoricalData = () => {
    const data = Array.from({ length: 24 }, (_, i) => ({
      time: `${23 - i}:00`,
      aqi: Math.floor(Math.random() * 150) + 20,
      pm25: Math.floor(Math.random() * 40) + 5,
      pm10: Math.floor(Math.random() * 60) + 10
    })).reverse();

    setHistoricalData(data);
  };

  const generatePollutantData = () => {
    const pollutants = [
      { name: 'PM2.5', value: Math.floor(Math.random() * 50) + 5, unit: 'μg/m³', limit: 25 },
      { name: 'PM10', value: Math.floor(Math.random() * 80) + 10, unit: 'μg/m³', limit: 50 },
      { name: 'O₃', value: Math.floor(Math.random() * 150) + 20, unit: 'μg/m³', limit: 100 },
      { name: 'NO₂', value: Math.floor(Math.random() * 100) + 10, unit: 'μg/m³', limit: 40 },
      { name: 'SO₂', value: Math.floor(Math.random() * 50) + 5, unit: 'μg/m³', limit: 20 },
      { name: 'CO', value: Math.floor(Math.random() * 10) + 1, unit: 'mg/m³', limit: 10 }
    ];

    setPollutantData(pollutants);
  };

  const getAQICategory = (aqi) => {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
    if (aqi <= 200) return 'Unhealthy';
    if (aqi <= 300) return 'Very Unhealthy';
    return 'Hazardous';
  };

  const getAQIColor = (aqi) => {
    if (aqi <= 50) return '#28a745';
    if (aqi <= 100) return '#ffc107';
    if (aqi <= 150) return '#fd7e14';
    if (aqi <= 200) return '#dc3545';
    if (aqi <= 300) return '#6f42c1';
    return '#6c757d';
  };

  const getAQIIcon = (aqi) => {
    if (aqi <= 50) return CheckCircle;
    if (aqi <= 100) return Info;
    if (aqi <= 150) return AlertTriangle;
    return XCircle;
  };

  const getRecommendations = (aqi) => {
    if (aqi <= 50) {
      return [
        'Air quality is satisfactory',
        'Ideal for outdoor activities',
        'No health precautions needed'
      ];
    } else if (aqi <= 100) {
      return [
        'Air quality is acceptable',
        'Sensitive individuals should limit prolonged outdoor exertion',
        'Generally safe for most people'
      ];
    } else if (aqi <= 150) {
      return [
        'Unhealthy for sensitive groups',
        'Children and adults with respiratory disease should limit outdoor exertion',
        'Consider wearing a mask outdoors'
      ];
    } else {
      return [
        'Unhealthy air quality',
        'Everyone should limit outdoor activities',
        'Wear a mask when going outside',
        'Keep windows closed'
      ];
    }
  };

  const getHealthEffects = (aqi) => {
    if (aqi <= 50) {
      return 'Little or no risk from air pollution';
    } else if (aqi <= 100) {
      return 'Unusually sensitive people may experience minor respiratory symptoms';
    } else if (aqi <= 150) {
      return 'Sensitive groups may experience respiratory symptoms and reduced lung function';
    } else {
      return 'Increased likelihood of respiratory symptoms and reduced lung function for everyone';
    }
  };

  if (!airQualityData) {
    return (
      <div className="air-quality">
        <div className="loading-content">
          <div className="spinner"></div>
          <p>Loading air quality data...</p>
        </div>
      </div>
    );
  }

  const AQIIcon = getAQIIcon(airQualityData.aqi);

  return (
    <div className="air-quality">
      <div className="air-quality-container">
        <motion.div 
          className="air-quality-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="header-content">
            <div className="header-info">
              <h1>
                <Wind size={32} />
                Air Quality Index
              </h1>
              <p>Real-time air pollution monitoring and health recommendations</p>
            </div>
            
            <div className="location-info">
              <MapPin size={16} />
              <span>{currentWeather?.name || 'Current Location'}</span>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="aqi-overview"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="aqi-main-card">
            <div className="aqi-value-section">
              <div className="aqi-icon" style={{ color: airQualityData.color }}>
                <AQIIcon size={48} />
              </div>
              <div className="aqi-value">
                <span className="aqi-number" style={{ color: airQualityData.color }}>
                  {airQualityData.aqi}
                </span>
                <span className="aqi-label">AQI</span>
              </div>
            </div>
            
            <div className="aqi-info">
              <h2 style={{ color: airQualityData.color }}>{airQualityData.category}</h2>
              <p className="health-effects">{airQualityData.healthEffects}</p>
              <p className="last-updated">
                Last updated: {new Date(airQualityData.lastUpdated).toLocaleTimeString()}
              </p>
            </div>
          </div>

          <div className="aqi-scale">
            <h3>Air Quality Scale</h3>
            <div className="scale-bars">
              <div className="scale-bar good">
                <span className="scale-range">0-50</span>
                <span className="scale-label">Good</span>
              </div>
              <div className="scale-bar moderate">
                <span className="scale-range">51-100</span>
                <span className="scale-label">Moderate</span>
              </div>
              <div className="scale-bar unhealthy-sensitive">
                <span className="scale-range">101-150</span>
                <span className="scale-label">Unhealthy for Sensitive</span>
              </div>
              <div className="scale-bar unhealthy">
                <span className="scale-range">151-200</span>
                <span className="scale-label">Unhealthy</span>
              </div>
              <div className="scale-bar very-unhealthy">
                <span className="scale-range">201-300</span>
                <span className="scale-label">Very Unhealthy</span>
              </div>
              <div className="scale-bar hazardous">
                <span className="scale-range">300+</span>
                <span className="scale-label">Hazardous</span>
              </div>
            </div>
            <div className="current-indicator" style={{ 
              left: `${Math.min((airQualityData.aqi / 300) * 100, 100)}%`,
              backgroundColor: airQualityData.color 
            }}></div>
          </div>
        </motion.div>

        <motion.div 
          className="pollutants-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2>Pollutant Concentrations</h2>
          <div className="pollutants-grid">
            {pollutantData.map((pollutant, index) => {
              const percentage = (pollutant.value / pollutant.limit) * 100;
              const isExceeded = percentage > 100;
              
              return (
                <div key={index} className="pollutant-card">
                  <div className="pollutant-header">
                    <h3>{pollutant.name}</h3>
                    <span className={`status ${isExceeded ? 'exceeded' : 'normal'}`}>
                      {isExceeded ? <XCircle size={16} /> : <CheckCircle size={16} />}
                    </span>
                  </div>
                  
                  <div className="pollutant-value">
                    <span className="value">{pollutant.value}</span>
                    <span className="unit">{pollutant.unit}</span>
                  </div>
                  
                  <div className="pollutant-bar">
                    <div 
                      className="bar-fill"
                      style={{ 
                        width: `${Math.min(percentage, 100)}%`,
                        backgroundColor: isExceeded ? '#dc3545' : '#28a745'
                      }}
                    ></div>
                  </div>
                  
                  <div className="pollutant-limit">
                    Limit: {pollutant.limit} {pollutant.unit}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        <motion.div 
          className="charts-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="charts-grid">
            <div className="chart-container">
              <h3>24-Hour AQI Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis 
                    dataKey="time" 
                    stroke="rgba(255,255,255,0.7)"
                    fontSize={12}
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
                    dataKey="aqi" 
                    stroke="#4A90E2" 
                    strokeWidth={3}
                    dot={{ fill: '#4A90E2', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-container">
              <h3>PM2.5 vs PM10 Levels</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={historicalData.slice(-12)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis 
                    dataKey="time" 
                    stroke="rgba(255,255,255,0.7)"
                    fontSize={12}
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
                  <Bar dataKey="pm25" fill="#14B8A6" name="PM2.5" />
                  <Bar dataKey="pm10" fill="#F97316" name="PM10" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="recommendations-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h2>Health Recommendations</h2>
          <div className="recommendations-grid">
            <div className="recommendations-card">
              <h3>
                <Activity size={20} />
                Current Recommendations
              </h3>
              <ul>
                {airQualityData.recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>

            <div className="health-tips-card">
              <h3>
                <Info size={20} />
                General Health Tips
              </h3>
              <ul>
                <li>Check air quality before outdoor activities</li>
                <li>Use air purifiers indoors when AQI is high</li>
                <li>Keep windows closed during poor air quality days</li>
                <li>Consider wearing N95 masks outdoors when AQI > 100</li>
                <li>Stay hydrated and avoid strenuous outdoor exercise</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AirQuality;