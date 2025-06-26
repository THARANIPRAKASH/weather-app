const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || 'demo';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// For demo purposes, we'll use a demo API key that has limited functionality
// Users should replace this with their own OpenWeatherMap API key
const DEMO_WEATHER_DATA = {
  coord: { lon: -0.09, lat: 51.51 },
  weather: [
    {
      id: 801,
      main: "Clouds",
      description: "few clouds",
      icon: "02d"
    }
  ],
  base: "stations",
  main: {
    temp: 22.5,
    feels_like: 22.3,
    temp_min: 20.1,
    temp_max: 24.8,
    pressure: 1013,
    humidity: 65
  },
  visibility: 10000,
  wind: {
    speed: 3.6,
    deg: 250
  },
  clouds: {
    all: 20
  },
  dt: 1640995200,
  sys: {
    type: 2,
    id: 2019646,
    country: "GB",
    sunrise: 1640936400,
    sunset: 1640968800
  },
  timezone: 0,
  id: 2643743,
  name: "London",
  cod: 200
};

const DEMO_FORECAST_DATA = {
  list: Array.from({ length: 40 }, (_, i) => ({
    dt: 1640995200 + (i * 3 * 60 * 60),
    main: {
      temp: 22.5 + Math.random() * 10 - 5,
      feels_like: 22.3 + Math.random() * 10 - 5,
      temp_min: 20.1 + Math.random() * 5 - 2,
      temp_max: 24.8 + Math.random() * 5 - 2,
      pressure: 1013 + Math.random() * 20 - 10,
      humidity: 65 + Math.random() * 20 - 10
    },
    weather: [
      {
        id: 801,
        main: ["Clear", "Clouds", "Rain"][Math.floor(Math.random() * 3)],
        description: ["clear sky", "few clouds", "light rain"][Math.floor(Math.random() * 3)],
        icon: ["01d", "02d", "10d"][Math.floor(Math.random() * 3)]
      }
    ],
    wind: {
      speed: 3.6 + Math.random() * 5 - 2.5,
      deg: 250 + Math.random() * 60 - 30
    }
  })),
  city: {
    id: 2643743,
    name: "London",
    country: "GB",
    coord: { lat: 51.51, lon: -0.09 }
  }
};

export const weatherService = {
  async getCurrentWeather(lat, lon) {
    try {
      if (API_KEY === 'demo') {
        // Return demo data with location-based variations
        return {
          ...DEMO_WEATHER_DATA,
          coord: { lat, lon },
          main: {
            ...DEMO_WEATHER_DATA.main,
            temp: 22.5 + (lat - 51) * 0.5 + Math.random() * 5 - 2.5
          }
        };
      }

      const response = await fetch(
        `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching current weather:', error);
      throw error;
    }
  },

  async getForecast(lat, lon) {
    try {
      if (API_KEY === 'demo') {
        return {
          ...DEMO_FORECAST_DATA,
          city: {
            ...DEMO_FORECAST_DATA.city,
            coord: { lat, lon }
          }
        };
      }

      const response = await fetch(
        `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error(`Forecast API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching forecast:', error);
      throw error;
    }
  },

  async getLocationByCity(city) {
    try {
      if (API_KEY === 'demo') {
        // Return demo coordinates for common cities
        const demoLocations = {
          'london': { lat: 51.5074, lon: -0.1278 },
          'paris': { lat: 48.8566, lon: 2.3522 },
          'new york': { lat: 40.7128, lon: -74.0060 },
          'tokyo': { lat: 35.6762, lon: 139.6503 },
          'sydney': { lat: -33.8688, lon: 151.2093 }
        };
        
        const location = demoLocations[city.toLowerCase()];
        if (location) {
          return location;
        }
        
        // Return random coordinates for other cities
        return {
          lat: 51.5074 + (Math.random() - 0.5) * 20,
          lon: -0.1278 + (Math.random() - 0.5) * 40
        };
      }

      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`Geocoding API error: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.length === 0) {
        throw new Error('City not found');
      }
      
      return { lat: data[0].lat, lon: data[0].lon };
    } catch (error) {
      console.error('Error fetching location:', error);
      throw error;
    }
  }
};