import React, { useState, useRef, useEffect } from 'react';
import { RiMapLine, RiSearchLine, RiCloseLine, RiArrowLeftLine } from 'react-icons/ri';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import londonGeoJSON from '../../data/london-postcodes.json';
import manchesterGeoJSON from '../../data/manchester-postcodes.geojson';

// This is fine since it's a public token
mapboxgl.accessToken = 'pk.eyJ1IjoicHJvcGVydHlsYWJzIiwiYSI6ImNtNGg3d3hpbTAzdW0ycXIwNzM0aDVwd3EifQ.i5CHRd7TtWIgFcRNUokNCw';

const LocationStep = ({ value, values, onChange }) => {
  console.log('LocationStep received:', { city: value, postcodes: values });

  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const searchWrapperRef = useRef(null);
  const [showMap, setShowMap] = useState(false);
  const mapContainer = useRef(null);
  const map = useRef(null);

  const LONDON_POSTCODES = [
    'E1', 'E1W', 'E2', 'E3', 'E4', 'E5', 'E6', 'E7', 'E8', 'E9', 'E10', 'E11', 'E12', 'E13', 'E14', 'E15', 'E16', 'E17', 'E18', 'E20',
    'EC1A', 'EC1M', 'EC1N', 'EC1R', 'EC1V', 'EC1Y', 'EC2A', 'EC2M', 'EC2N', 'EC2R', 'EC2V', 'EC2Y', 'EC3A', 'EC3M', 'EC3N', 'EC3R', 'EC3V', 'EC4A', 'EC4M',
    'SW1H', 'SW1P', 'SW1V', 'SW1W', 'SW1X', 'SW1Y',
    'W1B', 'W1C', 'W1D', 'W1F', 'W1G', 'W1H', 'W1J', 'W1K', 'W1S', 'W1T', 'W1U', 'W1W',
    'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10', 'W11', 'W12', 'W13', 'W14',
    'WC1A', 'WC1B', 'WC1E', 'WC1H', 'WC1N', 'WC1R', 'WC1V', 'WC1X', 'WC2A', 'WC2B', 'WC2E', 'WC2H', 'WC2N', 'WC2R'
  ];

  const MANCHESTER_POSTCODES = [
    'M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8', 'M9',
    'M11', 'M12', 'M13', 'M14', 'M15', 'M16', 'M17', 'M18', 'M19',
    'M20', 'M21', 'M22', 'M23', 'M24', 'M25', 'M26', 'M27', 'M28', 'M29',
    'M30', 'M31', 'M32', 'M33', 'M34', 'M35', 'M38', 'M40', 'M41', 'M43',
    'M44', 'M45', 'M46', 'M50', 'M90'
  ];

  const MANCHESTER_AREAS = {
    // City Areas
    'northern quarter': ['M1', 'M4'],
    'ancoats': ['M4', 'M11'],
    'city centre': ['M1', 'M2', 'M3', 'M4'],
    'deansgate': ['M3'],
    'castlefield': ['M3', 'M15'],
    'green quarter': ['M4'],
    'spinningfields': ['M3'],
    'piccadilly': ['M1'],
    
    // Popular Areas
    'chorlton': ['M21'],
    'didsbury': ['M20'],
    'west didsbury': ['M20'],
    'east didsbury': ['M19', 'M20'],
    'fallowfield': ['M14'],
    'rusholme': ['M14'],
    'withington': ['M20'],
    'levenshulme': ['M19'],
    'salford quays': ['M50'],
    'media city': ['M50'],
    
    // Landmarks
    'manchester arena': ['M3'],
    'manchester piccadilly': ['M1'],
    'manchester victoria': ['M3'],
    'old trafford': ['M16'],
    'etihad stadium': ['M11'],
    'university of manchester': ['M13'],
    'manchester metropolitan': ['M15'],
    'trafford centre': ['M17'],
  };

  const LONDON_AREAS = {
    // Central London
    'mayfair': ['W1J', 'W1K'],
    'soho': ['W1D', 'W1F'],
    'covent garden': ['WC2E', 'WC2H', 'WC2B'],
    'city of london': ['EC1', 'EC2', 'EC3', 'EC4'],
    'shoreditch': ['E1', 'EC2A'],
    'clerkenwell': ['EC1R', 'EC1V'],
    
    // West London
    'notting hill': ['W11'],
    'kensington': ['W8'],
    'chelsea': ['SW1W'],
    'knightsbridge': ['SW1X'],
    'paddington': ['W2'],
    'hammersmith': ['W6'],
    'chiswick': ['W4'],
    
    // East London
    'canary wharf': ['E14'],
    'stratford': ['E15', 'E20'],
    'hackney': ['E8', 'E9'],
    'bethnal green': ['E2'],
    'bow': ['E3'],
    'mile end': ['E1', 'E3'],
    
    // Landmarks & Stations
    'london bridge': ['SE1'],
    'kings cross': ['N1C', 'WC1H'],
    'liverpool street': ['EC2M', 'EC3A'],
    'oxford street': ['W1C', 'W1B'],
    'piccadilly circus': ['W1J'],
    'bond street': ['W1S'],
    'bank': ['EC2R', 'EC3V'],
    
    // Business Districts
    'square mile': ['EC2N', 'EC2R', 'EC2V', 'EC3'],
    'west end': ['W1', 'WC2'],
    'tech city': ['EC1V', 'EC2A'],
    
    // Popular Areas
    'angel': ['EC1V'],
    'old street': ['EC1V', 'EC1Y'],
    'holborn': ['WC1V', 'WC2'],
    'fitzrovia': ['W1T', 'W1W'],
    'marylebone': ['W1U', 'W1G'],
    'bloomsbury': ['WC1A', 'WC1B', 'WC1E', 'WC1H', 'WC1N'],
  };

  const getAvailablePostcodes = () => {
    console.log('Getting postcodes for city:', value);
    if (value === 'london') return LONDON_POSTCODES;
    if (value === 'manchester') return MANCHESTER_POSTCODES;
    return [];
  };

  const getAreaMapping = () => {
    if (value === 'london') return LONDON_AREAS;
    if (value === 'manchester') return MANCHESTER_AREAS;
    return {};
  };

  const availablePostcodes = getAvailablePostcodes();
  console.log('Available postcodes:', availablePostcodes);
  const areaMapping = getAreaMapping();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && 
          !dropdownRef.current.contains(event.target) && 
          !searchWrapperRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Initialize map when showing
  useEffect(() => {
    if (!showMap) return;

    const cityCenter = value === 'london' 
      ? [-0.118092, 51.509865] 
      : [-2.244644, 53.483959];

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: cityCenter,
      zoom: 11
    });

    map.current.on('load', () => {
      // Add source
      const geoJSON = value === 'london' ? londonGeoJSON : manchesterGeoJSON;
      const features = normalizeGeoJSON(geoJSON, value);
      
      map.current.addSource('postcodes', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: features.map(f => ({
            ...f,
            properties: {
              ...f.properties,
              selected: values.includes(f.properties.postcode)
            }
          }))
        }
      });

      // Add fill layer
      map.current.addLayer({
        id: 'postcode-fills',
        type: 'fill',
        source: 'postcodes',
        paint: {
          'fill-color': [
            'case',
            ['get', 'selected'], '#2E3F32',
            'rgba(46, 63, 50, 0.1)'
          ],
          'fill-opacity': [
            'case',
            ['boolean', ['feature-state', 'hover'], false], 0.8,
            0.6
          ]
        }
      });

      // Add outline layer
      map.current.addLayer({
        id: 'postcode-outlines',
        type: 'line',
        source: 'postcodes',
        paint: {
          'line-color': '#2E3F32',
          'line-width': 1,
          'line-opacity': 0.3
        }
      });

      // Add hover effects
      let hoveredStateId = null;

      map.current.on('mousemove', 'postcode-fills', (e) => {
        if (e.features.length > 0) {
          if (hoveredStateId !== null) {
            map.current.setFeatureState(
              { source: 'postcodes', id: hoveredStateId },
              { hover: false }
            );
          }
          hoveredStateId = e.features[0].id;
          map.current.setFeatureState(
            { source: 'postcodes', id: hoveredStateId },
            { hover: true }
          );
        }
      });

      // Add click handler
      map.current.on('click', 'postcode-fills', (e) => {
        if (e.features.length > 0) {
          const postcode = e.features[0].properties.postcode;
          const isSelected = values.includes(postcode);
          
          if (isSelected) {
            onChange(values.filter(p => p !== postcode));
          } else {
            onChange([...values, postcode]);
          }

          // Update the visual state
          map.current.setFeatureState(
            { source: 'postcodes', id: e.features[0].id },
            { selected: !isSelected }
          );
        }
      });

      // Change cursor on hover
      map.current.on('mouseenter', 'postcode-fills', () => {
        map.current.getCanvas().style.cursor = 'pointer';
      });

      map.current.on('mouseleave', 'postcode-fills', () => {
        map.current.getCanvas().style.cursor = '';
        if (hoveredStateId !== null) {
          map.current.setFeatureState(
            { source: 'postcodes', id: hoveredStateId },
            { hover: false }
          );
        }
        hoveredStateId = null;
      });
    });

    return () => map.current?.remove();
  }, [showMap, value, values]);

  // Add map button click handler
  const handleMapButtonClick = () => {
    setShowMap(true);
  };

  const styles = {
    wrapper: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: '32px',
      padding: '0px',
      height: '100%',
      minHeight: '100%',
    },

    header: {
      marginBottom: '4px',
    },

    title: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#2E3F32',
      margin: '0 0 8px 0',
      letterSpacing: '-0.5px',
    },

    subtitle: {
      fontSize: '17px',
      color: '#666',
      margin: 0,
      lineHeight: 1.4,
      letterSpacing: '-0.2px',
    },

    inputRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      margin: '0 8px',
    },

    searchWrapper: {
      position: 'relative',
      width: 'calc(100% - 70px)',
      height: '58px',
    },

    searchIcon: {
      position: 'absolute',
      left: '16px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#2E3F32',
      opacity: 0.3,
      zIndex: 1,
    },

    input: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '58px',
      background: 'rgba(46, 63, 50, 0.02)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(46, 63, 50, 0.08)',
      borderRadius: '16px',
      padding: '0 16px 0 48px',
      fontSize: '17px',
      color: '#2E3F32',
      outline: 'none',
      boxSizing: 'border-box',
    },

    mapButton: {
      width: '58px',
      height: '58px',
      flexShrink: 0,
      background: 'rgba(46, 63, 50, 0.02)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(46, 63, 50, 0.08)',
      borderRadius: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      color: '#2E3F32',
    },

    '@keyframes slideIn': {
      from: {
        opacity: 0,
        transform: 'translateY(-8px)',
      },
      to: {
        opacity: 1,
        transform: 'translateY(0)',
      }
    },

    dropdown: {
      position: 'absolute',
      top: 'calc(100% + 4px)',
      left: 0,
      width: 'calc(100% + 70px)',
      background: 'white',
      borderRadius: '16px',
      boxShadow: '0 4px 20px rgba(46, 63, 50, 0.1)',
      border: '1px solid rgba(46, 63, 50, 0.08)',
      maxHeight: '240px',
      overflowY: 'auto',
      zIndex: 10,
      animation: 'slideIn 0.2s ease-out',
      transformOrigin: 'top',
    },

    dropdownItem: {
      padding: '14px 16px',
      fontSize: '17px',
      color: '#2E3F32',
      cursor: 'pointer',
      transition: 'background-color 0.2s ease',
      ':hover': {
        background: 'rgba(46, 63, 50, 0.04)',
      },
    },

    noResults: {
      padding: '14px 16px',
      fontSize: '15px',
      color: '#666',
      textAlign: 'center',
    },

    tagsSection: {
      margin: '0 8px',
      flex: 1,
      background: 'rgba(46, 63, 50, 0.02)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(46, 63, 50, 0.08)',
      borderRadius: '16px',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      height: '100%',
    },

    tagsContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
      gap: '8px',
      padding: '16px',
      overflowY: 'auto',
      flex: 1,
      alignContent: values.length > 0 ? 'start' : 'center',
      justifyContent: 'center',
      WebkitOverflowScrolling: 'touch',
      minHeight: '100%',
    },

    emptyState: {
      color: '#666',
      fontSize: '15px',
      fontStyle: 'italic',
      gridColumn: '1 / -1',
      textAlign: 'center',
    },

    tag: {
      display: 'flex',
      alignItems: 'center',
      height: '48px',
      padding: '0 14px',
      background: 'white',
      border: '1px solid rgba(46, 63, 50, 0.08)',
      borderRadius: '12px',
      fontSize: '26px',
      color: '#2E3F32',
      fontWeight: '600',
      letterSpacing: '-0.5px',
      fontFamily: 'SF Mono, Menlo, monospace',
      boxShadow: '0 2px 6px rgba(46, 63, 50, 0.06)',
      position: 'relative',
      paddingRight: '46px',
    },

    removeTag: {
      position: 'absolute',
      right: '7px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      color: '#666',
      cursor: 'pointer',
      ':hover': {
        background: 'rgba(46, 63, 50, 0.06)',
        color: '#ff3b30',
      },
    },

    '@keyframes tagAppear': {
      from: {
        opacity: 0,
        transform: 'scale(0.8)',
      },
      to: {
        opacity: 1,
        transform: 'scale(1)',
      }
    },
  };

  const getSearchResults = (term) => {
    const trimmedTerm = term.trim().toLowerCase();
    
    if (!trimmedTerm) return [];

    console.log('Searching with term:', trimmedTerm);
    console.log('Available postcodes:', availablePostcodes);
    console.log('Area mapping:', areaMapping);

    const results = [];

    // Direct postcode matches
    const postcodeMatches = availablePostcodes.filter(postcode => 
      postcode.toLowerCase().startsWith(trimmedTerm) && !values.includes(postcode)
    );

    console.log('Postcode matches:', postcodeMatches);

    postcodeMatches.forEach(postcode => {
      results.push({
        type: 'postcode',
        display: postcode,
        postcodes: [postcode]
      });
    });

    // Area matches
    Object.entries(areaMapping).forEach(([area, postcodes]) => {
      if (area.includes(trimmedTerm)) {
        const availablePostcodes = postcodes.filter(p => !values.includes(p));
        if (availablePostcodes.length > 0) {
          results.push({
            type: 'area',
            display: area.charAt(0).toUpperCase() + area.slice(1),
            postcodes: availablePostcodes,
            totalPostcodes: postcodes.length,
            selectedCount: postcodes.length - availablePostcodes.length
          });
        }
      }
    });

    return results;
  };

  const filteredResults = getSearchResults(searchTerm);

  // Add map styles
  const mapStyles = {
    mapContainer: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1000,
    },
    backButton: {
      position: 'absolute',
      top: '16px',
      left: '16px',
      zIndex: 1001,
      width: '58px',
      height: '58px',
      background: 'white',
      border: '1px solid rgba(46, 63, 50, 0.08)',
      borderRadius: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
      color: '#2E3F32',
    }
  };

  const normalizeGeoJSON = (source, city) => {
    if (city === 'london') {
      return source.features.map(feature => ({
        type: 'Feature',
        geometry: feature.geometry,
        properties: {
          postcode: feature.properties.Name,
          selected: false
        }
      }));
    }
    
    // Manchester data is already in the format we want
    return source.features;
  };

  return (
    <>
      <div style={styles.wrapper}>
        <div style={styles.header}>
          <h2 style={styles.title}>Location</h2>
          <p style={styles.subtitle}>Search for areas, landmarks, or postcodes</p>
        </div>

        <div style={styles.inputRow}>
          <div style={styles.searchWrapper} ref={searchWrapperRef}>
            <RiSearchLine size={20} style={styles.searchIcon} />
            <input
              style={styles.input}
              placeholder="Try 'M1' or 'M20'"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowDropdown(true);
              }}
            />
            {showDropdown && searchTerm && (
              <div style={styles.dropdown} ref={dropdownRef}>
                {filteredResults.length > 0 ? (
                  filteredResults.map((result, index) => (
                    <div
                      key={`${result.type}-${index}`}
                      style={{
                        ...styles.dropdownItem,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                      onClick={() => {
                        const newPostcodes = result.postcodes.filter(
                          postcode => !values.includes(postcode)
                        );
                        if (newPostcodes.length > 0) {
                          onChange([...values, ...newPostcodes]);
                        }
                        setSearchTerm('');
                        setShowDropdown(false);
                      }}
                    >
                      <span>{result.display}</span>
                      {result.type === 'area' && (
                        <span style={{
                          fontSize: '13px',
                          color: '#666',
                          marginLeft: '8px',
                        }}>
                          {result.selectedCount > 0 ? (
                            `${result.postcodes.length} of ${result.totalPostcodes} postcodes`
                          ) : (
                            result.postcodes.join(', ')
                          )}
                        </span>
                      )}
                    </div>
                  ))
                ) : (
                  <div style={styles.noResults}>
                    No matching areas or postcodes found
                  </div>
                )}
              </div>
            )}
          </div>
          <button style={styles.mapButton} onClick={handleMapButtonClick}>
            <RiMapLine size={24} />
          </button>
        </div>

        <div style={styles.tagsSection}>
          <div style={styles.tagsContainer}>
            {values.length > 0 ? (
              values.map(postcode => (
                <div 
                  key={postcode} 
                  style={{
                    ...styles.tag,
                    animation: 'tagAppear 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  <span style={{ userSelect: 'none' }}>{postcode}</span>
                  <div 
                    style={styles.removeTag}
                    onClick={(e) => {
                      e.currentTarget.parentElement.style.transform = 'scale(0.8)';
                      e.currentTarget.parentElement.style.opacity = '0';
                      setTimeout(() => {
                        onChange(values.filter(p => p !== postcode));
                      }, 150);
                    }}
                  >
                    <RiCloseLine size={26} />
                  </div>
                </div>
              ))
            ) : (
              <span style={styles.emptyState}>
                The postcodes you select will appear here
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Add Map View */}
      {showMap && (
        <div style={mapStyles.mapContainer}>
          <div 
            style={mapStyles.backButton}
            onClick={() => setShowMap(false)}
          >
            <RiArrowLeftLine size={24} />
          </div>
          <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
        </div>
      )}
    </>
  );
};

export default LocationStep; 