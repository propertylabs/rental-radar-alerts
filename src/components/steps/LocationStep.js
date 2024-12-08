import React, { useState, useRef, useEffect } from 'react';
import { RiMapLine, RiSearchLine, RiCloseLine } from 'react-icons/ri';

const LocationStep = ({ values, onChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const searchWrapperRef = useRef(null);

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

  const styles = {
    wrapper: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: '32px',
      padding: '0px',
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
      minHeight: '300px',
    },

    tagsContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
      gap: '8px',
      padding: '16px',
      overflowY: 'auto',
      flex: 1,
      alignContent: 'start',
      WebkitOverflowScrolling: 'touch',
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

    emptyState: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      color: '#666',
      fontSize: '15px',
      padding: '0 16px',
      fontStyle: 'italic',
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

    const results = [];

    // Direct postcode matches (exclude already selected postcodes)
    const postcodeMatches = MANCHESTER_POSTCODES.filter(postcode => 
      postcode.toLowerCase().startsWith(trimmedTerm) && !values.includes(postcode)
    );
    postcodeMatches.forEach(postcode => {
      results.push({
        type: 'postcode',
        display: postcode,
        postcodes: [postcode]
      });
    });

    // Area/landmark matches
    Object.entries(MANCHESTER_AREAS).forEach(([area, postcodes]) => {
      if (area.includes(trimmedTerm)) {
        // Only include areas that have at least one unselected postcode
        const availablePostcodes = postcodes.filter(p => !values.includes(p));
        if (availablePostcodes.length > 0) {
          results.push({
            type: 'area',
            display: area.charAt(0).toUpperCase() + area.slice(1),
            postcodes: availablePostcodes,
            totalPostcodes: postcodes.length,
            // Add this to show "X of Y postcodes" if some are already selected
            selectedCount: postcodes.length - availablePostcodes.length
          });
        }
      }
    });

    return results;
  };

  const filteredResults = getSearchResults(searchTerm);

  return (
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
        <button style={styles.mapButton}>
          <RiMapLine size={24} />
        </button>
      </div>

      <div style={styles.tagsSection}>
        {values.length > 0 ? (
          <div style={styles.tagsContainer}>
            {values.map(postcode => (
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
            ))}
          </div>
        ) : (
          <div style={styles.emptyState}>
            The postcodes you select will appear here
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationStep; 