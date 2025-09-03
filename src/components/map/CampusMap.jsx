// src/components/map/CampusMap.jsx
import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icon creator
const createCustomIcon = (category, categories) => {
  const cat = categories[category];
  if (!cat) return new L.Icon.Default();
  
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div class="marker-pin" style="background-color: ${cat.color}">
        <span class="marker-icon">${cat.icon}</span>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
  });
};

// Component to handle map updates
function MapUpdater({ center, zoom }) {
  const map = useMap();
  
  useEffect(() => {
    if (center && zoom) {
      map.setView([center.lat, center.lng], zoom);
    }
  }, [map, center, zoom]);
  
  return null;
}

function CampusMap({ selectedCategories = [], searchTerm = '', onLocationSelect }) {
  const [mapData, setMapData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filteredLocations, setFilteredLocations] = useState([]);

  // Load map data
  useEffect(() => {
    async function loadMapData() {
      try {
        const response = await fetch('/data/campus-locations.json');
        if (!response.ok) throw new Error('Failed to load map data');
        const data = await response.json();
        setMapData(data);
        setFilteredLocations(data.locations);
      } catch (error) {
        console.error('Error loading map data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadMapData();
  }, []);

  // Filter locations based on categories and search
  useEffect(() => {
    if (!mapData) return;
    
    let filtered = mapData.locations;
    
    // Filter by categories
    if (selectedCategories.length > 0 && !selectedCategories.includes('all')) {
      filtered = filtered.filter(location => 
        selectedCategories.includes(location.category)
      );
    }
    
    // Filter by search term
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(location =>
        location.name.toLowerCase().includes(search) ||
        location.description.toLowerCase().includes(search) ||
        location.history?.toLowerCase().includes(search) ||
        location.currentUse?.toLowerCase().includes(search)
      );
    }
    
    setFilteredLocations(filtered);
  }, [mapData, selectedCategories, searchTerm]);

  if (loading) {
    return <div className="map-loading">Loading campus map...</div>;
  }

  if (!mapData) {
    return <div className="map-error">Failed to load map data</div>;
  }

  const { mapCenter, categories } = mapData;

  // Define campus bounds (adjust these coordinates for UO campus)
  const campusBounds = [
    [44.0390, -123.0850], // Southwest corner
    [44.0520, -123.0650]  // Northeast corner
  ];

  return (
    <div className="campus-map-container">
      <MapContainer
        center={[mapCenter.lat, mapCenter.lng]}
        zoom={mapCenter.zoom}
        style={{ height: '600px', width: '100%' }}
        className="campus-map"
        maxBounds={campusBounds}
        maxBoundsViscosity={1.0} // How strongly to enforce bounds (0.0 to 1.0)
        minZoom={14} // Prevent zooming out too far
        maxZoom={18} // Prevent zooming in too far
      >
        <MapUpdater center={mapCenter} zoom={mapCenter.zoom} />
        
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {filteredLocations.map((location) => (
          <Marker
            key={location.id}
            position={[location.lat, location.lng]}
            icon={createCustomIcon(location.category, categories)}
            eventHandlers={{
              click: () => onLocationSelect && onLocationSelect(location)
            }}
          >
            <Popup className="location-popup" maxWidth={300}>
              <div className="popup-content">
                <h3 className="popup-title">{location.name}</h3>
                
                <div className="popup-category">
                  <span 
                    className="category-badge"
                    style={{ backgroundColor: categories[location.category]?.color }}
                  >
                    {categories[location.category]?.icon} {categories[location.category]?.name}
                  </span>
                </div>
                
                <p className="popup-description">{location.description}</p>
                
                {location.history && (
                  <div className="popup-section">
                    <h4>Historical Significance</h4>
                    <p>{location.history}</p>
                  </div>
                )}
                
                {location.currentUse && (
                  <div className="popup-section">
                    <h4>Current Use</h4>
                    <p>{location.currentUse}</p>
                  </div>
                )}
                
                {location.tips && (
                  <div className="popup-section">
                    <h4>Organizing Tips</h4>
                    <p>{location.tips}</p>
                  </div>
                )}
                
                {location.permits && (
                  <div className="popup-section">
                    <h4>Permits Required</h4>
                    <p>{location.permits}</p>
                  </div>
                )}
                
                <div className="popup-footer">
                  {location.organizeHere ? (
                    <span className="can-organize">✅ Good for organizing</span>
                  ) : (
                    <span className="no-organize">❌ Not for organizing</span>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default CampusMap;