import React, { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './Searches.css';

const Searches = () => {
  const [searches, setSearches] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // Track modal state
  const [viewMode, setViewMode] = useState('text'); // 'text' or 'map' toggle
  const [geoData, setGeoData] = useState(null); // Store GeoJSON data dynamically
  const [selectedPostcodes, setSelectedPostcodes] = useState({}); // Track selected postcodes by name

  // Fetch GeoJSON data when component mounts
  useEffect(() => {
    fetch('/data/manchester-M.geojson') // Adjust path to your data location
      .then((response) => response.json())
      .then((data) => setGeoData(data))
      .catch((error) => console.error('Error fetching GeoJSON:', error));
  }, []);

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

  // Define default style for unselected features
  const defaultStyle = {
    color: 'black',
    weight: 1,
    fillOpacity: 0.3,
  };

  // Define the highlighted style for selected features
  const highlightedStyle = {
    color: 'blue',
    weight: 5,
    fillOpacity: 0.7,
  };

  // Function to define the style of each feature dynamically based on its selection state
  const styleFeature = (feature) => {
    const postcodeName = feature.properties.name;
    // Check if this postcode is selected, and apply the highlighted style if so
    if (selectedPostcodes[postcodeName]) {
      return highlightedStyle;
    } else {
      return defaultStyle;
    }
  };

  // Function to handle the click event for each postcode
  const onEachPostcode = (feature, layer) => {
    const postcodeName = feature.properties.name;

    // Click event handler for each postcode layer
    layer.on('click', () => {
      setSelectedPostcodes((prevSelected) => {
        const newSelected = { ...prevSelected }; // Copy current selection state

        if (newSelected[postcodeName]) {
          // If the postcode is already selected, deselect it
          delete newSelected[postcodeName]; // Remove from selected list
        } else {
          // If the postcode is not selected, select it
          newSelected[postcodeName] = true; // Mark as selected
        }

        return newSelected; // Return updated selection state
      });
    });

    // Add a tooltip to display the postcode name
    layer.bindTooltip(postcodeName, { permanent: true, direction: 'center', className: 'zone-label' });
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

              {/* Conditional rendering based on toggle selection */}
              {viewMode === 'text' ? (
                <div className="tiles-wrapper">
                  {/* Your existing logic for adding postcode tiles goes here */}
                </div>
              ) : (
                <div className="map-container">
                  {/* Render Map when in 'map' view and GeoJSON data is loaded */}
                  {geoData && (
                    <MapContainer
                      center={[53.483959, -2.244644]} // Centered on Manchester
                      zoom={12}
                      style={{ height: 'calc(100% - 30px)', width: '100%' }} // Ensuring map fits modal
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                      />
                      <GeoJSON
                        data={geoData}
                        style={styleFeature} // Use dynamic styling based on selection state
                        onEachFeature={onEachPostcode} // Attach event handling to each postcode
                      />
                    </MapContainer>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Searches;