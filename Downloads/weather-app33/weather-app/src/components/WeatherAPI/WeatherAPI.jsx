import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Code, 
  Copy, 
  Check, 
  Play, 
  Book, 
  Key,
  Globe,
  Zap,
  Shield,
  BarChart3
} from 'lucide-react';
import toast from 'react-hot-toast';
import './WeatherAPI.scss';

const WeatherAPI = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [copiedCode, setCopiedCode] = useState(null);
  const [apiResponse, setApiResponse] = useState(null);

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    toast.success('Code copied to clipboard!');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const runExample = (endpoint) => {
    // Mock API response
    const mockResponse = {
      current: {
        location: "London, UK",
        temperature: 22.5,
        description: "Partly cloudy",
        humidity: 65,
        windSpeed: 3.6,
        timestamp: new Date().toISOString()
      },
      forecast: [
        { date: "2024-01-01", temp: 20, description: "Sunny" },
        { date: "2024-01-02", temp: 18, description: "Cloudy" },
        { date: "2024-01-03", temp: 25, description: "Clear" }
      ]
    };

    setApiResponse(mockResponse);
    toast.success('API request executed successfully!');
  };

  const codeExamples = {
    javascript: `// Get current weather
const response = await fetch('https://api.weatherpro.com/v1/current?lat=51.5074&lon=-0.1278', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
});

const weatherData = await response.json();
console.log(weatherData);`,

    python: `import requests

# Get current weather
url = "https://api.weatherpro.com/v1/current"
params = {
    "lat": 51.5074,
    "lon": -0.1278
}
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
}

response = requests.get(url, params=params, headers=headers)
weather_data = response.json()
print(weather_data)`,

    curl: `# Get current weather
curl -X GET "https://api.weatherpro.com/v1/current?lat=51.5074&lon=-0.1278" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`
  };

  const endpoints = [
    {
      method: 'GET',
      path: '/v1/current',
      description: 'Get current weather conditions',
      params: ['lat', 'lon', 'units'],
      example: 'https://api.weatherpro.com/v1/current?lat=51.5074&lon=-0.1278&units=metric'
    },
    {
      method: 'GET',
      path: '/v1/forecast',
      description: 'Get weather forecast (up to 7 days)',
      params: ['lat', 'lon', 'days', 'units'],
      example: 'https://api.weatherpro.com/v1/forecast?lat=51.5074&lon=-0.1278&days=5'
    },
    {
      method: 'GET',
      path: '/v1/history',
      description: 'Get historical weather data',
      params: ['lat', 'lon', 'start_date', 'end_date'],
      example: 'https://api.weatherpro.com/v1/history?lat=51.5074&lon=-0.1278&start_date=2024-01-01'
    },
    {
      method: 'GET',
      path: '/v1/alerts',
      description: 'Get severe weather alerts',
      params: ['lat', 'lon', 'severity'],
      example: 'https://api.weatherpro.com/v1/alerts?lat=51.5074&lon=-0.1278'
    }
  ];

  const features = [
    {
      icon: Globe,
      title: 'Global Coverage',
      description: 'Weather data for any location worldwide with high accuracy'
    },
    {
      icon: Zap,
      title: 'Real-time Data',
      description: 'Live weather updates with sub-minute latency'
    },
    {
      icon: Shield,
      title: 'Reliable & Secure',
      description: '99.9% uptime with enterprise-grade security'
    },
    {
      icon: BarChart3,
      title: 'Rich Analytics',
      description: 'Detailed weather metrics and historical trends'
    }
  ];

  const pricingPlans = [
    {
      name: 'Free',
      price: '$0',
      requests: '1,000/month',
      features: ['Current weather', 'Basic forecast', 'Community support']
    },
    {
      name: 'Developer',
      price: '$29',
      requests: '100,000/month',
      features: ['All endpoints', 'Historical data', 'Email support', 'Analytics dashboard']
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      requests: 'Unlimited',
      features: ['Custom endpoints', 'SLA guarantee', 'Dedicated support', 'White-label options']
    }
  ];

  return (
    <div className="weather-api">
      <div className="api-container">
        <motion.div 
          className="api-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="header-content">
            <div className="header-info">
              <h1>
                <Code size={32} />
                WeatherPro API
              </h1>
              <p>Powerful weather data API for developers. Get real-time weather, forecasts, and historical data.</p>
            </div>
            
            <div className="header-actions">
              <button className="btn btn-primary">
                <Key size={18} />
                Get API Key
              </button>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="api-tabs"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="tab-buttons">
            {['overview', 'documentation', 'examples', 'pricing'].map((tab) => (
              <button
                key={tab}
                className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </motion.div>

        <div className="api-content">
          {activeTab === 'overview' && (
            <motion.div 
              className="overview-content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="features-grid">
                {features.map((feature, index) => {
                  const IconComponent = feature.icon;
                  return (
                    <div key={index} className="feature-card">
                      <div className="feature-icon">
                        <IconComponent size={24} />
                      </div>
                      <h3>{feature.title}</h3>
                      <p>{feature.description}</p>
                    </div>
                  );
                })}
              </div>

              <div className="quick-start">
                <h2>Quick Start</h2>
                <div className="quick-start-steps">
                  <div className="step">
                    <div className="step-number">1</div>
                    <div className="step-content">
                      <h3>Get Your API Key</h3>
                      <p>Sign up for a free account and get your API key instantly</p>
                    </div>
                  </div>
                  <div className="step">
                    <div className="step-number">2</div>
                    <div className="step-content">
                      <h3>Make Your First Request</h3>
                      <p>Use our simple REST API to get weather data</p>
                    </div>
                  </div>
                  <div className="step">
                    <div className="step-number">3</div>
                    <div className="step-content">
                      <h3>Build Amazing Apps</h3>
                      <p>Integrate weather data into your applications</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'documentation' && (
            <motion.div 
              className="documentation-content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="doc-section">
                <h2>
                  <Book size={20} />
                  API Endpoints
                </h2>
                <div className="endpoints-list">
                  {endpoints.map((endpoint, index) => (
                    <div key={index} className="endpoint-card">
                      <div className="endpoint-header">
                        <span className={`method ${endpoint.method.toLowerCase()}`}>
                          {endpoint.method}
                        </span>
                        <code className="endpoint-path">{endpoint.path}</code>
                        <button 
                          className="try-btn"
                          onClick={() => runExample(endpoint.path)}
                        >
                          <Play size={14} />
                          Try it
                        </button>
                      </div>
                      
                      <p className="endpoint-description">{endpoint.description}</p>
                      
                      <div className="endpoint-params">
                        <h4>Parameters:</h4>
                        <div className="params-list">
                          {endpoint.params.map((param, i) => (
                            <span key={i} className="param-tag">{param}</span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="endpoint-example">
                        <h4>Example:</h4>
                        <code>{endpoint.example}</code>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="doc-section">
                <h2>Authentication</h2>
                <div className="auth-info">
                  <p>All API requests require authentication using your API key in the Authorization header:</p>
                  <div className="code-block">
                    <code>Authorization: Bearer YOUR_API_KEY</code>
                    <button 
                      className="copy-btn"
                      onClick={() => copyToClipboard('Authorization: Bearer YOUR_API_KEY', 'auth')}
                    >
                      {copiedCode === 'auth' ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              {apiResponse && (
                <div className="doc-section">
                  <h2>API Response</h2>
                  <div className="response-block">
                    <pre>{JSON.stringify(apiResponse, null, 2)}</pre>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'examples' && (
            <motion.div 
              className="examples-content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="code-examples">
                <div className="example-section">
                  <h3>JavaScript</h3>
                  <div className="code-block">
                    <pre><code>{codeExamples.javascript}</code></pre>
                    <button 
                      className="copy-btn"
                      onClick={() => copyToClipboard(codeExamples.javascript, 'js')}
                    >
                      {copiedCode === 'js' ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>

                <div className="example-section">
                  <h3>Python</h3>
                  <div className="code-block">
                    <pre><code>{codeExamples.python}</code></pre>
                    <button 
                      className="copy-btn"
                      onClick={() => copyToClipboard(codeExamples.python, 'python')}
                    >
                      {copiedCode === 'python' ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>

                <div className="example-section">
                  <h3>cURL</h3>
                  <div className="code-block">
                    <pre><code>{codeExamples.curl}</code></pre>
                    <button 
                      className="copy-btn"
                      onClick={() => copyToClipboard(codeExamples.curl, 'curl')}
                    >
                      {copiedCode === 'curl' ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'pricing' && (
            <motion.div 
              className="pricing-content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="pricing-header">
                <h2>Choose Your Plan</h2>
                <p>Start free and scale as you grow</p>
              </div>

              <div className="pricing-grid">
                {pricingPlans.map((plan, index) => (
                  <div key={index} className={`pricing-card ${index === 1 ? 'featured' : ''}`}>
                    {index === 1 && <div className="featured-badge">Most Popular</div>}
                    
                    <h3>{plan.name}</h3>
                    <div className="price">
                      <span className="price-amount">{plan.price}</span>
                      {plan.price !== 'Custom' && <span className="price-period">/month</span>}
                    </div>
                    
                    <div className="requests">{plan.requests}</div>
                    
                    <ul className="features-list">
                      {plan.features.map((feature, i) => (
                        <li key={i}>
                          <Check size={16} />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    
                    <button className={`plan-btn ${index === 1 ? 'btn-primary' : 'btn-secondary'}`}>
                      {plan.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeatherAPI;