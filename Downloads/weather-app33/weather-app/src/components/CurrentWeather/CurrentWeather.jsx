import { 
  Thermometer, 
  Droplets, 
  Wind, 
  Eye, 
  Gauge,
  Sunrise,
  Sunset,
  Navigation
} from 'lucide-react';
import './CurrentWeather.scss';

const CurrentWeather = ({ data }) => {
  if (!data) return null;

  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getWeatherIcon = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
  };

  return (
    <div className="current-weather">
      <div className="weather-header">
        <h2>Current Weather</h2>
        <p className="location">{data.name}, {data.sys.country}</p>
      </div>

      <div className="main-weather">
        <div className="temperature-section">
          <img 
            src={getWeatherIcon(data.weather[0].icon)}
            alt={data.weather[0].description}
            className="weather-icon"
          />
          <div className="temperature">
            <span className="temp-value">{Math.round(data.main.temp)}°</span>
            <span className="temp-unit">C</span>
          </div>
        </div>
        
        <div className="weather-description">
          <h3>{data.weather[0].main}</h3>
          <p>{data.weather[0].description}</p>
          <p className="feels-like">
            Feels like {Math.round(data.main.feels_like)}°C
          </p>
        </div>
      </div>

      <div className="weather-details">
        <div className="detail-grid">
          <div className="detail-item">
            <Thermometer className="detail-icon" />
            <div className="detail-content">
              <span className="detail-label">Min/Max</span>
              <span className="detail-value">
                {Math.round(data.main.temp_min)}°/{Math.round(data.main.temp_max)}°
              </span>
            </div>
          </div>

          <div className="detail-item">
            <Droplets className="detail-icon" />
            <div className="detail-content">
              <span className="detail-label">Humidity</span>
              <span className="detail-value">{data.main.humidity}%</span>
            </div>
          </div>

          <div className="detail-item">
            <Wind className="detail-icon" />
            <div className="detail-content">
              <span className="detail-label">Wind</span>
              <span className="detail-value">{data.wind.speed} m/s</span>
            </div>
          </div>

          <div className="detail-item">
            <Eye className="detail-icon" />
            <div className="detail-content">
              <span className="detail-label">Visibility</span>
              <span className="detail-value">{(data.visibility / 1000).toFixed(1)} km</span>
            </div>
          </div>

          <div className="detail-item">
            <Gauge className="detail-icon" />
            <div className="detail-content">
              <span className="detail-label">Pressure</span>
              <span className="detail-value">{data.main.pressure} hPa</span>
            </div>
          </div>

          <div className="detail-item">
            <Navigation className="detail-icon" />
            <div className="detail-content">
              <span className="detail-label">Wind Dir</span>
              <span className="detail-value">{data.wind.deg}°</span>
            </div>
          </div>

          <div className="detail-item">
            <Sunrise className="detail-icon" />
            <div className="detail-content">
              <span className="detail-label">Sunrise</span>
              <span className="detail-value">{formatTime(data.sys.sunrise)}</span>
            </div>
          </div>

          <div className="detail-item">
            <Sunset className="detail-icon" />
            <div className="detail-content">
              <span className="detail-label">Sunset</span>
              <span className="detail-value">{formatTime(data.sys.sunset)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;