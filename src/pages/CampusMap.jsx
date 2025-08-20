// src/pages/CampusMap.jsx
import { useState, useEffect } from 'react';
import CampusMap from '../components/map/CampusMap';

function CampusMapPage() {
  const [categories, setCategories] = useState({});
  const [selectedCategories, setSelectedCategories] = useState(['all']);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showLegend, setShowLegend] = useState(true);

  // Load categories for filters
  useEffect(() => {
    async function loadCategories() {
      try {
        const response = await fetch('/data/campus-locations.json');
        const data = await response.json();
        setCategories(data.categories);
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    }
    loadCategories();
  }, []);

  const handleCategoryToggle = (category) => {
    if (category === 'all') {
      setSelectedCategories(['all']);
    } else {
      setSelectedCategories(prev => {
        const withoutAll = prev.filter(cat => cat !== 'all');
        if (withoutAll.includes(category)) {
          const newSelection = withoutAll.filter(cat => cat !== category);
          return newSelection.length === 0 ? ['all'] : newSelection;
        } else {
          return [...withoutAll, category];
        }
      });
    }
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
  };

  return (
    <div className="campus-map-page">
      <header className="page-header">
        <h1>Campus Organizing Map</h1>
        <p>Explore sites of organizing history and current activist resources at UO</p>
      </header>

      <div className="map-controls">
        <div className="search-and-filters">
          <div className="map-search">
            <input
              type="text"
              placeholder="Search locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="map-search-input"
            />
          </div>

          <div className="category-filters">
            <h3>Filter by Category</h3>
            <div className="filter-buttons">
              <button
                className={`filter-btn ${selectedCategories.includes('all') ? 'active' : ''}`}
                onClick={() => handleCategoryToggle('all')}
              >
                Show All
              </button>
              
              {Object.entries(categories).map(([key, category]) => (
                <button
                  key={key}
                  className={`filter-btn ${selectedCategories.includes(key) ? 'active' : ''}`}
                  onClick={() => handleCategoryToggle(key)}
                  style={{
                    '--category-color': category.color
                  }}
                >
                  {category.icon} {category.name}
                </button>
              ))}
            </div>
          </div>

          <button 
            className="toggle-legend"
            onClick={() => setShowLegend(!showLegend)}
          >
            {showLegend ? 'Hide' : 'Show'} Legend
          </button>
        </div>

        {showLegend && (
          <div className="map-legend">
            <h3>Map Legend</h3>
            <div className="legend-items">
              {Object.entries(categories).map(([key, category]) => (
                <div key={key} className="legend-item">
                  <div 
                    className="legend-marker"
                    style={{ backgroundColor: category.color }}
                  >
                    {category.icon}
                  </div>
                  <div className="legend-text">
                    <strong>{category.name}</strong>
                    <p>{category.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="map-wrapper">
        <CampusMap
          selectedCategories={selectedCategories}
          searchTerm={searchTerm}
          onLocationSelect={handleLocationSelect}
        />
      </div>

      {selectedLocation && (
        <div className="location-detail-panel">
          <div className="location-detail-content">
            <button 
              className="close-detail"
              onClick={() => setSelectedLocation(null)}
            >
              ✕
            </button>
            
            <h2>{selectedLocation.name}</h2>
            
            <div className="location-category">
              <span 
                className="category-badge"
                style={{ backgroundColor: categories[selectedLocation.category]?.color }}
              >
                {categories[selectedLocation.category]?.icon} {categories[selectedLocation.category]?.name}
              </span>
            </div>

            <div className="location-sections">
              <section>
                <h3>Description</h3>
                <p>{selectedLocation.description}</p>
              </section>

              {selectedLocation.history && (
                <section>
                  <h3>Historical Significance</h3>
                  <p>{selectedLocation.history}</p>
                </section>
              )}

              {selectedLocation.currentUse && (
                <section>
                  <h3>Current Use for Organizing</h3>
                  <p>{selectedLocation.currentUse}</p>
                </section>
              )}

              {selectedLocation.tips && (
                <section>
                  <h3>Organizing Tips</h3>
                  <p>{selectedLocation.tips}</p>
                </section>
              )}

              {selectedLocation.permits && (
                <section>
                  <h3>Permits & Logistics</h3>
                  <p>{selectedLocation.permits}</p>
                </section>
              )}
            </div>

            <div className="organizing-status">
              {selectedLocation.organizeHere ? (
                <div className="can-organize">
                  ✅ <strong>Good location for organizing activities</strong>
                </div>
              ) : (
                <div className="no-organize">
                  ❌ <strong>Not recommended for organizing</strong>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CampusMapPage;