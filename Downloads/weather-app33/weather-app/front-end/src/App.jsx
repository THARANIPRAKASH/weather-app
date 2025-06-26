import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Sun, Moon } from 'lucide-react';
import Header from './components/Header/Header.jsx';
import WeatherDashboard from './components/WeatherDashboard/WeatherDashboard.jsx';
import LoginPage from './components/Auth/LoginPage.jsx';
import SignupPage from './components/Auth/SignupPage.jsx';
import ProfilePage from './components/Profile/ProfilePage.jsx';
import WeatherMaps from './components/WeatherMaps/WeatherMaps.jsx';
import WeatherHistory from './components/WeatherHistory/WeatherHistory.jsx';
import WeatherComparison from './components/WeatherComparison/WeatherComparison.jsx';
import AirQuality from './components/AirQuality/AirQuality.jsx';
import WeatherNews from './components/WeatherNews/WeatherNews.jsx';
import SevereWeather from './components/SevereWeather/SevereWeather.jsx';
import WeatherRadar from './components/WeatherRadar/WeatherRadar.jsx';
import ClimateData from './components/ClimateData/ClimateData.jsx';
import WeatherAPI from './components/WeatherAPI/WeatherAPI.jsx';
import Settings from './components/Settings/Settings.jsx';
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';
import { WeatherProvider } from './contexts/WeatherContext.jsx';
import { SettingsProvider } from './contexts/SettingsContext.jsx';
import './styles/App.scss';

function AppContent() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    }
    
    setTimeout(() => setLoading(false), 1500);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <h2>Loading WeatherPro...</h2>
          <p>Preparing your personalized weather experience</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`app ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
      <button className="theme-toggle" onClick={toggleTheme}>
        {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
      </button>
      
      <Header />
      
      <Routes>
        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/signup" element={!user ? <SignupPage /> : <Navigate to="/" />} />
        <Route path="/" element={<WeatherDashboard isDarkMode={isDarkMode} />} />
        <Route path="/profile" element={user ? <ProfilePage /> : <Navigate to="/login" />} />
        <Route path="/maps" element={<WeatherMaps isDarkMode={isDarkMode} />} />
        <Route path="/history" element={<WeatherHistory />} />
        <Route path="/compare" element={<WeatherComparison />} />
        <Route path="/air-quality" element={<AirQuality />} />
        <Route path="/news" element={<WeatherNews />} />
        <Route path="/severe-weather" element={<SevereWeather />} />
        <Route path="/radar" element={<WeatherRadar isDarkMode={isDarkMode} />} />
        <Route path="/climate" element={<ClimateData />} />
        <Route path="/api" element={<WeatherAPI />} />
        <Route path="/settings" element={user ? <Settings /> : <Navigate to="/login" />} />
      </Routes>
      
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          },
        }}
      />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <SettingsProvider>
          <WeatherProvider>
            <AppContent />
          </WeatherProvider>
        </SettingsProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;