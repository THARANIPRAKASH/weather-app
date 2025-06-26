import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  Zap, 
  CloudRain, 
  Wind, 
  Snowflake, 
  Sun, 
  Eye,
  Bell,
  Settings,
  ChevronDown,
  ChevronUp,
  MapPin,
  Clock,
  Info,
  XCircle,
  CheckCircle
} from 'lucide-react';
import { useWeather } from '../../contexts/WeatherContext.jsx';
import toast from 'react-hot-toast';
import './SevereWeather.scss';

const SevereWeather = () => {
  const { location, currentWeather } = useWeather();
  const [alerts, setAlerts] = useState([]);
  const [expandedAlert, setExpandedAlert] = useState(null);
  const [notificationSettings, setNotificationSettings] = useState({
    browser: true,
    email: false,
    sms: false,
    frequency: 'immediate',
    severityLevel: 'moderate'
  });

  useEffect(() => {
    generateMockAlerts();
  }, [location]);

  const generateMockAlerts = () => {
    const alertTypes = [
      {
        type: 'thunderstorm',
        icon: Zap,
        severity: 'severe',
        title: 'Severe Thunderstorm Warning',
        description: 'Severe thunderstorms with damaging winds and large hail expected',
        color: '#dc3545'
      },
      {
        type: 'flood',
        icon: CloudRain,
        severity: 'moderate',
        title: 'Flood Watch',
        description: 'Heavy rainfall may cause flooding in low-lying areas',
        color: '#0dcaf0'
      },
      {
        type: 'wind',
        icon: Wind,
        severity: 'severe',
        title: 'High Wind Advisory',
        description: 'Sustained winds of 40-50 mph with gusts up to 70 mph',
        color: '#6f42c1'
      },
      {
        type: 'heat',
        icon: Sun,
        severity: 'extreme',
        title: 'Excessive Heat Warning',
        description: 'Dangerously hot conditions with heat index values up to 110°F',
        color: '#fd7e14'
      }
    ];

    const mockAlerts = alertTypes.map((alertType, index) => ({
      id: index + 1,
      ...alertType,
      issuedAt: new Date(Date.now() - Math.random() * 3600000).toISOString(),
      expiresAt: new Date(Date.now() + Math.random() * 86400000).toISOString(),
      areas: ['Downtown', 'Suburbs', 'Rural Areas'],
      instructions: [
        'Stay indoors if possible',
        'Avoid unnecessary travel',
        'Monitor weather updates',
        'Have emergency supplies ready'
      ],
      impacts: [
        'Power outages possible',
        'Travel disruptions likely',
        'Property damage risk',
        'Health risks for vulnerable populations'
      ],
      source: 'National Weather Service',
      urgency: Math.random() > 0.5 ? 'immediate' : 'expected'
    }));

    setAlerts(mockAlerts);
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'minor': return '#28a745';
      case 'moderate': return '#ffc107';
      case 'severe': return '#fd7e14';
      case 'extreme': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'minor': return Info;
      case 'moderate': return AlertTriangle;
      case 'severe': return XCircle;
      case 'extreme': return AlertTriangle;
      default: return Info;
    }
  };

  const handleNotificationToggle = (type) => {
    setNotificationSettings(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
    
    if (type === 'browser' && !notificationSettings.browser) {
      // Request notification permission
      if ('Notification' in window) {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            toast.success('Browser notifications enabled');
          }
        });
      }
    }
  };

  const handleSettingChange = (setting, value) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const toggleAlertExpansion = (alertId) => {
    setExpandedAlert(expandedAlert === alertId ? null : alertId);
  };

  const viewOnRadar = (alert) => {
    toast.success(`Opening radar view for ${alert.title}`);
    // This would navigate to radar page with specific alert location
  };

  const enableNotifications = (alert) => {
    toast.success(`Notifications enabled for ${alert.title}`);
    // This would set up specific notifications for this alert
  };

  return (
    <div className="severe-weather">
      <div className="severe-weather-container">
        <motion.div 
          className="severe-weather-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="header-content">
            <div className="header-info">
              <h1>
                <AlertTriangle size={32} />
                Severe Weather Alerts
              </h1>
              <p>Stay informed about severe weather conditions and safety recommendations</p>
            </div>
            
            <div className="location-info">
              <MapPin size={16} />
              <span>{currentWeather?.name || 'Current Location'}</span>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="alerts-summary"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="summary-cards">
            <div className="summary-card active-alerts">
              <div className="card-icon">
                <AlertTriangle size={24} />
              </div>
              <div className="card-content">
                <h3>{alerts.length}</h3>
                <p>Active Alerts</p>
              </div>
            </div>

            <div className="summary-card severe-count">
              <div className="card-icon">
                <XCircle size={24} />
              </div>
              <div className="card-content">
                <h3>{alerts.filter(a => a.severity === 'severe' || a.severity === 'extreme').length}</h3>
                <p>Severe Warnings</p>
              </div>
            </div>

            <div className="summary-card notifications">
              <div className="card-icon">
                <Bell size={24} />
              </div>
              <div className="card-content">
                <h3>{Object.values(notificationSettings).filter(Boolean).length}</h3>
                <p>Notifications On</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="notification-settings"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="settings-header">
            <h2>
              <Settings size={20} />
              Notification Preferences
            </h2>
          </div>

          <div className="settings-content">
            <div className="settings-group">
              <h3>Notification Methods</h3>
              <div className="settings-options">
                <label className="setting-item">
                  <input
                    type="checkbox"
                    checked={notificationSettings.browser}
                    onChange={() => handleNotificationToggle('browser')}
                  />
                  <span className="checkmark"></span>
                  <div className="setting-info">
                    <span className="setting-label">Browser Notifications</span>
                    <span className="setting-desc">Get instant alerts in your browser</span>
                  </div>
                </label>

                <label className="setting-item">
                  <input
                    type="checkbox"
                    checked={notificationSettings.email}
                    onChange={() => handleNotificationToggle('email')}
                  />
                  <span className="checkmark"></span>
                  <div className="setting-info">
                    <span className="setting-label">Email Alerts</span>
                    <span className="setting-desc">Receive detailed alerts via email</span>
                  </div>
                </label>

                <label className="setting-item">
                  <input
                    type="checkbox"
                    checked={notificationSettings.sms}
                    onChange={() => handleNotificationToggle('sms')}
                  />
                  <span className="checkmark"></span>
                  <div className="setting-info">
                    <span className="setting-label">SMS Notifications</span>
                    <span className="setting-desc">Get text messages for urgent alerts</span>
                  </div>
                </label>
              </div>
            </div>

            <div className="settings-group">
              <h3>Alert Frequency</h3>
              <select 
                value={notificationSettings.frequency}
                onChange={(e) => handleSettingChange('frequency', e.target.value)}
                className="setting-select"
              >
                <option value="immediate">Immediate</option>
                <option value="hourly">Hourly Digest</option>
                <option value="daily">Daily Summary</option>
              </select>
            </div>

            <div className="settings-group">
              <h3>Minimum Severity Level</h3>
              <select 
                value={notificationSettings.severityLevel}
                onChange={(e) => handleSettingChange('severityLevel', e.target.value)}
                className="setting-select"
              >
                <option value="minor">All Alerts</option>
                <option value="moderate">Moderate and Above</option>
                <option value="severe">Severe and Extreme Only</option>
              </select>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="alerts-list"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h2>Current Alerts</h2>
          
          {alerts.length > 0 ? (
            <div className="alerts-container">
              {alerts.map((alert) => {
                const IconComponent = alert.icon;
                const SeverityIcon = getSeverityIcon(alert.severity);
                const isExpanded = expandedAlert === alert.id;
                
                return (
                  <div key={alert.id} className={`alert-card ${alert.severity}`}>
                    <div className="alert-header" onClick={() => toggleAlertExpansion(alert.id)}>
                      <div className="alert-main-info">
                        <div className="alert-icon" style={{ color: alert.color }}>
                          <IconComponent size={24} />
                        </div>
                        
                        <div className="alert-title-section">
                          <h3>{alert.title}</h3>
                          <p className="alert-description">{alert.description}</p>
                          
                          <div className="alert-meta">
                            <span className="alert-time">
                              <Clock size={14} />
                              Issued: {new Date(alert.issuedAt).toLocaleString()}
                            </span>
                            <span className="alert-urgency">
                              <SeverityIcon size={14} />
                              {alert.urgency}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="alert-controls">
                        <div className="severity-badge" style={{ backgroundColor: getSeverityColor(alert.severity) }}>
                          {alert.severity}
                        </div>
                        <button className="expand-btn">
                          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </button>
                      </div>
                    </div>

                    {isExpanded && (
                      <motion.div 
                        className="alert-details"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="details-grid">
                          <div className="detail-section">
                            <h4>Affected Areas</h4>
                            <ul>
                              {alert.areas.map((area, index) => (
                                <li key={index}>{area}</li>
                              ))}
                            </ul>
                          </div>

                          <div className="detail-section">
                            <h4>Safety Instructions</h4>
                            <ul>
                              {alert.instructions.map((instruction, index) => (
                                <li key={index}>{instruction}</li>
                              ))}
                            </ul>
                          </div>

                          <div className="detail-section">
                            <h4>Potential Impacts</h4>
                            <ul>
                              {alert.impacts.map((impact, index) => (
                                <li key={index}>{impact}</li>
                              ))}
                            </ul>
                          </div>

                          <div className="detail-section">
                            <h4>Alert Information</h4>
                            <div className="alert-info-grid">
                              <div className="info-item">
                                <span className="info-label">Source:</span>
                                <span className="info-value">{alert.source}</span>
                              </div>
                              <div className="info-item">
                                <span className="info-label">Expires:</span>
                                <span className="info-value">
                                  {new Date(alert.expiresAt).toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="alert-actions">
                          <button 
                            className="action-btn primary"
                            onClick={() => viewOnRadar(alert)}
                          >
                            <Eye size={16} />
                            View on Radar
                          </button>
                          <button 
                            className="action-btn secondary"
                            onClick={() => enableNotifications(alert)}
                          >
                            <Bell size={16} />
                            Get Notifications
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="no-alerts">
              <CheckCircle size={64} />
              <h3>No Active Alerts</h3>
              <p>There are currently no severe weather alerts for your area.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default SevereWeather;