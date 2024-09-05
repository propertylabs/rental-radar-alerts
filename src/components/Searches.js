import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import './Searches.css';

const Searches = () => {
  const [searches, setSearches] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // Track modal state
  const [viewMode, setViewMode] = useState('text'); // 'text' or 'map' toggle

  // Handle opening the modal
  const handleOpenModal = () => {
    setIsModalOpen(true);
    document.querySelector('nav').classList.add('modal-active'); // Apply class to entire nav
  };

  // Handle closing the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    document.querySelector('nav').classList.remove('modal-active'); // Remove class from nav
  };

  // Toggle between 'text' and 'map' view
  const handleToggleView = (view) => {
    setViewMode(view);
  };

  return (
    <div className="searches-container">
      <h1 className="searches-title">Searches</h1>

      <div className="searches-list">
        {searches.length === 0 ? (
          <div className="search-item add-tile" onClick={handleOpenModal}>
            <FaPlus className="large-add-icon" />
          </div>
        ) : (
          <>
            {searches.map((search, index) => (
              <div key={index} className="search-item">
                <p>Location: {search.location}</p>
                <p>Bedrooms: {search.bedrooms}</p>
                <p>Price: {search.price}</p>
              </div>
            ))}
            <div className="search-item add-tile" onClick={handleOpenModal}>
              <FaPlus className="large-add-icon" />
            </div>
          </>
        )}
      </div>

      {/* Simple modal popup */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={handleCloseModal}>
              &times;
            </button>
            <div className="modal-body">
              <h3 className="modal-title">Create New Search</h3>
              <h4 className="step-heading">Step 1: Choose Your Areas</h4>
              <p className="step-subtitle">
                You can define your search area using post code prefixes such as M1, M4, M23. Use the toggle switch to
                change between text entry and map view.
              </p>

              {/* Toggle between text and map */}
              <div className="toggle-container">
                <div
                  className={`toggle-switch ${viewMode === 'text' ? 'text' : 'map'}`}
                  onClick={() => handleToggleView(viewMode === 'text' ? 'map' : 'text')}
                >
                  <div className="toggle-option">Text</div>
                  <div className="toggle-option">Map</div>
                </div>
              </div>

              {/* Same content space for both views */}
              <div className="content-container">
                {viewMode === 'text' ? (
                  <div className="tiles-wrapper">
                    {/* Placeholder content for the text view */}
                    <p>This is where postcode tiles will go in text mode.</p>
                  </div>
                ) : (
                  <div className="map-container">
                    {/* Placeholder content for the map */}
                    <p>Map content goes here</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Searches;