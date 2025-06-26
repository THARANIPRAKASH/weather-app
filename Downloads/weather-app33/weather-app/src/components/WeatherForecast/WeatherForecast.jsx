import { Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import './WeatherForecast.scss';

const WeatherForecast = ({ data }) => {
  if (!data || !data.list) return null;

  // Group forecast by day (taking every 8th item for daily forecast)
  const dailyForecast = data.list.filter((_, index) => index % 8 === 0).slice(0, 5);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString([], { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getWeatherIcon = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  return (
    <div className="weather-forecast">
      <div className="forecast-header">
        <Calendar className="header-icon" />
        <h2>5-Day Forecast</h2>
      </div>

      <div className="forecast-list">
        {dailyForecast.map((day, index) => (
          <div key={day.dt} className={`forecast-item ${index === 0 ? 'today' : ''}`}>
            <div className="forecast-date">
              <span className="day-name">
                {index === 0 ? 'Today' : formatDate(day.dt)}
              </span>
            </div>

            <div className="forecast-weather">
              <img 
                src={getWeatherIcon(day.weather[0].icon)}
                alt={day.weather[0].description}
                className="forecast-icon"
              />
              <span className="weather-desc">{day.weather[0].main}</span>
            </div>

            <div className="forecast-temps">
              <div className="temp-range">
                <span className="temp-high">
                  <TrendingUp size={14} />
                  {Math.round(day.main.temp_max)}°
                </span>
                <span className="temp-low">
                  <TrendingDown size={14} />
                  {Math.round(day.main.temp_min)}°
                </span>
              </div>
            </div>

            <div className="forecast-details">
              <div className="detail-small">
                <span>💧 {day.main.humidity}%</span>
              </div>
              <div className="detail-small">
                <span>💨 {day.wind.speed} m/s</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="hourly-preview">
        <h3>Next 24 Hours</h3>
        <div className="hourly-list">
          {data.list.slice(0, 8).map((hour) => (
            <div key={hour.dt} className="hourly-item">
              <span className="hour-time">
                {new Date(hour.dt * 1000).toLocaleTimeString([], { 
                  hour: '2-digit',
                  hour12: false
                })}
              </span>
              <img 
                src={getWeatherIcon(hour.weather[0].icon)}
                alt={hour.weather[0].description}
                className="hourly-icon"
              />
              <span className="hour-temp">{Math.round(hour.main.temp)}°</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeatherForecast;