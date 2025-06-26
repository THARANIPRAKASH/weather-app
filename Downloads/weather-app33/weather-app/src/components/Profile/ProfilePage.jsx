import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Calendar, 
  MapPin, 
  Settings, 
  Heart, 
  History, 
  BarChart3,
  Camera,
  Edit3,
  Save,
  X
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useWeather } from '../../contexts/WeatherContext.jsx';
import toast from 'react-hot-toast';
import './ProfilePage.scss';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const { favorites, weatherHistory } = useWeather();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
    location: user?.location || ''
  });

  const handleSave = () => {
    updateUser(editData);
    setIsEditing(false);
    toast.success('Profile updated successfully!');
  };

  const handleCancel = () => {
    setEditData({
      name: user?.name || '',
      email: user?.email || '',
      bio: user?.bio || '',
      location: user?.location || ''
    });
    setIsEditing(false);
  };

  const stats = [
    {
      label: 'Favorite Locations',
      value: favorites.length,
      icon: Heart,
      color: '#ff6b6b'
    },
    {
      label: 'Weather Searches',
      value: weatherHistory.length,
      icon: History,
      color: '#4ecdc4'
    },
    {
      label: 'Days Active',
      value: user ? Math.floor((new Date() - new Date(user.joinedAt)) / (1000 * 60 * 60 * 24)) : 0,
      icon: Calendar,
      color: '#45b7d1'
    },
    {
      label: 'Subscription',
      value: user?.subscription || 'Free',
      icon: BarChart3,
      color: '#96ceb4'
    }
  ];

  return (
    <div className="profile-page">
      <div className="profile-container">
        <motion.div 
          className="profile-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="profile-avatar-section">
            <div className="avatar-container">
              <img src={user?.avatar} alt={user?.name} className="profile-avatar" />
              <button className="avatar-edit-btn">
                <Camera size={16} />
              </button>
            </div>
            
            <div className="profile-info">
              {isEditing ? (
                <div className="edit-form">
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) => setEditData({...editData, name: e.target.value})}
                    className="edit-input name-input"
                    placeholder="Full Name"
                  />
                  <input
                    type="email"
                    value={editData.email}
                    onChange={(e) => setEditData({...editData, email: e.target.value})}
                    className="edit-input"
                    placeholder="Email"
                  />
                  <input
                    type="text"
                    value={editData.location}
                    onChange={(e) => setEditData({...editData, location: e.target.value})}
                    className="edit-input"
                    placeholder="Location"
                  />
                  <textarea
                    value={editData.bio}
                    onChange={(e) => setEditData({...editData, bio: e.target.value})}
                    className="edit-input bio-input"
                    placeholder="Tell us about yourself..."
                    rows="3"
                  />
                </div>
              ) : (
                <>
                  <h1>{user?.name}</h1>
                  <p className="email">{user?.email}</p>
                  {user?.location && (
                    <p className="location">
                      <MapPin size={16} />
                      {user.location}
                    </p>
                  )}
                  {user?.bio && <p className="bio">{user.bio}</p>}
                  <p className="join-date">
                    <Calendar size={16} />
                    Joined {new Date(user?.joinedAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long' 
                    })}
                  </p>
                </>
              )}
            </div>
          </div>

          <div className="profile-actions">
            {isEditing ? (
              <div className="edit-actions">
                <button onClick={handleSave} className="btn btn-primary">
                  <Save size={16} />
                  Save Changes
                </button>
                <button onClick={handleCancel} className="btn btn-secondary">
                  <X size={16} />
                  Cancel
                </button>
              </div>
            ) : (
              <button onClick={() => setIsEditing(true)} className="btn btn-primary">
                <Edit3 size={16} />
                Edit Profile
              </button>
            )}
          </div>
        </motion.div>

        <motion.div 
          className="profile-stats"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="stat-card">
                <div className="stat-icon" style={{ color: stat.color }}>
                  <IconComponent size={24} />
                </div>
                <div className="stat-content">
                  <h3>{stat.value}</h3>
                  <p>{stat.label}</p>
                </div>
              </div>
            );
          })}
        </motion.div>

        <div className="profile-content">
          <motion.div 
            className="favorites-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2>
              <Heart size={20} />
              Favorite Locations
            </h2>
            {favorites.length > 0 ? (
              <div className="favorites-grid">
                {favorites.slice(0, 6).map((favorite) => (
                  <div key={favorite.id} className="favorite-card">
                    <h4>{favorite.name}</h4>
                    <p>{favorite.country}</p>
                    <span className="added-date">
                      Added {new Date(favorite.addedAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <Heart size={48} />
                <h3>No favorite locations yet</h3>
                <p>Start exploring weather data and save your favorite places!</p>
              </div>
            )}
          </motion.div>

          <motion.div 
            className="activity-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h2>
              <History size={20} />
              Recent Activity
            </h2>
            {weatherHistory.length > 0 ? (
              <div className="activity-list">
                {weatherHistory.slice(0, 10).map((activity) => (
                  <div key={activity.id} className="activity-item">
                    <div className="activity-icon">
                      <img 
                        src={`https://openweathermap.org/img/wn/${activity.weather.icon}@2x.png`}
                        alt={activity.weather.description}
                      />
                    </div>
                    <div className="activity-content">
                      <h4>{activity.location}, {activity.country}</h4>
                      <p>{activity.weather.description} • {Math.round(activity.temp)}°C</p>
                      <span className="activity-time">
                        {new Date(activity.timestamp).toLocaleDateString()} at{' '}
                        {new Date(activity.timestamp).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <History size={48} />
                <h3>No recent activity</h3>
                <p>Your weather search history will appear here.</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;