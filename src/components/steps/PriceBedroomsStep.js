import React, { useState, useEffect } from 'react';
import { RiHotelBedLine, RiMoneyPoundCircleLine } from 'react-icons/ri';

const PriceBedroomsStep = ({ values, onChange, onNext }) => {
  // Destructure or set default values
  const {
    minBedrooms = 1,
    maxBedrooms = 5,
    minPrice = 0,
    maxPrice = 3000
  } = values;

  const [priceRange, setPriceRange] = useState([minPrice, maxPrice]);
  const [bedroomRange, setBedroomRange] = useState([minBedrooms, maxBedrooms]);
  const [isDragging, setIsDragging] = useState(false);

  // Format price for display
  const formatPrice = (price) => {
    if (price >= 1000) {
      return `£${(price/1000).toFixed(1)}k`;
    }
    return `£${price}`;
  };

  // Handle price range change
  const handlePriceChange = (newRange) => {
    setPriceRange(newRange);
    onChange({
      ...values,
      minPrice: newRange[0],
      maxPrice: newRange[1]
    });
  };

  // Handle bedroom range change
  const handleBedroomChange = (newRange) => {
    setBedroomRange(newRange);
    onChange({
      ...values,
      minBedrooms: newRange[0],
      maxBedrooms: newRange[1]
    });
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

    section: {
      background: 'rgba(46, 63, 50, 0.02)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderRadius: '24px',
      padding: '24px',
      border: '1px solid rgba(46, 63, 50, 0.08)',
    },

    sectionHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '20px',
    },

    sectionIcon: {
      fontSize: '24px',
      color: '#2E3F32',
    },

    sectionTitle: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#2E3F32',
      margin: 0,
      letterSpacing: '-0.3px',
    },

    rangeContainer: {
      position: 'relative',
      height: '40px',
      margin: '20px 0',
    },

    rangeTrack: {
      position: 'absolute',
      width: '100%',
      height: '6px',
      backgroundColor: 'rgba(46, 63, 50, 0.1)',
      borderRadius: '3px',
      top: '50%',
      transform: 'translateY(-50%)',
    },

    rangeProgress: {
      position: 'absolute',
      height: '6px',
      background: 'linear-gradient(145deg, #2E3F32, #3A4F3E)',
      borderRadius: '3px',
      top: '50%',
      transform: 'translateY(-50%)',
    },

    rangeHandle: (active) => ({
      position: 'absolute',
      width: '28px',
      height: '28px',
      background: 'white',
      borderRadius: '50%',
      top: '50%',
      transform: `translate(-50%, -50%) scale(${active ? 1.1 : 1})`,
      boxShadow: active 
        ? '0 2px 12px rgba(46, 63, 50, 0.2)' 
        : '0 2px 8px rgba(46, 63, 50, 0.15)',
      cursor: 'pointer',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      border: '2px solid #2E3F32',
    }),

    valueDisplay: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '12px',
    },

    value: {
      fontSize: '15px',
      fontWeight: '600',
      color: '#2E3F32',
      letterSpacing: '-0.2px',
    },

    nextButton: {
      position: 'absolute',
      bottom: 'max(env(safe-area-inset-bottom), 24px)',
      left: '16px',
      right: '16px',
      background: 'linear-gradient(145deg, #2E3F32, #3A4F3E)',
      border: 'none',
      borderRadius: '16px',
      padding: '18px',
      color: 'white',
      fontSize: '17px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      letterSpacing: '-0.2px',
      boxShadow: '0 4px 12px rgba(46, 63, 50, 0.2)',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.subtitle}>Price & Bedrooms</h3>
        <p style={styles.description}>
          Set your preferred price range and number of bedrooms.
        </p>
      </div>

      {/* Price Range Section */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <RiMoneyPoundCircleLine style={styles.sectionIcon} />
          <h4 style={styles.sectionTitle}>Monthly Rent</h4>
        </div>
        
        {/* Price Range Slider Implementation */}
        <div style={styles.rangeContainer}>
          <div style={styles.rangeTrack} />
          <div 
            style={{
              ...styles.rangeProgress,
              left: `${(priceRange[0] / 3000) * 100}%`,
              width: `${((priceRange[1] - priceRange[0]) / 3000) * 100}%`
            }} 
          />
          {/* Range handles */}
        </div>
        
        <div style={styles.valueDisplay}>
          <span style={styles.value}>{formatPrice(priceRange[0])}</span>
          <span style={styles.value}>{formatPrice(priceRange[1])}</span>
        </div>
      </div>

      {/* Bedrooms Section */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <RiHotelBedLine style={styles.sectionIcon} />
          <h4 style={styles.sectionTitle}>Bedrooms</h4>
        </div>
        
        {/* Bedrooms Range Slider Implementation */}
        <div style={styles.rangeContainer}>
          <div style={styles.rangeTrack} />
          <div 
            style={{
              ...styles.rangeProgress,
              left: `${((bedroomRange[0] - 1) / 4) * 100}%`,
              width: `${((bedroomRange[1] - bedroomRange[0]) / 4) * 100}%`
            }} 
          />
          {/* Range handles */}
        </div>
        
        <div style={styles.valueDisplay}>
          <span style={styles.value}>{bedroomRange[0]} bed</span>
          <span style={styles.value}>{bedroomRange[1]} bed</span>
        </div>
      </div>

      <button 
        style={styles.nextButton}
        onClick={onNext}
      >
        Continue
      </button>
    </div>
  );
};

export default PriceBedroomsStep; 