import React, { useState, useEffect, useRef, useCallback } from 'react';
import { RiHotelBedLine, RiMoneyPoundCircleLine } from 'react-icons/ri';

const PriceBedroomsStep = ({ values, onChange, onNext }) => {
  const [activeDragHandle, setActiveDragHandle] = useState(null);
  const [sliderWidth, setSliderWidth] = useState(0);
  const sliderRef = useRef(null);
  const bedroomSliderRef = useRef(null);

  // Price range configuration
  const MAX_PRICE = 25000;
  const TRANSITION_POINT = 5000; // Where the scale changes
  const TRANSITION_PERCENTAGE = 0.75; // 75% of slider for 0-5000

  // Convert price to slider position (non-linear)
  const priceToPosition = (price) => {
    if (price === null) return 0;
    if (price <= TRANSITION_POINT) {
      return (price / TRANSITION_POINT) * TRANSITION_PERCENTAGE * 100;
    }
    const remainingPercentage = 100 - (TRANSITION_PERCENTAGE * 100);
    const priceAboveTransition = price - TRANSITION_POINT;
    const maxPriceAboveTransition = MAX_PRICE - TRANSITION_POINT;
    return (TRANSITION_PERCENTAGE * 100) + 
           (priceAboveTransition / maxPriceAboveTransition) * remainingPercentage;
  };

  // Convert slider position to price (non-linear)
  const positionToPrice = (position) => {
    const percentage = position / 100;
    const transitionPosition = TRANSITION_PERCENTAGE;
    
    if (percentage <= transitionPosition) {
      return Math.round((percentage / transitionPosition) * TRANSITION_POINT);
    } else {
      const remainingPercentage = (percentage - transitionPosition) / (1 - transitionPosition);
      return Math.round(TRANSITION_POINT + (remainingPercentage * (MAX_PRICE - TRANSITION_POINT)));
    }
  };

  // Format price for display
  const formatPrice = (price) => {
    if (price === null || price === 0) return 'No min';
    if (price >= MAX_PRICE) return 'No max';
    if (price >= 1000) {
      return `£${(price/1000).toFixed(1)}k`;
    }
    return `£${price}`;
  };

  const handleDragStart = (handle) => {
    setActiveDragHandle(handle);
  };

  const handleDrag = useCallback((event) => {
    if (!activeDragHandle || !sliderRef.current) return;

    const isBedroomHandle = activeDragHandle.includes('Bed');
    const currentRef = isBedroomHandle ? bedroomSliderRef.current : sliderRef.current;
    const rect = currentRef.getBoundingClientRect();
    const x = event.type.includes('touch') 
      ? event.touches[0].clientX 
      : event.clientX;
    
    let percentage = ((x - rect.left) / rect.width) * 100;
    percentage = Math.max(0, Math.min(100, percentage));
    
    if (isBedroomHandle) {
      const newValue = positionToBedroomValue(percentage);
      if (activeDragHandle === 'minBed') {
        if (newValue < values.maxBedrooms) {
          onChange({
            ...values,
            minBedrooms: newValue
          });
        }
      } else {
        if (newValue > values.minBedrooms) {
          onChange({
            ...values,
            maxBedrooms: newValue
          });
        }
      }
    } else {
      const newPrice = positionToPrice(percentage);
      if (activeDragHandle === 'min') {
        if (newPrice < values.maxPrice) {
          onChange({
            ...values,
            minPrice: newPrice
          });
        }
      } else {
        if (newPrice > values.minPrice) {
          onChange({
            ...values,
            maxPrice: newPrice === MAX_PRICE ? MAX_PRICE : newPrice
          });
        }
      }
    }
  }, [activeDragHandle, values, onChange]);

  const handleDragEnd = () => {
    setActiveDragHandle(null);
  };

  useEffect(() => {
    if (activeDragHandle) {
      window.addEventListener('mousemove', handleDrag);
      window.addEventListener('mouseup', handleDragEnd);
      window.addEventListener('touchmove', handleDrag);
      window.addEventListener('touchend', handleDragEnd);

      return () => {
        window.removeEventListener('mousemove', handleDrag);
        window.removeEventListener('mouseup', handleDragEnd);
        window.removeEventListener('touchmove', handleDrag);
        window.removeEventListener('touchend', handleDragEnd);
      };
    }
  }, [activeDragHandle, handleDrag]);

  useEffect(() => {
    if (sliderRef.current) {
      setSliderWidth(sliderRef.current.offsetWidth);
    }
  }, []);

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

  // Add bedroom configuration
  const BEDROOM_TYPES = ['Studio', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10+'];

  // Convert bedroom value to display text
  const formatBedrooms = (value) => {
    if (value === 0) return 'Studio';
    if (value >= 10) return '10+';
    return value.toString();
  };

  // Convert bedroom position to value (0 = Studio, 10 = 10+)
  const positionToBedroomValue = (position) => {
    const value = Math.round((position / 100) * 10);
    return Math.max(0, Math.min(10, value));
  };

  // Convert bedroom value to position
  const bedroomValueToPosition = (value) => {
    if (value === 0) return 0; // Studio
    if (value >= 10) return 100; // 10+
    return (value / 10) * 100;
  };

  // Add check for Room type
  const isRoomSelected = values.propertyTypes?.includes('Room');

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
      transition: active ? 'none' : 'transform 0.2s ease, box-shadow 0.2s ease',
      border: '2px solid #2E3F32',
      zIndex: active ? 2 : 1,
      touchAction: 'none',
    }),

    valueDisplay: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '12px',
    },

    valueContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',  // Left value
    },

    valueContainerRight: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',  // Right value
    },

    valueLabel: {
      fontSize: '13px',
      color: '#999',
      marginBottom: '4px',
      fontWeight: '500',
      letterSpacing: '-0.2px',
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

    sectionDisabled: {
      background: 'rgba(46, 63, 50, 0.02)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderRadius: '24px',
      padding: '24px',
      border: '1px solid rgba(46, 63, 50, 0.08)',
      opacity: 0.5,
      pointerEvents: 'none',
      position: 'relative',
    },

    disabledMessage: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      color: '#666',
      fontSize: '15px',
      fontWeight: '500',
      textAlign: 'center',
      width: '100%',
      padding: '0 20px',
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
        <div style={styles.rangeContainer} ref={sliderRef}>
          <div style={styles.rangeTrack} />
          <div 
            style={{
              ...styles.rangeProgress,
              left: `${priceToPosition(values.minPrice)}%`,
              width: `${priceToPosition(values.maxPrice) - priceToPosition(values.minPrice)}%`
            }} 
          />
          <div
            style={{
              ...styles.rangeHandle(activeDragHandle === 'min'),
              left: `${priceToPosition(values.minPrice)}%`,
            }}
            onMouseDown={() => handleDragStart('min')}
            onTouchStart={() => handleDragStart('min')}
          />
          <div
            style={{
              ...styles.rangeHandle(activeDragHandle === 'max'),
              left: `${priceToPosition(values.maxPrice)}%`,
            }}
            onMouseDown={() => handleDragStart('max')}
            onTouchStart={() => handleDragStart('max')}
          />
        </div>
        
        <div style={styles.valueDisplay}>
          <div style={styles.valueContainer}>
            <span style={styles.valueLabel}>min</span>
            <span style={styles.value}>{formatPrice(values.minPrice)}</span>
          </div>
          <div style={styles.valueContainerRight}>
            <span style={styles.valueLabel}>max</span>
            <span style={styles.value}>{formatPrice(values.maxPrice)}</span>
          </div>
        </div>
      </div>

      {/* Bedrooms Section */}
      <div style={isRoomSelected ? styles.sectionDisabled : styles.section}>
        <div style={styles.sectionHeader}>
          <RiHotelBedLine style={styles.sectionIcon} />
          <h4 style={styles.sectionTitle}>Bedrooms</h4>
        </div>
        
        {isRoomSelected ? (
          <div style={styles.disabledMessage}>
            Not applicable for room searches
          </div>
        ) : (
          <>
            {/* Bedrooms Range Slider Implementation */}
            <div style={styles.rangeContainer} ref={bedroomSliderRef}>
              <div style={styles.rangeTrack} />
              <div 
                style={{
                  ...styles.rangeProgress,
                  left: `${bedroomValueToPosition(values.minBedrooms)}%`,
                  width: `${bedroomValueToPosition(values.maxBedrooms) - bedroomValueToPosition(values.minBedrooms)}%`
                }} 
              />
              <div
                style={{
                  ...styles.rangeHandle(activeDragHandle === 'minBed'),
                  left: `${bedroomValueToPosition(values.minBedrooms)}%`,
                }}
                onMouseDown={() => handleDragStart('minBed')}
                onTouchStart={() => handleDragStart('minBed')}
              />
              <div
                style={{
                  ...styles.rangeHandle(activeDragHandle === 'maxBed'),
                  left: `${bedroomValueToPosition(values.maxBedrooms)}%`,
                }}
                onMouseDown={() => handleDragStart('maxBed')}
                onTouchStart={() => handleDragStart('maxBed')}
              />
            </div>
          </>
        )}
        
        <div style={styles.valueDisplay}>
          <div style={styles.valueContainer}>
            <span style={styles.valueLabel}>min</span>
            <span style={styles.value}>{formatBedrooms(values.minBedrooms)}</span>
          </div>
          <div style={styles.valueContainerRight}>
            <span style={styles.valueLabel}>max</span>
            <span style={styles.value}>{formatBedrooms(values.maxBedrooms)}</span>
          </div>
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