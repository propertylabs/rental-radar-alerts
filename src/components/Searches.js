import React, { useState, useEffect } from 'react';
import { FaPlus, FaTimes, FaBed, FaBuilding, FaHome } from 'react-icons/fa';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './Searches.css';
// import './SearchesModal.css';

// Function to detect standalone mode
const isStandalone = () => window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;

const validManchesterPostcodes = [
  // Postcode data...
];

// Adjust modal for safe areas and URL bar presence in Safari
const adjustModalForSafeAreas = (standalone) => {
  const modal = document.querySelector('.modal-content');
  if (modal) {
    if (standalone) {
      // In standalone mode, the viewport height doesn't dynamically change, so use a static approach
      modal.style.height = `calc(100vh - 20px)`; // Add padding at the top and bottom for a cleaner look
      modal.style.paddingTop = '10px';
      modal.style.paddingBottom = '10px';
    } else {
      // Non-standalone mode: Adjust for dynamic URL bar and safe areas
      const visibleHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
      const topSafeArea = parseInt(getComputedStyle(document.documentElement).getPropertyValue('env(safe-area-inset-top)')) || 0;
      const bottomSafeArea = parseInt(getComputedStyle(document.documentElement).getPropertyValue('env(safe-area-inset-bottom)')) || 0;

      modal.style.paddingTop = `${topSafeArea}px`;
      modal.style.paddingBottom = `${bottomSafeArea}px`;
      modal.style.height = `calc(${visibleHeight}px - ${topSafeArea}px - ${bottomSafeArea}px)`;
    }
  }
};

