import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Layers } from 'lucide-react';
import './WeatherMap.scss';

// Fix for default markers in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const WeatherMap = ({ location, isDarkMode, weatherData }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map
    mapInstanceRef.current = L.map(mapRef.current).setView([location.lat, location.lng], 10);

    // Add tile layer
    const tileLayer = isDarkMode 
      ? L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
          attribution: '© OpenStreetMap contributors © CARTO',
          subdomains: 'abcd',
          maxZoom: 19
        })
      : L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19
        });

    tileLayer.addTo(mapInstanceRef.current);

    // Add weather overlay (OpenWeatherMap)
    const weatherLayer = L.tileLayer(
      `https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${import.meta.env.VITE_OPENWEATHER_API_KEY || 'demo'}`, 
      {
        attribution: 'Weather data © OpenWeatherMap',
        opacity: 0.6
      }
    );
    weatherLayer.addTo(mapInstanceRef.current);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isDarkMode]);

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Update map view
    mapInstanceRef.current.setView([location.lat, location.lng], 10);

    // Remove existing marker
    if (markerRef.current) {
      mapInstanceRef.current.removeLayer(markerRef.current);
    }

    // Add new marker with weather info
    const customIcon = L.divIcon({
      html: `
        <div class="custom-marker">
          <div class="marker-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" fill="#4A90E2" stroke="white" stroke-width="2"/>
              <circle cx="12" cy="10" r="3" fill="white"/>
            </svg>
          </div>
        </div>
      `,
      className: 'custom-marker-icon',
      iconSize: [40, 40],
      iconAnchor: [20, 40]
    });

    markerRef.current = L.marker([location.lat, location.lng], { icon: customIcon })
      .addTo(mapInstanceRef.current);

    // Add popup with weather info
    if (weatherData) {
      const popupContent = `
        <div class="weather-popup">
          <h3>${weatherData.name}, ${weatherData.sys.country}</h3>
          <div class="popup-weather">
            <img src="https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png" alt="${weatherData.weather[0].description}" />
            <div>
              <div class="popup-temp">${Math.round(weatherData.main.temp)}°C</div>
              <div class="popup-desc">${weatherData.weather[0].description}</div>
            </div>
          </div>
          <div class="popup-details">
            <div>💧 Humidity: ${weatherData.main.humidity}%</div>
            <div>💨 Wind: ${weatherData.wind.speed} m/s</div>
          </div>
        </div>
      `;
      markerRef.current.bindPopup(popupContent);
    }
  }, [location, weatherData]);

  return (
    <div className="weather-map">
      <div className="map-header">
        <div className="map-title">
          <Layers className="map-icon" />
          <h2>Weather Map</h2>
        </div>
        <div className="map-legend">
          <div className="legend-item">
            <div className="legend-color clouds"></div>
            <span>Clouds</span>
          </div>
          <div className="legend-item">
            <MapPin size={16} />
            <span>Current Location</span>
          </div>
        </div>
      </div>
      <div ref={mapRef} className="map-container"></div>
    </div>
  );
};

export default WeatherMap;