import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Globe, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  BarChart3,
  Thermometer,
  Droplets,
  Wind,
  Sun,
  Download,
  Filter
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, AreaChart, Area } from 'recharts';
import { useWeather } from '../../contexts/WeatherContext.jsx';
import { format, subYears, subMonths } from 'date-fns';
import './ClimateData.scss';

const ClimateData = () => {
  const { location, currentWeather } = useWeather();
  const [timeRange, setTimeRange] = useState('1year');
  const [dataType, setDataType] = useState('temperature');
  const [climateData, setClimateData] = useState(null);
  const [climateSummary, setClimateSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateClimateData();
  }, [location, timeRange, dataType]);

  const generateClimateData = () => {
    setLoading(true);
    
    // Generate mock climate data based on time range
    const now = new Date();
    let dataPoints = [];
    let startDate;
    
    switch (timeRange) {
      case '6months':
        startDate = subMonths(now, 6);
        dataPoints = generateMonthlyData(startDate, now, 6);
        break;
      case '1year':
        startDate = subYears(now, 1);
        dataPoints = generateMonthlyData(startDate, now, 12);
        break;
      case '5years':
        startDate = subYears(now, 5);
        dataPoints = generateYearlyData(startDate, now, 5);
        break;
      case '10years':
        startDate = subYears(now, 10);
        dataPoints = generateYearlyData(startDate, now, 10);
        break;
      default:
        startDate = subYears(now, 1);
        dataPoints = generateMonthlyData(startDate, now, 12);
    }

    setClimateData(dataPoints);
    generateClimateSummary(dataPoints);
    setLoading(false);
  };

  const generateMonthlyData = (startDate, endDate, months) => {
    return Array.from({ length: months }, (_, i) => {
      const date = new Date(startDate);
      date.setMonth(date.getMonth() + i);
      
      return {
        date: format(date, 'MMM yyyy'),
        timestamp: date.getTime(),
        temperature: 15 + Math.sin((i / 12) * 2 * Math.PI) * 10 + Math.random() * 5,
        precipitation: Math.random() * 100 + 20,
        humidity: Math.random() * 30 + 50,
        windSpeed: Math.random() * 15 + 5,
        pressure: Math.random() * 20 + 1010,
        sunshine: Math.random() * 200 + 100
      };
    });
  };

  const generateYearlyData = (startDate, endDate, years) => {
    return Array.from({ length: years }, (_, i) => {
      const date = new Date(startDate);
      date.setFullYear(date.getFullYear() + i);
      
      return {
        date: format(date, 'yyyy'),
        timestamp: date.getTime(),
        temperature: 15 + Math.sin((i / 10) * 2 * Math.PI) * 8 + Math.random() * 3,
        precipitation: Math.random() * 80 + 40,
        humidity: Math.random() * 20 + 60,
        windSpeed: Math.random() * 10 + 8,
        pressure: Math.random() * 15 + 1012,
        sunshine: Math.random() * 150 + 150
      };
    });
  };

  const generateClimateSummary = (data) => {
    if (!data || data.length === 0) return;

    const summary = {
      temperature: {
        average: data.reduce((sum, item) => sum + item.temperature, 0) / data.length,
        min: Math.min(...data.map(item => item.temperature)),
        max: Math.max(...data.map(item => item.temperature)),
        trend: calculateTrend(data.map(item => item.temperature))
      },
      precipitation: {
        total: data.reduce((sum, item) => sum + item.precipitation, 0),
        average: data.reduce((sum, item) => sum + item.precipitation, 0) / data.length,
        max: Math.max(...data.map(item => item.precipitation)),
        trend: calculateTrend(data.map(item => item.precipitation))
      },
      humidity: {
        average: data.reduce((sum, item) => sum + item.humidity, 0) / data.length,
        min: Math.min(...data.map(item => item.humidity)),
        max: Math.max(...data.map(item => item.humidity))
      },
      windSpeed: {
        average: data.reduce((sum, item) => sum + item.windSpeed, 0) / data.length,
        max: Math.max(...data.map(item => item.windSpeed))
      }
    };

    setClimateSummary(summary);
  };

  const calculateTrend = (values) => {
    if (values.length < 2) return 0;
    
    const firstHalf = values.slice(0, Math.floor(values.length / 2));
    const secondHalf = values.slice(Math.floor(values.length / 2));
    
    const firstAvg = firstHalf.reduce((sum, val) => sum + val, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, val) => sum + val, 0) / secondHalf.length;
    
    return ((secondAvg - firstAvg) / firstAvg) * 100;
  };

  const dataTypes = [
    { id: 'temperature', name: 'Temperature', icon: Thermometer, unit: '°C', color: '#F97316' },
    { id: 'precipitation', name: 'Precipitation', icon: Droplets, unit: 'mm', color: '#4A90E2' },
    { id: 'humidity', name: 'Humidity', icon: Droplets, unit: '%', color: '#14B8A6' },
    { id: 'windSpeed', name: 'Wind Speed', icon: Wind, unit: 'm/s', color: '#9333EA' },
    { id: 'sunshine', name: 'Sunshine Hours', icon: Sun, unit: 'hours', color: '#EAB308' }
  ];

  const timeRanges = [
    { id: '6months', name: '6 Months' },
    { id: '1year', name: '1 Year' },
    { id: '5years', name: '5 Years' },
    { id: '10years', name: '10 Years' }
  ];

  const exportData = () => {
    if (!climateData) return;

    const csvContent = [
      ['Date', 'Temperature (°C)', 'Precipitation (mm)', 'Humidity (%)', 'Wind Speed (m/s)', 'Sunshine (hours)'],
      ...climateData.map(item => [
        item.date,
        item.temperature.toFixed(1),
        item.precipitation.toFixed(1),
        item.humidity.toFixed(1),
        item.windSpeed.toFixed(1),
        item.sunshine.toFixed(1)
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `climate-data-${timeRange}-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const currentDataType = dataTypes.find(type => type.id === dataType);

  if (loading) {
    return (
      <div className="climate-data">
        <div className="loading-content">
          <div className="spinner"></div>
          <p>Loading climate data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="climate-data">
      <div className="climate-container">
        <motion.div 
          className="climate-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="header-content">
            <div className="header-info">
              <h1>
                <Globe size={32} />
                Climate Data Analysis
              </h1>
              <p>Long-term weather patterns and climate trends for your location</p>
            </div>
            
            <div className="header-actions">
              <button onClick={exportData} className="btn btn-primary">
                <Download size={18} />
                Export Data
              </button>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="climate-filters"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="filter-group">
            <label>
              <Filter size={16} />
              Data Type
            </label>
            <div className="data-type-buttons">
              {dataTypes.map((type) => {
                const IconComponent = type.icon;
                return (
                  <button
                    key={type.id}
                    className={`data-type-btn ${dataType === type.id ? 'active' : ''}`}
                    onClick={() => setDataType(type.id)}
                    style={{ '--type-color': type.color }}
                  >
                    <IconComponent size={16} />
                    <span>{type.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="filter-group">
            <label>
              <Calendar size={16} />
              Time Range
            </label>
            <div className="time-range-buttons">
              {timeRanges.map((range) => (
                <button
                  key={range.id}
                  className={`time-range-btn ${timeRange === range.id ? 'active' : ''}`}
                  onClick={() => setTimeRange(range.id)}
                >
                  {range.name}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {climateSummary && (
          <motion.div 
            className="climate-summary"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="summary-cards">
              <div className="summary-card">
                <div className="card-icon">
                  <Thermometer size={24} />
                </div>
                <div className="card-content">
                  <h3>Temperature</h3>
                  <div className="card-stats">
                    <div className="stat-item">
                      <span className="stat-label">Average</span>
                      <span className="stat-value">{climateSummary.temperature.average.toFixed(1)}°C</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Range</span>
                      <span className="stat-value">
                        {climateSummary.temperature.min.toFixed(1)}° - {climateSummary.temperature.max.toFixed(1)}°C
                      </span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Trend</span>
                      <span className={`stat-value trend ${climateSummary.temperature.trend >= 0 ? 'positive' : 'negative'}`}>
                        {climateSummary.temperature.trend >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                        {Math.abs(climateSummary.temperature.trend).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="summary-card">
                <div className="card-icon">
                  <Droplets size={24} />
                </div>
                <div className="card-content">
                  <h3>Precipitation</h3>
                  <div className="card-stats">
                    <div className="stat-item">
                      <span className="stat-label">Total</span>
                      <span className="stat-value">{climateSummary.precipitation.total.toFixed(0)} mm</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Average</span>
                      <span className="stat-value">{climateSummary.precipitation.average.toFixed(1)} mm</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Trend</span>
                      <span className={`stat-value trend ${climateSummary.precipitation.trend >= 0 ? 'positive' : 'negative'}`}>
                        {climateSummary.precipitation.trend >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                        {Math.abs(climateSummary.precipitation.trend).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="summary-card">
                <div className="card-icon">
                  <Wind size={24} />
                </div>
                <div className="card-content">
                  <h3>Wind & Humidity</h3>
                  <div className="card-stats">
                    <div className="stat-item">
                      <span className="stat-label">Avg Wind</span>
                      <span className="stat-value">{climateSummary.windSpeed.average.toFixed(1)} m/s</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Avg Humidity</span>
                      <span className="stat-value">{climateSummary.humidity.average.toFixed(1)}%</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Max Wind</span>
                      <span className="stat-value">{climateSummary.windSpeed.max.toFixed(1)} m/s</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <motion.div 
          className="climate-chart"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="chart-header">
            <h2>
              {currentDataType?.name} Trends
              <span className="chart-subtitle">
                {timeRange === '6months' ? 'Last 6 months' : 
                 timeRange === '1year' ? 'Last 12 months' :
                 timeRange === '5years' ? 'Last 5 years' : 'Last 10 years'}
              </span>
            </h2>
          </div>

          <div className="chart-container">
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={climateData}>
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={currentDataType?.color} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={currentDataType?.color} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="date" 
                  stroke="rgba(255,255,255,0.7)"
                  fontSize={12}
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.7)"
                  fontSize={12}
                  label={{ 
                    value: currentDataType?.unit, 
                    angle: -90, 
                    position: 'insideLeft',
                    style: { textAnchor: 'middle', fill: 'rgba(255,255,255,0.7)' }
                  }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '12px',
                    color: '#fff'
                  }}
                  formatter={(value) => [`${value.toFixed(1)} ${currentDataType?.unit}`, currentDataType?.name]}
                />
                <Area 
                  type="monotone" 
                  dataKey={dataType} 
                  stroke={currentDataType?.color}
                  strokeWidth={3}
                  fill="url(#colorGradient)"
                  dot={{ fill: currentDataType?.color, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: currentDataType?.color, strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
          className="climate-comparison"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h2>Multi-Parameter Comparison</h2>
          <div className="comparison-charts">
            <div className="comparison-chart">
              <h3>Temperature vs Precipitation</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={climateData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis 
                    dataKey="date" 
                    stroke="rgba(255,255,255,0.7)"
                    fontSize={12}
                  />
                  <YAxis 
                    yAxisId="temp"
                    stroke="rgba(255,255,255,0.7)"
                    fontSize={12}
                  />
                  <YAxis 
                    yAxisId="precip"
                    orientation="right"
                    stroke="rgba(255,255,255,0.7)"
                    fontSize={12}
                  />
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
                    yAxisId="temp"
                    type="monotone" 
                    dataKey="temperature" 
                    stroke="#F97316" 
                    strokeWidth={2}
                    name="Temperature (°C)"
                  />
                  <Line 
                    yAxisId="precip"
                    type="monotone" 
                    dataKey="precipitation" 
                    stroke="#4A90E2" 
                    strokeWidth={2}
                    name="Precipitation (mm)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="comparison-chart">
              <h3>Humidity vs Wind Speed</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={climateData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis 
                    dataKey="date" 
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
                  <Bar dataKey="humidity" fill="#14B8A6" name="Humidity (%)" />
                  <Bar dataKey="windSpeed" fill="#9333EA" name="Wind Speed (m/s)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ClimateData;