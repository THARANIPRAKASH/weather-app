import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Eye, 
  MapPin, 
  Shield, 
  Palette,
  Globe,
  Thermometer,
  Save,
  RotateCcw
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useSettings } from '../../contexts/SettingsContext.jsx';
import toast from 'react-hot-toast';
import './Settings.scss';

const Settings = () => {
  const { user, updateUser } = useAuth();
  const { settings, updateSettings, resetSettings } = useSettings();
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
    location: user?.location || ''
  });

  const handleProfileSave = () => {
    updateUser(profileData);
    toast.success('Profile updated successfully!');
  };

  const handleSettingsChange = (category, key, value) => {
    const newSettings = {
      ...settings,
      [category]: {
        ...settings[category],
        [key]: value
      }
    };
    updateSettings(newSettings);
  };

  const handleResetSettings = () => {
    resetSettings();
    toast.success('Settings reset to defaults!');
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'display', label: 'Display', icon: Eye },
    { id: 'location', label: 'Location', icon: MapPin },
    { id: 'privacy', label: 'Privacy', icon: Shield }
  ];

  return (
    <div className="settings-page">
      <div className="settings-container">
        <motion.div 
          className="settings-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="header-content">
            <div className="header-info">
              <h1>
                <SettingsIcon size={32} />
                Settings
              </h1>
              <p>Customize your WeatherPro experience</p>
            </div>
            
            <div className="header-actions">
              <button onClick={handleResetSettings} className="btn btn-secondary">
                <RotateCcw size={18} />
                Reset to Defaults
              </button>
            </div>
          </div>
        </motion.div>

        <div className="settings-content">
          <motion.div 
            className="settings-sidebar"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="tab-list">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <IconComponent size={20} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>

          <motion.div 
            className="settings-main"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {activeTab === 'profile' && (
              <div className="settings-section">
                <div className="section-header">
                  <h2>
                    <User size={24} />
                    Profile Information
                  </h2>
                  <p>Update your personal information and preferences</p>
                </div>

                <div className="profile-form">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="form-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      placeholder="Enter your email"
                    />
                  </div>

                  <div className="form-group">
                    <label>Location</label>
                    <input
                      type="text"
                      value={profileData.location}
                      onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                      placeholder="Enter your location"
                    />
                  </div>

                  <div className="form-group">
                    <label>Bio</label>
                    <textarea
                      value={profileData.bio}
                      onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                      placeholder="Tell us about yourself..."
                      rows="4"
                    />
                  </div>

                  <button onClick={handleProfileSave} className="btn btn-primary">
                    <Save size={18} />
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="settings-section">
                <div className="section-header">
                  <h2>
                    <Bell size={24} />
                    Notification Preferences
                  </h2>
                  <p>Choose how and when you want to receive notifications</p>
                </div>

                <div className="settings-groups">
                  <div className="settings-group">
                    <h3>Weather Notifications</h3>
                    <div className="setting-item">
                      <div className="setting-info">
                        <span className="setting-label">Weather Updates</span>
                        <span className="setting-desc">Get notified about weather changes</span>
                      </div>
                      <label className="toggle">
                        <input
                          type="checkbox"
                          checked={settings.notifications.weather}
                          onChange={(e) => handleSettingsChange('notifications', 'weather', e.target.checked)}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>

                    <div className="setting-item">
                      <div className="setting-info">
                        <span className="setting-label">Severe Weather Alerts</span>
                        <span className="setting-desc">Important alerts for severe weather conditions</span>
                      </div>
                      <label className="toggle">
                        <input
                          type="checkbox"
                          checked={settings.notifications.severe}
                          onChange={(e) => handleSettingsChange('notifications', 'severe', e.target.checked)}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>

                    <div className="setting-item">
                      <div className="setting-info">
                        <span className="setting-label">Daily Weather Summary</span>
                        <span className="setting-desc">Daily weather forecast summary</span>
                      </div>
                      <label className="toggle">
                        <input
                          type="checkbox"
                          checked={settings.notifications.daily}
                          onChange={(e) => handleSettingsChange('notifications', 'daily', e.target.checked)}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                  </div>

                  <div className="settings-group">
                    <h3>Delivery Methods</h3>
                    <div className="setting-item">
                      <div className="setting-info">
                        <span className="setting-label">Email Notifications</span>
                        <span className="setting-desc">Receive notifications via email</span>
                      </div>
                      <label className="toggle">
                        <input
                          type="checkbox"
                          checked={settings.notifications.email}
                          onChange={(e) => handleSettingsChange('notifications', 'email', e.target.checked)}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'display' && (
              <div className="settings-section">
                <div className="section-header">
                  <h2>
                    <Eye size={24} />
                    Display Settings
                  </h2>
                  <p>Customize the appearance and behavior of the interface</p>
                </div>

                <div className="settings-groups">
                  <div className="settings-group">
                    <h3>
                      <Palette size={18} />
                      Appearance
                    </h3>
                    
                    <div className="setting-item">
                      <div className="setting-info">
                        <span className="setting-label">Theme</span>
                        <span className="setting-desc">Choose your preferred theme</span>
                      </div>
                      <select
                        value={settings.display.theme}
                        onChange={(e) => handleSettingsChange('display', 'theme', e.target.value)}
                        className="setting-select"
                      >
                        <option value="auto">Auto</option>
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                      </select>
                    </div>

                    <div className="setting-item">
                      <div className="setting-info">
                        <span className="setting-label">Animations</span>
                        <span className="setting-desc">Enable smooth animations and transitions</span>
                      </div>
                      <label className="toggle">
                        <input
                          type="checkbox"
                          checked={settings.display.animations}
                          onChange={(e) => handleSettingsChange('display', 'animations', e.target.checked)}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>

                    <div className="setting-item">
                      <div className="setting-info">
                        <span className="setting-label">Compact Mode</span>
                        <span className="setting-desc">Use a more compact layout</span>
                      </div>
                      <label className="toggle">
                        <input
                          type="checkbox"
                          checked={settings.display.compactMode}
                          onChange={(e) => handleSettingsChange('display', 'compactMode', e.target.checked)}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                  </div>

                  <div className="settings-group">
                    <h3>
                      <Thermometer size={18} />
                      Units
                    </h3>
                    
                    <div className="setting-item">
                      <div className="setting-info">
                        <span className="setting-label">Temperature Unit</span>
                        <span className="setting-desc">Choose temperature display unit</span>
                      </div>
                      <select
                        value={settings.units}
                        onChange={(e) => updateSettings({...settings, units: e.target.value})}
                        className="setting-select"
                      >
                        <option value="metric">Celsius (°C)</option>
                        <option value="imperial">Fahrenheit (°F)</option>
                      </select>
                    </div>

                    <div className="setting-item">
                      <div className="setting-info">
                        <span className="setting-label">Show Seconds</span>
                        <span className="setting-desc">Display seconds in time formats</span>
                      </div>
                      <label className="toggle">
                        <input
                          type="checkbox"
                          checked={settings.display.showSeconds}
                          onChange={(e) => handleSettingsChange('display', 'showSeconds', e.target.checked)}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'location' && (
              <div className="settings-section">
                <div className="section-header">
                  <h2>
                    <MapPin size={24} />
                    Location Settings
                  </h2>
                  <p>Manage your location preferences and default locations</p>
                </div>

                <div className="settings-groups">
                  <div className="settings-group">
                    <h3>Location Detection</h3>
                    
                    <div className="setting-item">
                      <div className="setting-info">
                        <span className="setting-label">Auto-detect Location</span>
                        <span className="setting-desc">Automatically detect your current location</span>
                      </div>
                      <label className="toggle">
                        <input
                          type="checkbox"
                          checked={settings.location.autoDetect}
                          onChange={(e) => handleSettingsChange('location', 'autoDetect', e.target.checked)}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>

                    <div className="setting-item">
                      <div className="setting-info">
                        <span className="setting-label">Default Location</span>
                        <span className="setting-desc">Set a default location when auto-detect is disabled</span>
                      </div>
                      <input
                        type="text"
                        value={settings.location.defaultLocation || ''}
                        onChange={(e) => handleSettingsChange('location', 'defaultLocation', e.target.value)}
                        placeholder="Enter default location"
                        className="setting-input"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="settings-section">
                <div className="section-header">
                  <h2>
                    <Shield size={24} />
                    Privacy & Security
                  </h2>
                  <p>Control your privacy settings and data sharing preferences</p>
                </div>

                <div className="settings-groups">
                  <div className="settings-group">
                    <h3>Data Sharing</h3>
                    
                    <div className="setting-item">
                      <div className="setting-info">
                        <span className="setting-label">Share Location Data</span>
                        <span className="setting-desc">Allow sharing of location data for improved services</span>
                      </div>
                      <label className="toggle">
                        <input
                          type="checkbox"
                          checked={settings.privacy.shareLocation}
                          onChange={(e) => handleSettingsChange('privacy', 'shareLocation', e.target.checked)}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>

                    <div className="setting-item">
                      <div className="setting-info">
                        <span className="setting-label">Analytics</span>
                        <span className="setting-desc">Help improve our service by sharing usage analytics</span>
                      </div>
                      <label className="toggle">
                        <input
                          type="checkbox"
                          checked={settings.privacy.analytics}
                          onChange={(e) => handleSettingsChange('privacy', 'analytics', e.target.checked)}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>

                    <div className="setting-item">
                      <div className="setting-info">
                        <span className="setting-label">Marketing Communications</span>
                        <span className="setting-desc">Receive marketing emails and promotional content</span>
                      </div>
                      <label className="toggle">
                        <input
                          type="checkbox"
                          checked={settings.privacy.marketing}
                          onChange={(e) => handleSettingsChange('privacy', 'marketing', e.target.checked)}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Settings;