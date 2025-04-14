import React, { useState, useEffect, useRef } from 'react';
import imageData from './imageData';
import './styles.css';

const App = () => {
  const [photos, setPhotos] = useState([]);
  const [filteredPhotos, setFilteredPhotos] = useState([]);
  const [affiliations, setAffiliations] = useState([]);
  const [filter, setFilter] = useState({ type: null, value: null });
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const utterancesContainerRef = useRef(null);
  
  // Load photos data initially
  useEffect(() => {
    const loadPhotosData = async () => {
      try {
        const shuffledImages = [...imageData].sort(() => Math.random() - 0.5);
        setPhotos(shuffledImages);
        setFilteredPhotos(shuffledImages);
        const uniqueAffiliations = [...new Set(imageData.map(photo => photo.affiliation))];
        setAffiliations(uniqueAffiliations);
        setLoading(false);
      } catch (error) {
        console.error("Error loading photos:", error);
        const shuffledImages = [...imageData].sort(() => Math.random() - 0.5);
        setPhotos(shuffledImages);
        setFilteredPhotos(shuffledImages);
        setAffiliations([...new Set(imageData.map(photo => photo.affiliation))]);
        setLoading(false);
      }
    };
    
    loadPhotosData();
  }, []);
  
  // Load Utterances when a photo is selected
  useEffect(() => {
    if (selectedPhoto && utterancesContainerRef.current) {
      // Clear previous comments
      utterancesContainerRef.current.innerHTML = '';
      
      // Create the utterances script
      const script = document.createElement('script');
      script.src = 'https://utteranc.es/client.js';
      script.async = true;
      script.crossOrigin = 'anonymous';
      script.setAttribute('repo', 'grmcguire/comments'); // REPLACE WITH YOUR REPO
      script.setAttribute('issue-term', `photo-${selectedPhoto.id}`); // Unique issue per photo
      script.setAttribute('theme', 'github-light'); // You can choose different themes
      script.setAttribute('label', 'comments'); // Optional: adds a label to GitHub issues
      
      // Add the script to the container
      utterancesContainerRef.current.appendChild(script);
    }
  }, [selectedPhoto]);

  // Filter photos by affiliation
  const handleFilter = (value) => {
    if (filter.value === value) {
      setFilter({ type: null, value: null });
      setFilteredPhotos(photos);
    } else {
      setFilter({ type: 'affiliation', value });
      const filtered = photos.filter(photo => photo.affiliation === value);
      setFilteredPhotos(filtered);
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setFilter({ type: null, value: null });
    setFilteredPhotos(photos);
  };

  // Open modal with selected photo
  const openPhotoModal = (photo) => {
    setSelectedPhoto(photo);
    document.body.style.overflow = 'hidden';
  };

  // Close modal
  const closePhotoModal = () => {
    setSelectedPhoto(null);
    document.body.style.overflow = 'auto';
  };

  if (loading) {
    return <div className="loading">Loading gallery...</div>;
  }

  return (
    <div className="container">
      <header>
        <h1>Snapshots in Time</h1>
        <h2>Documenting a Collective Davidson Experience in the Spring of 2025</h2>
        
        <div className="project-description">
          <p>This interactive gallery showcases moments captured by Davidson College students and community members during the Spring of 2025. These photographs represent diverse experiences across campus life, from casual social gatherings to organized events. Visitors are invited to explore the gallery, filter by contributor affiliation, and add their comments to create a collective narrative of this moment in Davidson's history.</p>
        </div>
        
        <div className="filter-container">
          <div className="filter-group">
            <h3>Filter by Affiliation:</h3>
            <div className="filter-buttons">
              {affiliations.map(affiliation => (
                <button 
                  key={affiliation}
                  className={filter.value === affiliation ? 'active' : ''}
                  onClick={() => handleFilter(affiliation)}
                >
                  {affiliation}
                </button>
              ))}
            </div>
          </div>
          
          <button className="clear-button" onClick={clearFilters}>
            Clear All Filters
          </button>
        </div>
      </header>
      
      <main>
        <div className="photo-grid">
          {filteredPhotos.map(photo => (
            <div 
              key={photo.id} 
              className="photo-card" 
              onClick={() => openPhotoModal(photo)}
            >
              <img src={photo.url} alt={photo.title} />
            </div>
          ))}
        </div>
        
        {filteredPhotos.length === 0 && (
          <div className="no-results">No photos match your filter criteria</div>
        )}
      </main>

      {/* Modal for displaying selected photo */}
      {selectedPhoto && (
        <div className="modal-overlay" onClick={closePhotoModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={closePhotoModal}>&times;</button>
            <div className="modal-image-container">
              <img src={selectedPhoto.url} alt={selectedPhoto.title} />
            </div>
            <div className="modal-info">
              <h2>{selectedPhoto.title}</h2>
              <p>
                <strong>Author:</strong> {selectedPhoto.author}
              </p>
              <p>
                <strong>Affiliation:</strong> {selectedPhoto.affiliation}
              </p>
              <div className="ai-caption">
                <h4>AI Caption:</h4>
                <p>{selectedPhoto.aiCaption}</p>
              </div>
              
              {/* Utterances comments section */}
              <div className="comments-section">
                <h3>Comments</h3>
                <div ref={utterancesContainerRef} className="utterances-container"></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