const Searches = () => {
  const [searches, setSearches] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState('text');
  const [geoData, setGeoData] = useState(null);
  const [selectedPostcodes, setSelectedPostcodes] = useState([]);
  const [postcodeTiles, setPostcodeTiles] = useState([]);
  const [newPostcode, setNewPostcode] = useState('');
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [studioSelected, setStudioSelected] = useState(false);
  const [bedroomSelection, setBedroomSelection] = useState('');

  useEffect(() => {
    if (viewMode === 'map') {
      fetch('/data/manchester-M.geojson')
        .then((response) => response.json())
        .then((data) => setGeoData(data))
        .catch((error) => console.error('Error fetching GeoJSON:', error));
    }
  }, [viewMode]);

  useEffect(() => {
    const standalone = isStandalone();

    const handleResize = () => {
      if (isModalOpen) adjustModalForSafeAreas(standalone);
    };

    // Adjust the modal when it opens
    if (isModalOpen) {
      adjustModalForSafeAreas(standalone);
    }

    window.addEventListener('resize', handleResize); // Listen for window resize
    if (!standalone && window.visualViewport) {
      // Only listen for visual viewport changes in non-standalone mode
      window.visualViewport.addEventListener('resize', handleResize);
    }

    // Cleanup event listeners on component unmount or when modal closes
    return () => {
      window.removeEventListener('resize', handleResize);
      if (!standalone && window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleResize);
      }
    };
  }, [isModalOpen]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setStep(1);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleToggleView = (view) => setViewMode(view);

  const handlePropertyTypeSelect = (type) => {
    if (selectedProperties.includes(type)) {
      setSelectedProperties(selectedProperties.filter((prop) => prop !== type));
    } else {
      setSelectedProperties([...selectedProperties, type]);
    }
  };

  const handleNextClick = () => setStep(step + 1);

  const handleAddTile = () => {
    const cleanedPostcode = newPostcode.trim().toUpperCase();
    if (cleanedPostcode === '') return;
    const isValid = validManchesterPostcodes.includes(cleanedPostcode);

    if (isValid && !selectedPostcodes.includes(cleanedPostcode)) {
      setPostcodeTiles([...postcodeTiles, cleanedPostcode]);
      setSelectedPostcodes([...selectedPostcodes, cleanedPostcode]);
      setNewPostcode('');
      setError('');
    } else {
      setError('Please enter a valid Manchester postcode.');
    }
  };

  const handleDeleteTile = (postcode) => {
    setPostcodeTiles(postcodeTiles.filter((tile) => tile !== postcode));
    setSelectedPostcodes(selectedPostcodes.filter((pc) => pc !== postcode));
  };

  const onEachPostcode = (feature, layer) => {
    const postcodeName = feature.properties.name;

    layer.on('click', () => {
      setSelectedPostcodes((prevSelected) => {
        const isSelected = prevSelected.includes(postcodeName);
        if (isSelected) {
          setPostcodeTiles((prevTiles) => prevTiles.filter((pc) => pc !== postcodeName));
          return prevSelected.filter((pc) => pc !== postcodeName);
        } else {
          setPostcodeTiles((prevTiles) => [...prevTiles, postcodeName]);
          return [...prevSelected, postcodeName];
        }
      });
    });

    layer.setStyle({
      color: selectedPostcodes.includes(postcodeName) ? 'blue' : 'black',
      weight: selectedPostcodes.includes(postcodeName) ? 5 : 1,
      fillOpacity: selectedPostcodes.includes(postcodeName) ? 0.7 : 0.3
    });
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

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              {step === 1 ? (
                <button className="modal-close" onClick={handleCloseModal}>
                  &times;
                </button>
              ) : (
                <button className="modal-back" onClick={() => setStep(step - 1)}>
                  Back
                </button>
              )}
              <button className="modal-next" onClick={handleNextClick}>
                Next
              </button>
            </div>

            <div className="modal-body">
              {step === 1 && (
                <>
                  <h3 className="modal-title">Create New Search</h3>
                  <h4 className="step-heading">Step 1: Choose Your Areas</h4>
                  <p className="step-subtitle">You can define your search area using postcode prefixes such as M1, M4, M23. Use the toggle switch to change between text entry and map view.</p>

                  <div className="toggle-container">
                    <div
                      className={`toggle-switch ${viewMode === 'text' ? 'text' : 'map'}`}
                      onClick={() => handleToggleView(viewMode === 'text' ? 'map' : 'text')}
                    >
                      <div className="toggle-option">Text</div>
                      <div className="toggle-option">Map</div>
                    </div>
                  </div>

                  <div className="content-container">
                    {viewMode === 'text' ? (
                      <div className="tiles-wrapper">
                        {postcodeTiles.map((postcode, index) => (
                          <div key={index} className="postcode-tile">
                            <span>{postcode}</span>
                            <FaTimes className="delete-icon" onClick={() => handleDeleteTile(postcode)} />
                          </div>
                        ))}
                        <div className="add-tile">
                          <input
                            type="text"
                            className="postcode-input"
                            value={newPostcode}
                            onChange={(e) => setNewPostcode(e.target.value.toUpperCase())}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleAddTile();
                            }}
                            placeholder="Add postcode"
                          />
                        </div>
                        {error && <p className="error-message">{error}</p>}
                      </div>
                    ) : (
                      <div className="map-container">
                        {geoData && (
                          <MapContainer center={[53.483959, -2.244644]} zoom={12} className="map-instance">
                            <TileLayer
                              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            />
                            <GeoJSON
                              data={geoData}
                              style={(feature) => ({
                                color: selectedPostcodes.includes(feature.properties.name) ? 'blue' : 'black',
                                weight: selectedPostcodes.includes(feature.properties.name) ? 5 : 1,
                                fillOpacity: selectedPostcodes.includes(feature.properties.name) ? 0.7 : 0.3
                              })}
                              onEachFeature={onEachPostcode}
                            />
                          </MapContainer>
                        )}
                      </div>
                    )}
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <h3 className="modal-title">Create New Search</h3>
                  <h4 className="step-heading">Step 2: Select a Property Type</h4>
                  <p className="step-subtitle">Please select the type of property you're interested in: flat, house, room, etc.</p>

                  <div className="property-type-container">
                    <button
                      className={`property-type-button ${selectedProperties.includes('Flat') ? 'selected' : ''}`}
                      onClick={() => handlePropertyTypeSelect('Flat')}
                    >
                      <FaBuilding className="property-icon" />
                      Flat
                    </button>
                    <button
                      className={`property-type-button ${selectedProperties.includes('House') ? 'selected' : ''}`}
                      onClick={() => handlePropertyTypeSelect('House')}
                    >
                      <FaHome className="property-icon" />
                      House
                    </button>
                    <button
                      className={`property-type-button ${selectedProperties.includes('Room') ? 'selected' : ''}`}
                      onClick={() => handlePropertyTypeSelect('Room')}
                    >
                      <FaBed className="property-icon" />
                      Room
                    </button>
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <h4 className="step-heading">Step 3: Select Number of Bedrooms</h4>
                  <p className="step-subtitle">Please select the number of bedrooms for your search.</p>

                  <div className="bedroom-container">
                    <button className={`bedroom-button ${studioSelected ? 'selected' : ''}`} onClick={() => setStudioSelected(!studioSelected)}>
                      Studio
                    </button>
                    {['1', '2', '3', '4', '5', '6', '7', '8', '9', '10+'].map((num) => (
                      <button
                        key={num}
                        className={`bedroom-button ${bedroomSelection === num ? 'selected' : ''}`}
                        onClick={() => setBedroomSelection(num)}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Searches;