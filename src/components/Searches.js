import React, { useState, useEffect } from 'react';
import { FaPlus, FaTimes } from 'react-icons/fa';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './Searches.css';

const validManchesterPostcodes = [
  'M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8', 'M9',
  'M11', 'M12', 'M13', 'M14', 'M15', 'M16', 'M17', 'M18', 'M19',
  'M20', 'M21', 'M22', 'M23', 'M24', 'M25', 'M26', 'M27', 'M28', 'M29',
  'M30', 'M31', 'M32', 'M33', 'M34', 'M35', 'M38', 'M40', 'M41', 'M43', 'M44', 'M45', 'M46',
  'M50', 'M90'
];

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
  const [selectedProperty, setSelectedProperty] = useState('');
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [bedroomSelection, setBedroomSelection] = useState('');
  const [studioSelected, setStudioSelected] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (viewMode === 'map') {
      fetch('/data/manchester-M.geojson')
        .then((response) => response.json())
        .then((data) => setGeoData(data))
        .catch((error) => console.error('Error fetching GeoJSON:', error));
    }
  }, [viewMode]);

  // Sync text view and map view
  useEffect(() => {
    if (viewMode === 'map' && geoData) {
      const updatedFeatures = geoData.features.map((feature) => ({
        ...feature,
        properties: {
          ...feature.properties,
          selected: selectedPostcodes.includes(feature.properties.name)
        }
      }));
      setGeoData({ ...geoData, features: updatedFeatures });
    }
  }, [viewMode, selectedPostcodes, geoData]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setStep(1); // Ensure we start at step 1 when opening the modal
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleToggleView = (view) => setViewMode(view);

  const handlePropertyTypeSelect = (type) => {
    if (type === 'Room') {
      if (!selectedProperties.includes('Room')) {
        setSelectedProperties(['Room']);
      } else {
        setSelectedProperties([]);
      }
    } else {
      if (selectedProperties.includes('Room')) {
        setErrorMessage('Room searches cannot be combined with other property types.');
      } else {
        if (selectedProperties.includes(type)) {
          setSelectedProperties(selectedProperties.filter((prop) => prop !== type));
        } else {
          setSelectedProperties([...selectedProperties, type]);
        }
      }
    }
  };

  const handleBedroomSelect = (num) => {
    setBedroomSelection(num);
  };

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
      setError('Please enter a valid Manchester postcode');
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

  const handleNextClick = () => {
    if (step === 1) {
      if (selectedPostcodes.length > 0) {
        setStep(2);
      } else {
        setError('Please select at least one postcode.');
      }
    } else if (step === 2) {
      if (selectedProperties.length > 0) {
        if (selectedProperties.includes('Room')) {
          setStep(4); // Skip to step 4
        } else {
          setStep(3); // Move to bedroom selection
        }
      } else {
        setErrorMessage('Please select a property type.');
      }
    } else if (step === 3) {
      if (bedroomSelection || studioSelected) {
        setStep(4);
      } else {
        setErrorMessage('Please select the number of bedrooms.');
      }
    }
  };

  const handleBackClick = () => {
    if (step > 1) setStep(step - 1); // Go back one step at a time
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
                <button className="modal-back" onClick={handleBackClick}>
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
                            onBlur={handleAddTile}  {/* Add onBlur to save postcode when focus is lost */}
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
                      disabled={selectedProperties.includes('Room')}
                    >
                      Flat
                    </button>
                    <button
                      className={`property-type-button ${selectedProperties.includes('House') ? 'selected' : ''}`}
                      onClick={() => handlePropertyTypeSelect('House')}
                      disabled={selectedProperties.includes('Room')}
                    >
                      House
                    </button>
                    <button
                      className={`property-type-button ${selectedProperties.includes('Room') ? 'selected' : ''}`}
                      onClick={() => handlePropertyTypeSelect('Room')}
                      disabled={selectedProperties.length > 0 && !selectedProperties.includes('Room')}
                    >
                      Room
                    </button>
                  </div>

                  {selectedProperties.includes('Room') && (
                    <p className="info-message">Room searches cannot be combined with other property types. Please finish adding this search for rooms only.</p>
                  )}

                  {errorMessage && <p className="error-message">{errorMessage}</p>}
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
                        onClick={() => handleBedroomSelect(num)}
                        disabled={studioSelected && selectedProperties.includes('House') && num !== 'Studio'}
                      >
                        {num}
                      </button>
                    ))}
                  </div>

                  {errorMessage && <p className="error-message">{errorMessage}</p>}
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