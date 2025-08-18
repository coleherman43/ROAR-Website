// src/pages/OrganizingGuides.jsx
import { useState, useEffect } from 'react';
import { loadGuides, searchGuides, filterGuidesByCategory, getGuideCategories } from '../utils/contentLoader';

function OrganizingGuides() {
  const [guides, setGuides] = useState([]);
  const [filteredGuides, setFilteredGuides] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGuide, setSelectedGuide] = useState(null);

  useEffect(() => {
    async function fetchGuides() {
      try {
        const loadedGuides = await loadGuides();
        setGuides(loadedGuides);
        setFilteredGuides(loadedGuides);
        setCategories(getGuideCategories(loadedGuides));
      } catch (error) {
        console.error('Failed to load guides:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchGuides();
  }, []);

  // Handle search and filter
  useEffect(() => {
    let filtered = guides;
    
    // Apply category filter
    filtered = filterGuidesByCategory(filtered, selectedCategory);
    
    // Apply search
    filtered = searchGuides(filtered, searchTerm);
    
    setFilteredGuides(filtered);
  }, [guides, searchTerm, selectedCategory]);

  if (loading) {
    return <div className="loading">Loading organizing guides...</div>;
  }

  if (selectedGuide) {
    return (
      <div className="guide-viewer">
        <button 
          onClick={() => setSelectedGuide(null)}
          className="back-button"
        >
          ← Back to Guides
        </button>
        <article className="guide-content">
          <header>
            <h1>{selectedGuide.title}</h1>
            <div className="guide-meta">
              <span className="category">{selectedGuide.category}</span>
              <span className="date">{selectedGuide.date}</span>
              {selectedGuide.tags && (
                <div className="tags">
                  {selectedGuide.tags.map(tag => (
                    <span key={tag} className="tag">#{tag}</span>
                  ))}
                </div>
              )}
            </div>
          </header>
          <div 
            className="prose"
            dangerouslySetInnerHTML={{ __html: selectedGuide.content }} 
          />
        </article>
      </div>
    );
  }

  return (
    <div className="organizing-guides">
      <header className="page-header">
        <h1>Organizing Guides</h1>
        <p>Resources and guides for effective campus organizing</p>
      </header>

      <div className="guides-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search guides..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="category-filter">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="guides-grid">
        {filteredGuides.length > 0 ? (
          filteredGuides.map(guide => (
            <div 
              key={guide.slug} 
              className={`guide-card ${guide.featured ? 'featured' : ''}`}
              onClick={() => setSelectedGuide(guide)}
            >
              <h3>{guide.title}</h3>
              <div className="guide-meta">
                <span className="category">{guide.category}</span>
                <span className="date">{guide.date}</span>
              </div>
              {guide.tags && (
                <div className="tags">
                  {guide.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="tag">#{tag}</span>
                  ))}
                </div>
              )}
              <div className="guide-excerpt">
                {guide.rawContent.substring(0, 150)}...
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">
            <p>No guides found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default OrganizingGuides;