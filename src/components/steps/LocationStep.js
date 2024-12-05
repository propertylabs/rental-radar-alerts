import React, { useState } from 'react';
import { RiMapLine, RiSearchLine } from 'react-icons/ri';

const LocationStep = ({ values, onChange, onNext }) => {
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
            placeholder="Try 'Northern Quarter' or 'M1'"
          />
        </div>
        <button style={styles.mapButton}>
          <RiMapLine style={{ fontSize: '24px' }} />
        </button>
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