import React, { useState, useRef } from 'react';
import { RiMapLine, RiSearchLine, RiCloseLine } from 'react-icons/ri';

const LocationStep = ({ values, onChange, onNext }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const MANCHESTER_POSTCODES = [
    'M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8', 'M9',
    'M11', 'M12', 'M13', 'M14', 'M15', 'M16', 'M17', 'M18', 'M19',
    'M20', 'M21', 'M22', 'M23', 'M24', 'M25', 'M26', 'M27', 'M28', 'M29',
    'M30', 'M31', 'M32', 'M33', 'M34', 'M35', 'M38', 'M40', 'M41', 'M43',
    'M44', 'M45', 'M46', 'M50', 'M90'
  ];

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

    // ... rest of the styles for dropdown and tags remain similar
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <h2 style={styles.title}>Location</h2>
        <p style={styles.subtitle}>Search for areas, landmarks, or postcodes</p>
      </div>

      <div style={styles.inputRow}>
        <div style={styles.searchWrapper}>
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