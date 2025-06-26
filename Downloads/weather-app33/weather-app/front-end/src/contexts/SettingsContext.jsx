import { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext();

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    units: 'metric', // metric, imperial
    language: 'en',
    notifications: {
      weather: true,
      severe: true,
      daily: false,
      email: false
    },
    display: {
      theme: 'auto', // light, dark, auto
      animations: true,
      compactMode: false,
      showSeconds: false
    },
    location: {
      autoDetect: true,
      defaultLocation: null
    },
    privacy: {
      shareLocation: false,
      analytics: true,
      marketing: false
    }
  });

  useEffect(() => {
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const updateSettings = (newSettings) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    localStorage.setItem('appSettings', JSON.stringify(updatedSettings));
  };

  const resetSettings = () => {
    const defaultSettings = {
      units: 'metric',
      language: 'en',
      notifications: {
        weather: true,
        severe: true,
        daily: false,
        email: false
      },
      display: {
        theme: 'auto',
        animations: true,
        compactMode: false,
        showSeconds: false
      },
      location: {
        autoDetect: true,
        defaultLocation: null
      },
      privacy: {
        shareLocation: false,
        analytics: true,
        marketing: false
      }
    };
    
    setSettings(defaultSettings);
    localStorage.setItem('appSettings', JSON.stringify(defaultSettings));
  };

  const value = {
    settings,
    updateSettings,
    resetSettings
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};