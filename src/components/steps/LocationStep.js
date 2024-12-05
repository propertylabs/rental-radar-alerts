import React, { useState, useRef, useEffect } from 'react';
import { RiMapLine, RiSearchLine, RiCloseLine } from 'react-icons/ri';

const LocationStep = ({ values, onChange, onNext }) => {
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
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
      padding: '0',
    },

    header: {
      paddingBottom: '8px',
    },

    title: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#2E3F32',
      marginBottom: '8px',
      letterSpacing: '-0.5px',
    },

    subtitle: {
      fontSize: '17px',
      color: '#666',
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
    }
  };

  const filteredPostcodes = MANCHESTER_POSTCODES.filter(postcode => 
    postcode.toLowerCase().startsWith(searchTerm.trim().toLowerCase())
  );

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
              {filteredPostcodes.length > 0 ? (
                filteredPostcodes.map(postcode => (
                  <div
                    key={postcode}
                    style={styles.dropdownItem}
                    onClick={() => {
                      if (!values.includes(postcode)) {
                        onChange([...values, postcode.trim()]);
                      }
                      setSearchTerm('');
                      setShowDropdown(false);
                    }}
                  >
                    {postcode}
                  </div>
                ))
              ) : (
                <div style={styles.noResults}>
                  No matching postcodes found
                </div>
              )}
            </div>
          )}
        </div>
        <button style={styles.mapButton}>
          <RiMapLine size={24} />
        </button>
      </div>

      {/* ... rest of the component for dropdown and tags */}
    </div>
  );
};

export default LocationStep; 