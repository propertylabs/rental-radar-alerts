import React, { useState, useRef, useEffect } from 'react';
import { RiMapLine, RiSearchLine, RiCloseLine } from 'react-icons/ri';

const LocationStep = ({ values, onChange, onNext }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const MANCHESTER_POSTCODES = [
    'M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8', 'M9',
    'M11', 'M12', 'M13', 'M14', 'M15', 'M16', 'M17', 'M18', 'M19',
    'M20', 'M21', 'M22', 'M23', 'M24', 'M25', 'M26', 'M27', 'M28', 'M29',
    'M30', 'M31', 'M32', 'M33', 'M34', 'M35', 'M38', 'M40', 'M41', 'M43',
    'M44', 'M45', 'M46', 'M50', 'M90'
  ];

  const filteredPostcodes = MANCHESTER_POSTCODES.filter(postcode => 
    postcode.toLowerCase().startsWith(searchTerm.toLowerCase())
  );

  const handlePostcodeSelect = (postcode) => {
    if (!values.includes(postcode)) {
      onChange([...values, postcode]);
    }
    setSearchTerm('');
    setShowDropdown(false);
  };

  const handleRemovePostcode = (postcodeToRemove) => {
    onChange(values.filter(postcode => postcode !== postcodeToRemove));
  };

  const styles = {
    container: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: '32px',
      padding: '0px',
    },

    header: {
      marginBottom: '4px',
    },

    subtitle: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#2E3F32',
      margin: '0 0 8px 0',
      letterSpacing: '-0.5px',
    },

    description: {
      fontSize: '17px',
      color: '#666',
      margin: 0,
      lineHeight: 1.4,
      letterSpacing: '-0.2px',
    },

    searchSection: {
      display: 'flex',
      gap: '12px',
      padding: '8px',
    },

    searchContainer: {
      flex: 1,
      position: 'relative',
    },

    searchBar: {
      width: '100%',
      height: '56px',
      background: 'rgba(46, 63, 50, 0.02)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(46, 63, 50, 0.08)',
      borderRadius: '16px',
      padding: '0 16px 0 48px', // Space for the search icon
      fontSize: '17px',
      color: '#2E3F32',
      transition: 'all 0.2s ease',
      outline: 'none',
    },

    searchIcon: {
      position: 'absolute',
      left: '16px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#2E3F32',
      fontSize: '20px',
      opacity: 0.5,
    },

    mapButton: {
      width: '56px',
      height: '56px',
      background: 'rgba(46, 63, 50, 0.02)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(46, 63, 50, 0.08)',
      borderRadius: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      color: '#2E3F32',
    },

    nextButton: {
      position: 'absolute',
      bottom: 'max(env(safe-area-inset-bottom), 24px)',
      left: '16px',
      right: '16px',
      background: values.length > 0
        ? 'linear-gradient(145deg, #2E3F32, #3A4F3E)'
        : 'rgba(46, 63, 50, 0.1)',
      border: 'none',
      borderRadius: '16px',
      padding: '18px',
      color: values.length > 0 ? 'white' : '#666',
      fontSize: '17px',
      fontWeight: '600',
      cursor: values.length > 0 ? 'pointer' : 'default',
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      letterSpacing: '-0.2px',
      boxShadow: values.length > 0
        ? '0 4px 12px rgba(46, 63, 50, 0.2)'
        : 'none',
    },

    tagContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '8px',
      padding: '16px 8px',
      minHeight: '48px',
    },

    tag: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      padding: '6px 12px',
      background: 'rgba(46, 63, 50, 0.06)',
      borderRadius: '8px',
      fontSize: '15px',
      color: '#2E3F32',
      fontWeight: '500',
      transition: 'all 0.2s ease',
    },

    removeTag: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      padding: '2px',
      borderRadius: '50%',
      transition: 'all 0.2s ease',
    },

    dropdown: {
      position: 'absolute',
      top: '100%',
      left: '0',
      right: '0',
      maxHeight: '200px',
      overflowY: 'auto',
      background: 'white',
      borderRadius: '16px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
      border: '1px solid rgba(46, 63, 50, 0.08)',
      marginTop: '8px',
      zIndex: 1000,
    },

    dropdownItem: {
      padding: '12px 16px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      ':hover': {
        background: 'rgba(46, 63, 50, 0.04)',
      },
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.subtitle}>Location</h3>
        <p style={styles.description}>
          Search for areas, landmarks, or postcodes
        </p>
      </div>

      <div style={styles.searchSection}>
        <div style={styles.searchContainer}>
          <RiSearchLine style={styles.searchIcon} />
          <input
            style={styles.searchBar}
            placeholder="Try 'M1' or 'M20'"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowDropdown(true);
            }}
          />
          {showDropdown && searchTerm && (
            <div style={styles.dropdown} ref={dropdownRef}>
              {filteredPostcodes.map(postcode => (
                <div
                  key={postcode}
                  style={styles.dropdownItem}
                  onClick={() => handlePostcodeSelect(postcode)}
                >
                  {postcode}
                </div>
              ))}
            </div>
          )}
        </div>
        <button style={styles.mapButton}>
          <RiMapLine style={{ fontSize: '24px' }} />
        </button>
      </div>

      <div style={styles.tagContainer}>
        {values.map(postcode => (
          <div key={postcode} style={styles.tag}>
            {postcode}
            <div 
              style={styles.removeTag}
              onClick={() => handleRemovePostcode(postcode)}
            >
              <RiCloseLine style={{ fontSize: '18px' }} />
            </div>
          </div>
        ))}
      </div>

      <button 
        style={styles.nextButton}
        onClick={onNext}
        disabled={values.length === 0}
      >
        Continue
      </button>
    </div>
  );
};

export default LocationStep; 