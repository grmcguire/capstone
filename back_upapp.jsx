};

  if (loading) {
    return <div className="loading">Loading gallery...</div>;
  }

  return (
    <div className="container">
      <header>
        <h1>Snapshots in Time</h1>
        <h2>Documenting a Collective Davidson Experience in the Spring of 2025</h2>
        <div className="filter-container">
          <div className="filter-group">
            <h3>Filter by Artist:</h3>
            <div className="filter-buttons">
              {artists.map(artist => (
                <button 
                  key={artist}
                  className={filter.type === 'artist' && filter.value === artist ? 'active' : ''}
                  onClick={() => handleFilter('artist', artist)}
                >
                  {artist}
                </button>
              ))}
            </div>
          </div>
          
          <div className="filter-group">
            <h3>Filter by Affiliation:</h3>
            <div className="filter-buttons">
              {affiliations.map(affiliation => (
                <button 
                  key={affiliation}
                  className={filter.type === 'affiliation' && filter.value === affiliation ? 'active' : ''}
                  onClick={() => handleFilter('affiliation', affiliation)}
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
              <p onClick={() => { closePhotoModal(); handleFilter('artist', selectedPhoto.artist); }}>
                <strong>Artist:</strong> {selectedPhoto.artist}
              </p>
              <p onClick={() => { closePhotoModal(); handleFilter('affiliation', selectedPhoto.affiliation); }}>
                <strong>Affiliation:</strong> {selectedPhoto.affiliation}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;