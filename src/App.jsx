import React, { useState, useEffect, useRef } from 'react';
import imageData from './imageData';
import axios from 'axios';
import './styles.css';

// API base URL - adjust for production/development
const API_URL = process.env.NODE_ENV === 'production' 
  ? '/api' // In production, API requests will be proxied through the same domain
  : 'http://localhost:3001/api'; // In development, connect to local server

const App = () => {
  const [photos, setPhotos] = useState([]);
  const [filteredPhotos, setFilteredPhotos] = useState([]);
  const [affiliations, setAffiliations] = useState([]);
  const [filter, setFilter] = useState({ type: null, value: null });
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState({});
  
  // Load photos data and comments initially
  useEffect(() => {
    const loadPhotosData = async () => {
      try {
        const shuffledImages = [...imageData].sort(() => Math.random() - 0.5);
        setPhotos(shuffledImages);
        setFilteredPhotos(shuffledImages);
        const uniqueAffiliations = [...new Set(imageData.map(photo => photo.affiliation))];
        setAffiliations(uniqueAffiliations);
        
        // Load comments from API
        try {
          const response = await axios.get(`${API_URL}/comments`);
          if (response.data) {
            setComments(response.data);
          }
        } catch (commentError) {
          console.error("Error loading comments from API:", commentError);
          // Fallback to localStorage if API fails
          const savedComments = localStorage.getItem('photoComments');
          if (savedComments) {
            setComments(JSON.parse(savedComments));
          }
        }
        
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
  
  // Handle adding a new comment
  const handleAddComment = async () => {
    if (!commentText.trim() || !selectedPhoto) return;
    
    const commentData = {
      photoId: selectedPhoto.id,
      text: commentText
    };
    
    try {
      // Send comment to API
      const response = await axios.post(`${API_URL}/comments`, commentData);
      const newComment = response.data;
      
      // Update comments state
      const photoComments = comments[selectedPhoto.id] || [];
      const updatedComments = {
        ...comments,
        [selectedPhoto.id]: [...photoComments, newComment]
      };
      
      // Also save to localStorage as backup
      localStorage.setItem('photoComments', JSON.stringify(updatedComments));
      
      // Update state
      setComments(updatedComments);
      setCommentText('');
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("Failed to save your comment. Please try again.");
    }
  };
  
  // Get comments for the selected photo
  const getPhotoComments = (photoId) => {
    // Ensure we always return an array, even if comments[photoId] exists but isn't an array
    const photoComments = comments[photoId];
    return Array.isArray(photoComments) ? photoComments : [];
  };

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
              {comments[photo.id] && comments[photo.id].length > 0 && (
                <div className="comment-count">{comments[photo.id].length}</div>
              )}
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
              
              {/* Comments section */}
              <div className="comments-section">
                <h3>Comments</h3>
                
                <div className="comments-list">
                  {getPhotoComments(selectedPhoto.id).length === 0 ? (
                    <div className="no-comments">No comments yet. Be the first to comment!</div>
                  ) : (
                    getPhotoComments(selectedPhoto.id).map(comment => (
                      <div key={comment.id} className="comment">
                        <div className="comment-header">
                          <span className="comment-author">Anonymous</span>
                          <span className="comment-date">{new Date(comment.date).toLocaleDateString()}</span>
                        </div>
                        <p>{comment.text}</p>
                      </div>
                    ))
                  )}
                </div>
                
                <div className="comment-form">
                  <h4>Add a Comment</h4>
                  <div className="form-group">
                    <textarea 
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Share your thoughts..."
                      rows="3"
                    ></textarea>
                  </div>
                  <button 
                    className="submit-comment" 
                    onClick={handleAddComment}
                    disabled={!commentText.trim()}
                  >
                    Post Comment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
