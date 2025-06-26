import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Cloud, 
  Menu, 
  X, 
  User, 
  Settings, 
  LogOut,
  Map,
  History,
  BarChart3,
  Wind,
  Newspaper,
  AlertTriangle,
  Radar,
  Globe,
  Code,
  Heart
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import './Header.scss';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsProfileOpen(false);
  };

  const navigationItems = [
    { path: '/', label: 'Dashboard', icon: Cloud },
    { path: '/maps', label: 'Maps', icon: Map },
    { path: '/radar', label: 'Radar', icon: Radar },
    { path: '/air-quality', label: 'Air Quality', icon: Wind },
    { path: '/severe-weather', label: 'Alerts', icon: AlertTriangle },
    { path: '/history', label: 'History', icon: History },
    { path: '/compare', label: 'Compare', icon: BarChart3 },
    { path: '/climate', label: 'Climate', icon: Globe },
    { path: '/news', label: 'News', icon: Newspaper },
    { path: '/api', label: 'API', icon: Code }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          <Cloud size={32} />
          <h1>WeatherPro</h1>
        </Link>

        {/* Desktop Navigation */}
        <nav className="nav desktop-nav">
          {navigationItems.slice(0, 6).map((item) => {
            const IconComponent = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
              >
                <IconComponent size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
          
          {/* More Menu */}
          <div className="nav-dropdown">
            <button className="nav-link dropdown-trigger">
              More
            </button>
            <div className="dropdown-menu">
              {navigationItems.slice(6).map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`dropdown-item ${isActive(item.path) ? 'active' : ''}`}
                  >
                    <IconComponent size={18} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>

        {/* User Menu */}
        <div className="user-menu">
          {user ? (
            <div className="profile-dropdown">
              <button 
                className="profile-trigger"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                <img src={user.avatar} alt={user.name} className="avatar" />
                <span className="user-name">{user.name}</span>
              </button>
              
              {isProfileOpen && (
                <motion.div 
                  className="profile-menu"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="profile-header">
                    <img src={user.avatar} alt={user.name} className="avatar-large" />
                    <div>
                      <h4>{user.name}</h4>
                      <p>{user.email}</p>
                      <span className="subscription-badge">{user.subscription}</span>
                    </div>
                  </div>
                  
                  <div className="profile-menu-items">
                    <Link to="/profile" className="profile-menu-item">
                      <User size={18} />
                      <span>Profile</span>
                    </Link>
                    <Link to="/settings" className="profile-menu-item">
                      <Settings size={18} />
                      <span>Settings</span>
                    </Link>
                    <Link to="/favorites" className="profile-menu-item">
                      <Heart size={18} />
                      <span>Favorites</span>
                    </Link>
                    <button onClick={handleLogout} className="profile-menu-item logout">
                      <LogOut size={18} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-ghost">Sign In</Link>
              <Link to="/signup" className="btn btn-primary">Sign Up</Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="mobile-menu-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <motion.nav 
          className="mobile-nav"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <div className="mobile-nav-content">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`mobile-nav-link ${isActive(item.path) ? 'active' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <IconComponent size={20} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            
            {!user && (
              <div className="mobile-auth-buttons">
                <Link to="/login" className="btn btn-ghost" onClick={() => setIsMenuOpen(false)}>
                  Sign In
                </Link>
                <Link to="/signup" className="btn btn-primary" onClick={() => setIsMenuOpen(false)}>
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </motion.nav>
      )}
    </header>
  );
};

export default Header;