import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Newspaper, 
  Calendar, 
  Clock, 
  ExternalLink, 
  Search,
  Filter,
  TrendingUp,
  AlertTriangle,
  Cloud,
  Sun
} from 'lucide-react';
import { format } from 'date-fns';
import './WeatherNews.scss';

const WeatherNews = () => {
  const [news, setNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateMockNews();
  }, []);

  useEffect(() => {
    filterNews();
  }, [news, searchTerm, selectedCategory]);

  const generateMockNews = () => {
    const categories = ['severe-weather', 'climate-change', 'forecasts', 'research', 'technology'];
    const mockNews = [
      {
        id: 1,
        title: 'Hurricane Season Outlook: Above-Normal Activity Expected',
        summary: 'NOAA predicts an above-normal Atlantic hurricane season with 14-21 named storms expected.',
        content: 'The National Oceanic and Atmospheric Administration (NOAA) has released its annual Atlantic hurricane season outlook, predicting above-normal activity for the upcoming season. Forecasters expect 14 to 21 named storms, with 6 to 11 becoming hurricanes and 2 to 5 developing into major hurricanes.',
        category: 'severe-weather',
        author: 'Weather Service',
        publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        imageUrl: 'https://images.pexels.com/photos/1446076/pexels-photo-1446076.jpeg',
        source: 'National Weather Service',
        readTime: '3 min read'
      },
      {
        id: 2,
        title: 'Climate Change Accelerating Arctic Ice Melt',
        summary: 'New research shows Arctic sea ice is melting at an unprecedented rate, affecting global weather patterns.',
        content: 'Scientists have documented the fastest rate of Arctic sea ice loss in recorded history. The accelerated melting is contributing to rising sea levels and altering global weather patterns, with implications for weather systems worldwide.',
        category: 'climate-change',
        author: 'Dr. Sarah Johnson',
        publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        imageUrl: 'https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg',
        source: 'Climate Research Institute',
        readTime: '5 min read'
      },
      {
        id: 3,
        title: 'AI Weather Forecasting Achieves New Accuracy Milestone',
        summary: 'Machine learning models now provide more accurate 10-day forecasts than traditional methods.',
        content: 'Artificial intelligence has revolutionized weather forecasting, with new machine learning models achieving unprecedented accuracy in 10-day weather predictions. These advances promise better preparation for extreme weather events.',
        category: 'technology',
        author: 'Tech Weather Team',
        publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        imageUrl: 'https://images.pexels.com/photos/355952/pexels-photo-355952.jpeg',
        source: 'Weather Technology Today',
        readTime: '4 min read'
      },
      {
        id: 4,
        title: 'Record-Breaking Heat Wave Sweeps Across Europe',
        summary: 'Temperatures soar above 40°C in multiple European countries, breaking century-old records.',
        content: 'A severe heat wave is affecting large parts of Europe, with temperatures reaching record-breaking levels. Multiple countries have issued health warnings as the extreme heat poses risks to vulnerable populations.',
        category: 'severe-weather',
        author: 'European Weather Center',
        publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        imageUrl: 'https://images.pexels.com/photos/1431822/pexels-photo-1431822.jpeg',
        source: 'European Meteorological Service',
        readTime: '3 min read'
      },
      {
        id: 5,
        title: 'New Satellite Technology Improves Storm Tracking',
        summary: 'Advanced weather satellites provide real-time data for better storm prediction and tracking.',
        content: 'The latest generation of weather satellites equipped with advanced sensors is providing meteorologists with unprecedented detail about developing storm systems, enabling more accurate predictions and earlier warnings.',
        category: 'technology',
        author: 'Space Weather Division',
        publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        imageUrl: 'https://images.pexels.com/photos/2159/flight-sky-earth-space.jpg',
        source: 'Satellite Weather Network',
        readTime: '4 min read'
      },
      {
        id: 6,
        title: 'Spring Weather Patterns Show Unusual Variability',
        summary: 'Meteorologists observe unprecedented variability in spring weather patterns across the globe.',
        content: 'This spring season has shown remarkable weather variability, with some regions experiencing unseasonably warm temperatures while others face late-season cold snaps and snow.',
        category: 'forecasts',
        author: 'Seasonal Forecast Team',
        publishedAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
        imageUrl: 'https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg',
        source: 'Global Weather Patterns',
        readTime: '3 min read'
      }
    ];

    setNews(mockNews);
    setLoading(false);
  };

  const filterNews = () => {
    let filtered = news;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(article => article.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.summary.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredNews(filtered);
  };

  const categories = [
    { id: 'all', name: 'All News', icon: Newspaper },
    { id: 'severe-weather', name: 'Severe Weather', icon: AlertTriangle },
    { id: 'climate-change', name: 'Climate Change', icon: TrendingUp },
    { id: 'forecasts', name: 'Forecasts', icon: Cloud },
    { id: 'technology', name: 'Technology', icon: Sun },
    { id: 'research', name: 'Research', icon: Search }
  ];

  const getCategoryColor = (category) => {
    const colors = {
      'severe-weather': '#dc3545',
      'climate-change': '#fd7e14',
      'forecasts': '#4A90E2',
      'technology': '#28a745',
      'research': '#6f42c1'
    };
    return colors[category] || '#6c757d';
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return format(date, 'MMM dd, yyyy');
  };

  if (loading) {
    return (
      <div className="weather-news">
        <div className="loading-content">
          <div className="spinner"></div>
          <p>Loading weather news...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="weather-news">
      <div className="news-container">
        <motion.div 
          className="news-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="header-content">
            <div className="header-info">
              <h1>
                <Newspaper size={32} />
                Weather News
              </h1>
              <p>Stay updated with the latest weather news, research, and forecasts</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="news-filters"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="search-section">
            <div className="search-input-group">
              <Search className="search-icon" size={20} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search news articles..."
                className="search-input"
              />
            </div>
          </div>

          <div className="category-filters">
            <div className="filter-label">
              <Filter size={16} />
              Categories
            </div>
            <div className="category-buttons">
              {categories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <button
                    key={category.id}
                    className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <IconComponent size={16} />
                    <span>{category.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="news-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {filteredNews.length > 0 ? (
            <>
              {/* Featured Article */}
              <div className="featured-article">
                <div className="featured-content">
                  <div className="featured-image">
                    <img src={filteredNews[0].imageUrl} alt={filteredNews[0].title} />
                    <div className="category-badge" style={{ backgroundColor: getCategoryColor(filteredNews[0].category) }}>
                      {categories.find(cat => cat.id === filteredNews[0].category)?.name}
                    </div>
                  </div>
                  
                  <div className="featured-info">
                    <h2>{filteredNews[0].title}</h2>
                    <p className="featured-summary">{filteredNews[0].summary}</p>
                    
                    <div className="article-meta">
                      <div className="meta-item">
                        <Calendar size={14} />
                        <span>{formatTimeAgo(filteredNews[0].publishedAt)}</span>
                      </div>
                      <div className="meta-item">
                        <Clock size={14} />
                        <span>{filteredNews[0].readTime}</span>
                      </div>
                      <div className="meta-item">
                        <span>By {filteredNews[0].author}</span>
                      </div>
                    </div>
                    
                    <button className="read-more-btn">
                      Read Full Article
                      <ExternalLink size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* News Grid */}
              <div className="news-grid">
                {filteredNews.slice(1).map((article) => (
                  <div key={article.id} className="news-card">
                    <div className="card-image">
                      <img src={article.imageUrl} alt={article.title} />
                      <div className="category-badge" style={{ backgroundColor: getCategoryColor(article.category) }}>
                        {categories.find(cat => cat.id === article.category)?.name}
                      </div>
                    </div>
                    
                    <div className="card-content">
                      <h3>{article.title}</h3>
                      <p className="card-summary">{article.summary}</p>
                      
                      <div className="card-meta">
                        <div className="meta-row">
                          <span className="author">By {article.author}</span>
                          <span className="read-time">{article.readTime}</span>
                        </div>
                        <div className="meta-row">
                          <span className="source">{article.source}</span>
                          <span className="publish-time">{formatTimeAgo(article.publishedAt)}</span>
                        </div>
                      </div>
                      
                      <button className="card-read-btn">
                        Read Article
                        <ExternalLink size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="no-results">
              <Search size={64} />
              <h3>No articles found</h3>
              <p>Try adjusting your search terms or category filters.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default WeatherNews;