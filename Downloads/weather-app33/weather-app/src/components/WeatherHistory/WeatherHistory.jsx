import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  History, 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  BarChart3,
  Download,
  Filter,
  Search
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useWeather } from '../../contexts/WeatherContext.jsx';
import { format, subDays, isWithinInterval } from 'date-fns';
import './WeatherHistory.scss';

const WeatherHistory = () => {
  const { weatherHistory } = useWeather();
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [dateRange, setDateRange] = useState('7days');
  const [searchTerm, setSearchTerm] = useState('');
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    filterHistory();
  }, [weatherHistory, dateRange, searchTerm]);

  const filterHistory = () => {
    let filtered = [...weatherHistory];

    // Filter by date range
    const now = new Date();
    let startDate;
    
    switch (dateRange) {
      case '1day':
        startDate = subDays(now, 1);
        break;
      case '7days':
        startDate = subDays(now, 7);
        break;
      case '30days':
        startDate = subDays(now, 30);
        break;
      case '90days':
        startDate = subDays(now, 90);
        break;
      default:
        startDate = subDays(now, 7);
    }

    filtered = filtered.filter(item => 
      isWithinInterval(new Date(item.timestamp), { start: startDate, end: now })
    );

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.country.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredHistory(filtered);

    // Prepare chart data
    const chartData = filtered.slice(0, 20).reverse().map(item => ({
      time: format(new Date(item.timestamp), 'MMM dd HH:mm'),
      temperature: Math.round(item.temp),
      location: item.location,
      weather: item.weather.main
    }));

    setChartData(chartData);
  };

  const getTemperatureStats = () => {
    if (filteredHistory.length === 0) return { avg: 0, min: 0, max: 0 };
    
    const temps = filteredHistory.map(item => item.temp);
    return {
      avg: Math.round(temps.reduce((a, b) => a + b, 0) / temps.length),
      min: Math.round(Math.min(...temps)),
      max: Math.round(Math.max(...temps))
    };
  };

  const getLocationStats = () => {
    const locationCounts = {};
    filteredHistory.forEach(item => {
      const key = `${item.location}, ${item.country}`;
      locationCounts[key] = (locationCounts[key] || 0) + 1;
    });
    
    return Object.entries(locationCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([location, count]) => ({ location, count }));
  };

  const exportData = () => {
    const csvContent = [
      ['Timestamp', 'Location', 'Country', 'Temperature (°C)', 'Weather', 'Description'],
      ...filteredHistory.map(item => [
        item.timestamp,
        item.location,
        item.country,
        item.temp,
        item.weather.main,
        item.weather.description
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `weather-history-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const stats = getTemperatureStats();
  const locationStats = getLocationStats();

  return (
    <div className="weather-history">
      <div className="history-container">
        <motion.div 
          className="history-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="header-content">
            <div className="header-info">
              <h1>
                <History size={32} />
                Weather History
              </h1>
              <p>Track and analyze your weather search history with detailed insights</p>
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
          className="history-filters"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="filter-group">
            <label>
              <Filter size={16} />
              Time Range
            </label>
            <select 
              value={dateRange} 
              onChange={(e) => setDateRange(e.target.value)}
              className="filter-select"
            >
              <option value="1day">Last 24 Hours</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
            </select>
          </div>

          <div className="filter-group">
            <label>
              <Search size={16} />
              Search Location
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by city or country..."
              className="filter-input"
            />
          </div>
        </motion.div>

        <motion.div 
          className="history-stats"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="stat-card">
            <div className="stat-icon">
              <BarChart3 size={24} />
            </div>
            <div className="stat-content">
              <h3>{stats.avg}°C</h3>
              <p>Average Temperature</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <TrendingUp size={24} />
            </div>
            <div className="stat-content">
              <h3>{stats.max}°C</h3>
              <p>Highest Temperature</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <TrendingDown size={24} />
            </div>
            <div className="stat-content">
              <h3>{stats.min}°C</h3>
              <p>Lowest Temperature</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <Calendar size={24} />
            </div>
            <div className="stat-content">
              <h3>{filteredHistory.length}</h3>
              <p>Total Searches</p>
            </div>
          </div>
        </motion.div>

        <div className="history-content">
          <motion.div 
            className="temperature-chart"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h2>Temperature Trend</h2>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis 
                    dataKey="time" 
                    stroke="rgba(255,255,255,0.7)"
                    fontSize={12}
                  />
                  <YAxis 
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
                    type="monotone" 
                    dataKey="temperature" 
                    stroke="#4A90E2" 
                    strokeWidth={3}
                    dot={{ fill: '#4A90E2', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#4A90E2', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-chart">
                <p>No data available for the selected time range</p>
              </div>
            )}
          </motion.div>

          <motion.div 
            className="location-stats"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <h2>Most Searched Locations</h2>
            {locationStats.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={locationStats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis 
                    dataKey="location" 
                    stroke="rgba(255,255,255,0.7)"
                    fontSize={12}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis 
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
                  <Bar 
                    dataKey="count" 
                    fill="#14B8A6"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-chart">
                <p>No location data available</p>
              </div>
            )}
          </motion.div>
        </div>

        <motion.div 
          className="history-list"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <h2>Recent Searches</h2>
          {filteredHistory.length > 0 ? (
            <div className="history-items">
              {filteredHistory.slice(0, 20).map((item) => (
                <div key={item.id} className="history-item">
                  <div className="item-weather">
                    <img 
                      src={`https://openweathermap.org/img/wn/${item.weather.icon}@2x.png`}
                      alt={item.weather.description}
                    />
                  </div>
                  <div className="item-content">
                    <h4>{item.location}, {item.country}</h4>
                    <p>{item.weather.description}</p>
                    <span className="item-time">
                      {format(new Date(item.timestamp), 'MMM dd, yyyy HH:mm')}
                    </span>
                  </div>
                  <div className="item-temp">
                    <span>{Math.round(item.temp)}°C</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <History size={48} />
              <h3>No search history found</h3>
              <p>Start searching for weather data to see your history here.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default WeatherHistory;