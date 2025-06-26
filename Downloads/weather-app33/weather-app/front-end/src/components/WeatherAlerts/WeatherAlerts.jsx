import { AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react';
import './WeatherAlerts.scss';

const WeatherAlerts = ({ weatherData }) => {
  if (!weatherData) return null;

  const generateAlerts = (data) => {
    const alerts = [];
    
    // Temperature alerts
    if (data.main.temp > 35) {
      alerts.push({
        type: 'warning',
        title: 'High Temperature Alert',
        message: `Extremely hot weather at ${Math.round(data.main.temp)}°C. Stay hydrated and avoid prolonged sun exposure.`,
        icon: AlertTriangle
      });
    } else if (data.main.temp < -10) {
      alerts.push({
        type: 'warning',
        title: 'Low Temperature Alert',
        message: `Freezing conditions at ${Math.round(data.main.temp)}°C. Dress warmly and check on vulnerable individuals.`,
        icon: AlertTriangle
      });
    }

    // Wind alerts
    if (data.wind.speed > 15) {
      alerts.push({
        type: 'warning',
        title: 'Strong Wind Alert',
        message: `High winds at ${data.wind.speed} m/s. Secure loose objects and avoid outdoor activities.`,
        icon: AlertTriangle
      });
    }

    // Visibility alerts
    if (data.visibility < 1000) {
      alerts.push({
        type: 'error',
        title: 'Low Visibility Alert',
        message: `Poor visibility at ${(data.visibility / 1000).toFixed(1)} km. Drive carefully and use headlights.`,
        icon: XCircle
      });
    }

    // Weather condition alerts
    const severConditions = ['Thunderstorm', 'Snow', 'Fog', 'Tornado', 'Hurricane'];
    if (severConditions.includes(data.weather[0].main)) {
      alerts.push({
        type: 'error',
        title: `${data.weather[0].main} Alert`,
        message: `${data.weather[0].main} conditions detected. Take necessary precautions and stay indoors if possible.`,
        icon: XCircle
      });
    }

    // Good weather
    if (alerts.length === 0 && data.main.temp >= 18 && data.main.temp <= 28) {
      alerts.push({
        type: 'success',
        title: 'Perfect Weather',
        message: 'Great weather conditions! Perfect time for outdoor activities.',
        icon: CheckCircle
      });
    }

    // General info
    if (alerts.length === 0) {
      alerts.push({
        type: 'info',
        title: 'Weather Update',
        message: `Current conditions: ${data.weather[0].description}. Have a great day!`,
        icon: Info
      });
    }

    return alerts;
  };

  const alerts = generateAlerts(weatherData);

  const getAlertClass = (type) => {
    switch (type) {
      case 'error': return 'alert-error';
      case 'warning': return 'alert-warning';
      case 'success': return 'alert-success';
      case 'info': 
      default: return 'alert-info';
    }
  };

  return (
    <div className="weather-alerts">
      <div className="alerts-header">
        <AlertTriangle className="header-icon" />
        <h2>Weather Alerts & Notifications</h2>
      </div>

      <div className="alerts-list">
        {alerts.map((alert, index) => {
          const IconComponent = alert.icon;
          return (
            <div key={index} className={`alert-item ${getAlertClass(alert.type)}`}>
              <div className="alert-icon">
                <IconComponent size={24} />
              </div>
              <div className="alert-content">
                <h3 className="alert-title">{alert.title}</h3>
                <p className="alert-message">{alert.message}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="weather-tips">
        <h3>Weather Tips</h3>
        <div className="tips-grid">
          <div className="tip-item">
            <span className="tip-emoji">☀️</span>
            <p>Apply sunscreen when UV index is high</p>
          </div>
          <div className="tip-item">
            <span className="tip-emoji">🌧️</span>
            <p>Carry an umbrella if rain is expected</p>
          </div>
          <div className="tip-item">
            <span className="tip-emoji">❄️</span>
            <p>Layer clothing in cold weather</p>
          </div>
          <div className="tip-item">
            <span className="tip-emoji">💨</span>
            <p>Secure outdoor items during windy conditions</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherAlerts;