import React, { useState, useEffect } from 'react';
import { FaPlus, FaTimes, FaBed, FaBuilding, FaHome, FaArrowRight, FaArrowLeft, FaPencilAlt, FaTree, FaCar, FaHome as FaRetirement, FaStar, FaTrash } from 'react-icons/fa';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './Searches.css';

// Fullscreen and Geosearch plugins
import 'leaflet-fullscreen/dist/leaflet.fullscreen.css';
import 'leaflet-fullscreen/dist/Leaflet.fullscreen.js';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import 'leaflet-geosearch/dist/geosearch.css';

// Function to detect standalone mode
const isStandalone = () => window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;

// Function to dynamically set theme color
const setThemeColor = (color) => {
  const themeMetaTag = document.querySelector('meta[name="theme-color"]');
  if (themeMetaTag) {
    themeMetaTag.setAttribute('content', color);
  } else {
    const newMetaTag = document.createElement('meta');
    newMetaTag.setAttribute('name', 'theme-color');
    document.head.appendChild(newMetaTag);
  }
};

// Adjust modal for safe areas and URL bar presence in Safari
const adjustModalForSafeAreas = (standalone) => {
  const modal = document.querySelector('.modal-content');
  if (modal) {
    if (standalone) {
      modal.style.height = `calc(100vh - 20px)`; 
      modal.style.paddingTop = '0px';
      modal.style.paddingBottom = '0px';
    } else {
      const visibleHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
      const topSafeArea = parseInt(getComputedStyle(document.documentElement).getPropertyValue('env(safe-area-inset-top)')) || 0;
      const bottomSafeArea = parseInt(getComputedStyle(document.documentElement).getPropertyValue('env(safe-area-inset-bottom)')) || 0;

      modal.style.paddingTop = `${topSafeArea}px`;
      modal.style.paddingBottom = `${bottomSafeArea}px`;
      modal.style.height = `calc(${visibleHeight}px - ${topSafeArea}px - ${bottomSafeArea}px)`;
    }
  }
};

const validManchesterPostcodes = [
  'M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8', 'M9',
  'M11', 'M12', 'M13', 'M14', 'M15', 'M16', 'M17', 'M18', 'M19',
  'M20', 'M21', 'M22', 'M23', 'M24', 'M25', 'M26', 'M27', 'M28', 'M29',
  'M30', 'M31', 'M32', 'M33', 'M34', 'M35', 'M38', 'M40', 'M41', 'M43',
  'M44', 'M45', 'M46', 'M50', 'M90'
];

const setStepAndResetError = (newStep, setStep, setShowError, setError) => {
  setStep(newStep);
  setShowError(false); 
  setError('');        
};

// ModalHeader component with icons
const ModalHeader = ({ step, handleCloseModal, handleNextClick, setStep, setShowError, setError }) => {
  return (
    <div className="modal-header">
      <div className="header-left">
        {step === 1 ? (
          <button className="modal-close" onClick={handleCloseModal}>
            <FaTimes /> {/* X icon for close button */}
          </button>
        ) : (
          <button className="modal-back" onClick={() => setStepAndResetError(step - 1, setStep, setShowError, setError)}>
            <FaArrowLeft /> {/* Left arrow for back button */}
          </button>
        )}
      </div>
      <div className="header-center">
        <h3 className="modal-title">Create New Search</h3> {/* Always appears in the header */}
      </div>
      <div className="header-right">
        {step !== 5 && ( // Remove Next button for the final step
          <button className="modal-next" onClick={handleNextClick}>
            <FaArrowRight /> {/* Right arrow for next button */}
          </button>
        )}
      </div>
    </div>
  );
};

const MapWithSearch = ({ geoData, selectedPostcodes, onEachPostcode }) => {
  const map = useMap();

  useEffect(() => {
    const provider = new OpenStreetMapProvider();
    const searchControl = new GeoSearchControl({
      provider,
      style: 'bar', 
      showMarker: true, 
      retainZoomLevel: false, 
      autoClose: true, 
    });
    map.addControl(searchControl);

    return () => {
      map.removeControl(searchControl);
    };
  }, [map]);

  return null;
};

const Searches = () => {
  const [searches, setSearches] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState('text');
  const [geoData, setGeoData] = useState(null);
  const [selectedPostcodes, setSelectedPostcodes] = useState([]);
  const [postcodeTiles, setPostcodeTiles] = useState([]);
  const [newPostcode, setNewPostcode] = useState('');
  const [isAddingPostcode, setIsAddingPostcode] = useState(false);
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [selectedMustHaves, setSelectedMustHaves] = useState([]); 
  const [minBedrooms, setMinBedrooms] = useState('');
  const [maxBedrooms, setMaxBedrooms] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [searchName, setSearchName] = useState(''); // New state for search name

  useEffect(() => {
    if (viewMode === 'map') {
      fetch('/data/manchester-M.geojson')
        .then((response) => response.json())
        .then((data) => setGeoData(data))
        .catch((error) => console.error('Error fetching GeoJSON:', error));
    }
  
    // Fetch user's saved searches when component mounts
    fetchUserSearches();
  }, [viewMode]);

  useEffect(() => {
    const standalone = isStandalone();

    const handleResize = () => {
      if (isModalOpen) adjustModalForSafeAreas(standalone);
    };

    if (isModalOpen) {
      adjustModalForSafeAreas(standalone);

      if (!standalone) {
        setThemeColor('#767676'); 
      }
    }

    window.addEventListener('resize', handleResize);
    if (!standalone && window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (!standalone && window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleResize);
      }

      if (!standalone && !isModalOpen) {
        setThemeColor('#f0f0f0'); 
      }
    };
  }, [isModalOpen]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setStep(1);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    if (!isStandalone()) {
      setThemeColor('#f0f0f0');
    }
  };

  const handleToggleView = (view) => setViewMode(view);

  const handlePropertyTypeSelect = (type) => {
    if (selectedProperties.includes('Room') && (type === 'Flat' || type === 'House')) {
      triggerError();
      return;
    }

    if ((selectedProperties.includes('Flat') || selectedProperties.includes('House')) && type === 'Room') {
      triggerError();
      return;
    }

    if (selectedProperties.includes(type)) {
      setSelectedProperties(selectedProperties.filter((prop) => prop !== type));
    } else {
      setSelectedProperties([...selectedProperties, type]);
    }
  };

  const triggerError = () => {
    setError('Room selection cannot be combined with other property types.');
    setShowError(true);
    setTimeout(() => setShowError(false), 3000); 
  };

  const isGreyedOut = (type) => {
    if (selectedProperties.includes('Room')) {
      return type === 'Flat' || type === 'House';
    }
    if (selectedProperties.includes('Flat') || selectedProperties.includes('House')) {
      return type === 'Room';
    }
    return false;
  };

  const handleClick = (type) => {
    if (isGreyedOut(type)) {
      triggerError();
      return;
    }
    handlePropertyTypeSelect(type);
  };

  const handleNextClick = () => setStepAndResetError(step + 1, setStep, setShowError, setError);

  const handleMinBedroomsChange = (e) => setMinBedrooms(e.target.value);
  const handleMaxBedroomsChange = (e) => setMaxBedrooms(e.target.value);

  // New handlers for price changes
  const handleMinPriceChange = (e) => {
    setMinPrice(e.target.value);
  };

  const handleMaxPriceChange = (e) => {
    setMaxPrice(e.target.value);
  };

  const [showDropdownError, setShowDropdownError] = useState(false);

  const handleDropdownClick = (e) => {
    e.preventDefault(); // Ensure the click action is canceled
    console.log('Dropdown overlay clicked'); // Log to verify function call

    if (selectedProperties.includes('Room')) {
      setShowDropdownError(true);
      setError('This search is for a room in a shared house.');
      setTimeout(() => setShowDropdownError(false), 3000); // Hide error after 3 seconds
    }
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
      setIsAddingPostcode(false);
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

  const handleMustHaveSelect = (mustHave) => {
    if (selectedMustHaves.includes(mustHave)) {
      setSelectedMustHaves(selectedMustHaves.filter((item) => item !== mustHave));
    } else {
      setSelectedMustHaves([...selectedMustHaves, mustHave]);
    }
  };

  const handleSaveSearch = async () => {
    const whopUserId = localStorage.getItem('whop_user_id'); // Get the Whop user ID from localStorage
  
    if (!whopUserId) {
      console.error('User not authenticated');
      return;
    }
  
    const searchData = {
      userId: whopUserId,
      searchName,
      criteria: {
        minBedrooms: minBedrooms !== "" ? minBedrooms : null,
        maxBedrooms: maxBedrooms !== "" ? maxBedrooms : null,
        minPrice: minPrice !== "" ? minPrice : null,
        maxPrice: maxPrice !== "" ? maxPrice : null,
        propertyTypes: selectedProperties.length > 0 ? selectedProperties : ['Unknown'],
        mustHaves: selectedMustHaves.length > 0 ? selectedMustHaves : ['None'],
      },
      postcodes: selectedPostcodes.length > 0 ? selectedPostcodes : ['None'], // Send postcodes as an array
    };
  
    console.log('Postcodes before sending to backend:', selectedPostcodes); // Log postcodes here
  
    try {
      const saveResponse = await fetch('/api/save-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchData), // Ensure searchData is stringified properly
      });
  
      const result = await saveResponse.json();
      if (saveResponse.ok) {
        console.log('Search saved successfully!', result);
        handleCloseModal(); // Close the modal after saving
      } else {
        console.error('Failed to save search:', result);
      }
    } catch (error) {
      // Only log the error here, as there is no 'res' in client-side React
      console.error('Database query error:', error.message, error.stack);
    }
  };

  const fetchUserSearches = async () => {
    const whopUserId = localStorage.getItem('whop_user_id'); // Ensure you get the user ID
  
    if (!whopUserId) {
      console.error('User ID not found');
      return;
    }
  
    try {
      const response = await fetch(`/api/get-user-searches?userId=${whopUserId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        const result = await response.json();
        console.log('Fetched searches:', result);
        setSearches(result);
      } else {
        console.error('Failed to fetch searches');
      }
    } catch (error) {
      console.error('Error fetching searches:', error);
    }
  };

  const handleDeleteSearch = async (searchId) => {
    try {
      const response = await fetch(`/api/delete-search`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ searchId }), // Send the search ID to the server
      });

      if (response.ok) {
        // Remove the search from the state after a successful delete
        setSearches((prevSearches) => prevSearches.filter((search) => search.id !== searchId));
        console.log(`Search with ID ${searchId} deleted successfully.`);
      } else {
        console.error('Failed to delete search');
      }
    } catch (error) {
      console.error('Error deleting search:', error);
    }
  };

  // Add handleEditSearch function to avoid "not defined" error
  const handleEditSearch = (searchId) => {
    console.log(`Editing search with ID: ${searchId}`);
    // You can add functionality to open a modal for editing in the future
  };

  const Searches = () => {
    const [searches, setSearches] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // Add loading state
    const [isModalOpen, setIsModalOpen] = useState(false);
    // other states...
  
    useEffect(() => {
      // Fetch user's saved searches when component mounts
      fetchUserSearches();
    }, []);
  
    const fetchUserSearches = async () => {
      setIsLoading(true); // Start loading
      const whopUserId = localStorage.getItem('whop_user_id'); 
    
      if (!whopUserId) {
        console.error('User ID not found');
        setIsLoading(false); // Stop loading in case of error
        return;
      }
    
      try {
        const response = await fetch(`/api/get-user-searches?userId=${whopUserId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
    
        if (response.ok) {
          const result = await response.json();
          setSearches(result);
        } else {
          console.error('Failed to fetch searches');
        }
      } catch (error) {
        console.error('Error fetching searches:', error);
      }
      setIsLoading(false); // Stop loading after fetch
    };
  
    return (
      <div className="searches-container">
        <div className="searches-list">
          {isLoading ? (
            // Show loading placeholders when data is loading
            <>
              <div className="loading-placeholder"></div>
              <div className="loading-placeholder"></div>
              <div className="loading-placeholder"></div>
            </>
          ) : (
            <>
              {searches.length === 0 ? (
                <div className="search-item add-tile" onClick={handleOpenModal}>
                  <FaPlus className="large-add-icon" />
                </div>
              ) : (
                <>
                  {searches.map((search, index) => (
                    <div key={index} className="search-item">
                      <p><strong>Search Name:</strong> {search.searchName}</p>
                      <p><strong>Location:</strong> {search.postcodes && search.postcodes.length > 0 ? search.postcodes.join(', ') : 'No postcodes selected'}</p>
                      <p><strong>Bedrooms:</strong> {`${search.criteria.minBedrooms || 0} - ${search.criteria.maxBedrooms || 'Any'}`}</p>
                      <p><strong>Price Range:</strong> £{search.criteria.minPrice || 0} - £{search.criteria.maxPrice || 'Any'}</p>
                      <p><strong>Property Types:</strong> {search.criteria.propertyTypes.join(', ')}</p>
                      <p><strong>Must Haves:</strong> {search.criteria.mustHaves.join(', ')}</p>
  
                      {/* Action buttons */}
                      <div className="action-buttons">
                        <button className="edit-search-button" onClick={() => handleEditSearch(search.id)}>
                          <FaPencilAlt className="edit-icon" />
                        </button>
                        <button className="delete-search-button" onClick={() => handleDeleteSearch(search.id)}>
                          <FaTrash className="trash-icon" />
                        </button>
                      </div>
                    </div>
                  ))}
                  <div className="search-item add-tile" onClick={handleOpenModal}>
                    <FaPlus className="large-add-icon" />
                  </div>
                </>
              )}
            </>
          )}
        </div>
  
        {/* Modal and other code here */}
      </div>
    );
  };
  

  return (
    <div className="searches-container">
      <div className="searches-list">
        {searches.length === 0 ? (
          <div className="search-item add-tile" onClick={handleOpenModal}>
            <FaPlus className="large-add-icon" />
          </div>
        ) : (
          <>
            {searches.map((search, index) => (
              <div key={index} className="search-item">
                <p><strong>Search Name:</strong> {search.searchName}</p>
                {search.postcodes && search.postcodes.length > 0 ? (
                  <p><strong>Location:</strong> {search.postcodes.join(', ')}</p>
                ) : (
                  <p><strong>Location:</strong> No postcodes selected</p>
                )}
                <p><strong>Bedrooms:</strong> {`${search.criteria.minBedrooms || 0} - ${search.criteria.maxBedrooms || 'Any'}`}</p>
                <p><strong>Price Range:</strong> £{search.criteria.minPrice || 0} - £{search.criteria.maxPrice || 'Any'}</p>
                <p><strong>Property Types:</strong> {search.criteria.propertyTypes.join(', ')}</p>
                <p><strong>Must Haves:</strong> {search.criteria.mustHaves.join(', ')}</p>

                {/* Action buttons */}
                <div className="action-buttons">
                  <button className="edit-search-button" onClick={() => handleEditSearch(search.id)}>
                    <FaPencilAlt className="edit-icon" />
                  </button>
                  <button className="delete-search-button" onClick={() => handleDeleteSearch(search.id)}>
                    <FaTrash className="trash-icon" />
                  </button>
                </div>
              </div>
            ))}
            <div className="search-item add-tile" onClick={handleOpenModal}>
              <FaPlus className="large-add-icon" />
            </div>
          </>
        )}
      </div>

      {/* Modal structure here */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <ModalHeader
              step={step}
              handleCloseModal={handleCloseModal}
              handleNextClick={handleNextClick}
              setStep={setStep}
              setShowError={setShowError}
              setError={setError}
            />
            <div className="modal-body">
              {step === 1 && (
                <>
                  <h4 className="step-heading">Select Locations</h4>
                  <p className="step-subtitle">
                    Enter any London or Manchester Postcode prefixes such as SE1, N6, M4, M23 etc.
                  </p>

                  <div className="toggle-container">
                    <div
                      className={`toggle-switch ${viewMode === 'text' ? 'text' : 'map'}`}
                      onClick={() => handleToggleView(viewMode === 'text' ? 'map' : 'text')}
                    >
                      <div className="toggle-option">Text</div>
                      <div className="toggle-option">Map</div>
                    </div>
                  </div>

                  <div className="content-container-flexible">
                    {viewMode === 'text' ? (
                      <div className="tiles-wrapper">
                        {postcodeTiles.map((postcode, index) => (
                          <div key={index} className="postcode-tile">
                            <span>{postcode}</span>
                            <FaTimes className="delete-icon" onClick={() => handleDeleteTile(postcode)} />
                          </div>
                        ))}
                        <div className="add-tile" onClick={() => setIsAddingPostcode(true)}>
                          {isAddingPostcode ? (
                            <input
                              type="text"
                              className="postcode-input"
                              value={newPostcode}
                              onChange={(e) => setNewPostcode(e.target.value.toUpperCase())}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleAddTile();
                              }}
                              placeholder="Add postcode"
                              autoFocus
                            />
                          ) : (
                            <FaPlus className="plus-icon" />
                          )}
                        </div>
                        {error && <p className="error-message">{error}</p>}
                      </div>
                    ) : (
                      <div className="map-container">
                        {geoData && (
                          <MapContainer
                            center={[53.483959, -2.244644]}
                            zoom={12}
                            className="map-instance"
                            fullscreenControl={true}
                          >
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
                            <MapWithSearch geoData={geoData} selectedPostcodes={selectedPostcodes} onEachPostcode={onEachPostcode} />
                          </MapContainer>
                        )}
                      </div>
                    )}
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <h4 className="step-heading">Select a Property Type</h4>
                  <p className="step-subtitle">Please select the type of property you're interested in: flat, house, room, etc.</p>

                  <div className="property-type-container-wrapper">
                    {showError && <div className="error-message fade-in-out">{error}</div>}

                    <div className="property-type-container">
                      <button
                        className={`property-type-button ${selectedProperties.includes('Flat') ? 'selected' : ''}`}
                        onClick={() => handleClick('Flat')}
                        style={isGreyedOut('Flat') ? { opacity: 0.5 } : {}}
                      >
                        <FaBuilding className="property-icon" />
                        Flat
                      </button>
                      <button
                        className={`property-type-button ${selectedProperties.includes('House') ? 'selected' : ''}`}
                        onClick={() => handleClick('House')}
                        style={isGreyedOut('House') ? { opacity: 0.5 } : {}}
                      >
                        <FaHome className="property-icon" />
                        House
                      </button>
                      <button
                        className={`property-type-button ${selectedProperties.includes('Room') ? 'selected' : ''}`}
                        onClick={() => handleClick('Room')}
                        style={isGreyedOut('Room') ? { opacity: 0.5 } : {}}
                      >
                        <FaBed className="property-icon" />
                        Room
                      </button>
                    </div>
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  {/* Number of Bedrooms Section */}
                  <h4 className="step-heading">Select Number of Bedrooms</h4>
                  <p className="step-subtitle">Use the dropdowns to select the range of bedrooms for your search.</p>

                  <div className="dropdown-container bedroom-section">
                    <div className="dropdown-wrapper">
                      <label htmlFor="min-beds">Min Beds</label>
                      <div className="dropdown-wrapper-relative">
                        <select
                          id="min-beds"
                          value={minBedrooms}
                          onChange={handleMinBedroomsChange}
                          className={`bedroom-dropdown ${selectedProperties.includes('Room') ? 'disabled' : ''}`}
                          disabled={selectedProperties.includes('Room')} // Disable if "Room" is selected
                        >
                          <option value="-1">No Min</option>
                          <option value="0">Studio</option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                          <option value="6">6</option>
                          <option value="7">7</option>
                          <option value="8">8</option>
                          <option value="9">9</option>
                          <option value="10">10+</option>
                        </select>
                        {selectedProperties.includes('Room') && (
                          <div className="dropdown-overlay" onClick={(e) => handleDropdownClick(e)}></div>
                        )}
                      </div>
                    </div>

                    <div className="dropdown-wrapper">
                      <label htmlFor="max-beds">Max Beds</label>
                      <div className="dropdown-wrapper-relative">
                        <select
                          id="max-beds"
                          value={maxBedrooms}
                          onChange={handleMaxBedroomsChange}
                          className={`bedroom-dropdown ${selectedProperties.includes('Room') ? 'disabled' : ''}`}
                          disabled={selectedProperties.includes('Room')} // Disable if "Room" is selected
                        >
                          <option value="-1">No Max</option>
                          <option value="0">Studio</option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                          <option value="6">6</option>
                          <option value="7">7</option>
                          <option value="8">8</option>
                          <option value="9">9</option>
                          <option value="10">10+</option>
                        </select>
                        {selectedProperties.includes('Room') && (
                          <div className="dropdown-overlay" onClick={(e) => handleDropdownClick(e)}></div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Error message for dropdown */}
                  {showDropdownError && (
                    <div className="dropdown-error-message">    
                      {error}
                    </div>
                  )}

                  {/* Separator Line */}
                  <div className="section-separator"></div>

                  {/* Price Range Section */}
                  <h4 className="step-heading">Select Price Range</h4>
                  <p className="step-subtitle">Use the dropdowns to select the price range for your search.</p>

                  <div className="price-dropdown-container">
                    <div className="price-dropdown-wrapper">
                      <label htmlFor="min-price">Min Price</label>
                      <select
                        id="min-price"
                        value={minPrice}
                        onChange={handleMinPriceChange}
                        className="price-dropdown"
                      >
                        <option value="">No min</option>
                        <option value="25">£25</option>
                        <option value="50">£50</option>
                        <option value="75">£75</option>
                        <option value="100">£100</option>
                        <option value="125">£125</option>
                        <option value="150">£150</option>
                        <option value="175">£175</option>
                        <option value="200">£200</option>
                        <option value="225">£225</option>
                        <option value="250">£250</option>
                        <option value="275">£275</option>
                        <option value="300">£300</option>
                        <option value="325">£325</option>
                        <option value="350">£350</option>
                        <option value="375">£375</option>
                        <option value="400">£400</option>
                        <option value="425">£425</option>
                        <option value="450">£450</option>
                        <option value="475">£475</option>
                        <option value="500">£500</option>
                        <option value="550">£550</option>
                        <option value="600">£600</option>
                        <option value="650">£650</option>
                        <option value="700">£700</option>
                        <option value="750">£750</option>
                        <option value="800">£800</option>
                        <option value="850">£850</option>
                        <option value="900">£900</option>
                        <option value="950">£950</option>
                        <option value="1000">£1,000</option>
                        <option value="1250">£1,250</option>
                        <option value="1500">£1,500</option>
                        <option value="1750">£1,750</option>
                        <option value="2000">£2,000</option>
                        <option value="2500">£2,500</option>
                        <option value="3000">£3,000</option>
                        <option value="3500">£3,500</option>
                        <option value="4000">£4,000</option>
                        <option value="4500">£4,500</option>
                        <option value="5000">£5,000</option>
                        <option value="7500">£7,500</option>
                        <option value="10000">£10,000</option>
                        <option value="15000">£15,000</option>
                        <option value="20000">£20,000</option>
                        <option value="25000">£25,000</option>
                      </select>
                    </div>

                    <div className="price-dropdown-wrapper">
                      <label htmlFor="max-price">Max Price</label>
                      <select
                        id="max-price"
                        value={maxPrice}
                        onChange={handleMaxPriceChange}
                        className="price-dropdown"
                      >
                        <option value="">No max</option>
                        <option value="25">£25</option>
                        <option value="50">£50</option>
                        <option value="75">£75</option>
                        <option value="100">£100</option>
                        <option value="125">£125</option>
                        <option value="150">£150</option>
                        <option value="175">£175</option>
                        <option value="200">£200</option>
                        <option value="225">£225</option>
                        <option value="250">£250</option>
                        <option value="275">£275</option>
                        <option value="300">£300</option>
                        <option value="325">£325</option>
                        <option value="350">£350</option>
                        <option value="375">£375</option>
                        <option value="400">£400</option>
                        <option value="425">£425</option>
                        <option value="450">£450</option>
                        <option value="475">£475</option>
                        <option value="500">£500</option>
                        <option value="550">£550</option>
                        <option value="600">£600</option>
                        <option value="650">£650</option>
                        <option value="700">£700</option>
                        <option value="750">£750</option>
                        <option value="800">£800</option>
                        <option value="850">£850</option>
                        <option value="900">£900</option>
                        <option value="950">£950</option>
                        <option value="1000">£1,000</option>
                        <option value="1250">£1,250</option>
                        <option value="1500">£1,500</option>
                        <option value="1750">£1,750</option>
                        <option value="2000">£2,000</option>
                        <option value="2500">£2,500</option>
                        <option value="3000">£3,000</option>
                        <option value="3500">£3,500</option>
                        <option value="4000">£4,000</option>
                        <option value="4500">£4,500</option>
                        <option value="5000">£5,000</option>
                        <option value="7500">£7,500</option>
                        <option value="10000">£10,000</option>
                        <option value="15000">£15,000</option>
                        <option value="20000">£20,000</option>
                        <option value="25000">£25,000</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {step === 4 && (
                <>
                  <h4 className="step-heading">Select Must-Haves</h4>
                  <p className="step-subtitle">Please select any must-have features for your property search.</p>

                  <div className="must-have-container">
                    <button
                      className={`property-type-button ${selectedMustHaves.includes('Garden') ? 'selected' : ''}`}
                      onClick={() => handleMustHaveSelect('Garden')}
                    >
                      <FaTree className="property-icon" />
                      Garden
                    </button>
                    <button
                      className={`property-type-button ${selectedMustHaves.includes('Parking') ? 'selected' : ''}`}
                      onClick={() => handleMustHaveSelect('Parking')}
                    >
                      <FaCar className="property-icon" />
                      Parking
                    </button>
                    <button
                      className={`property-type-button ${selectedMustHaves.includes('Retirement') ? 'selected' : ''}`}
                      onClick={() => handleMustHaveSelect('Retirement')}
                    >
                      <FaRetirement className="property-icon" />
                      Retirement
                    </button>
                    <button
                      className={`property-type-button ${selectedMustHaves.includes('New Home') ? 'selected' : ''}`}
                      onClick={() => handleMustHaveSelect('New Home')}
                    >
                      <FaStar className="property-icon" />
                      New Home
                    </button>
                  </div>
                </>
              )}

              {step === 5 && ( // Final Step: Name Your Search
                <>
                  <h4 className="step-heading">Name Your Search</h4>
                  <p className="step-subtitle">Give your search a unique name so you can easily identify it later.</p>
                  
                  {/* Input field for search name */}
                  <input
                    type="text"
                    className="search-name-input"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    placeholder="Enter search name"
                  />
                  
                  {/* Save Search Button */}
                  <button className="save-search-button" onClick={handleSaveSearch}>
                    Save Search
                  </button>
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