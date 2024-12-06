import React, { useState } from 'react';
import { 
  RiParkingBoxLine,
  RiHomeWifiLine,
  RiPlantLine,
  RiDoorOpenLine,
  RiTempHotLine,
  RiWaterFlashLine
} from 'react-icons/ri';

const MustHavesStep = ({ values, onChange, onNext }) => {
  const [pressedId, setPressedId] = useState(null);

  const features = [
    { 
      id: 'parking', 
      name: 'Parking', 
      description: 'Dedicated parking space',
      icon: RiParkingBoxLine 
    },
    { 
      id: 'garden', 
      name: 'Garden', 
      description: 'Private outdoor space',
      icon: RiPlantLine 
    },
    { 
      id: 'furnished', 
      name: 'Furnished', 
      description: 'Includes basic furniture',
      icon: RiDoorOpenLine 
    },
  ];

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

    grid: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      padding: '8px',
    },

    featureCard: (isSelected, isPressed) => ({
      aspectRatio: '2.4',
      background: isSelected 
        ? 'linear-gradient(145deg, #2E3F32, #3A4F3E)'
        : 'rgba(46, 63, 50, 0.02)',
      backdropFilter: isSelected ? 'none' : 'blur(20px)',
      WebkitBackdropFilter: isSelected ? 'none' : 'blur(20px)',
      border: '1px solid',
      borderColor: isSelected 
        ? 'rgba(255, 255, 255, 0.1)'
        : 'rgba(46, 63, 50, 0.08)',
      borderRadius: '24px',
      padding: '24px',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: '16px',
      cursor: 'pointer',
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      transform: `scale(${isPressed ? 0.98 : isSelected ? 1.02 : 1})`,
      boxShadow: isSelected
        ? '0 4px 20px rgba(46, 63, 50, 0.15)'
        : '0 2px 8px rgba(46, 63, 50, 0.05)',
      WebkitTapHighlightColor: 'transparent',
    }),

    featureContent: {
      flex: 1,
    },

    featureIcon: (isSelected) => ({
      fontSize: '32px',
      color: isSelected ? 'white' : '#2E3F32',
      opacity: isSelected ? 1 : 0.8,
    }),

    featureName: (isSelected) => ({
      fontSize: '17px',
      fontWeight: '600',
      color: isSelected ? 'white' : '#2E3F32',
      marginBottom: '4px',
      letterSpacing: '-0.2px',
    }),

    featureDescription: (isSelected) => ({
      fontSize: '15px',
      color: isSelected ? 'rgba(255, 255, 255, 0.8)' : '#666',
      letterSpacing: '-0.2px',
    }),

    continueButton: {
      position: 'absolute',
      bottom: 'max(env(safe-area-inset-bottom), 24px)',
      left: '16px',
      right: '16px',
      background: values.length > 0
        ? 'linear-gradient(145deg, #2E3F32, #3A4F3E)'
        : 'rgba(46, 63, 50, 0.02)',
      border: '1px solid',
      borderColor: values.length > 0 
        ? 'transparent'
        : 'rgba(46, 63, 50, 0.08)',
      borderRadius: '16px',
      padding: '18px',
      color: values.length > 0 ? 'white' : '#2E3F32',
      fontSize: '17px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      letterSpacing: '-0.2px',
      boxShadow: values.length > 0 
        ? '0 4px 12px rgba(46, 63, 50, 0.2)'
        : 'none',
    },
  };

  const handleFeatureClick = (featureId) => {
    if (values.includes(featureId)) {
      onChange(values.filter(id => id !== featureId));
    } else {
      onChange([...values, featureId]);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.subtitle}>Must-Haves</h3>
        <p style={styles.description}>
          Select the features that are essential for your property
        </p>
      </div>

      <div style={styles.grid}>
        {features.map((feature) => {
          const isSelected = values.includes(feature.id);
          const isPressed = pressedId === feature.id;
          const Icon = feature.icon;
          
          return (
            <button
              key={feature.id}
              style={styles.featureCard(isSelected, isPressed)}
              onClick={() => handleFeatureClick(feature.id)}
              onMouseDown={() => setPressedId(feature.id)}
              onMouseUp={() => setPressedId(null)}
              onMouseLeave={() => setPressedId(null)}
              onTouchStart={() => setPressedId(feature.id)}
              onTouchEnd={() => setPressedId(null)}
            >
              <Icon style={styles.featureIcon(isSelected)} />
              <div style={styles.featureContent}>
                <div style={styles.featureName(isSelected)}>{feature.name}</div>
                <div style={styles.featureDescription(isSelected)}>{feature.description}</div>
              </div>
            </button>
          );
        })}
      </div>

      <button 
        style={styles.continueButton}
        onClick={onNext}
      >
        {values.length > 0 ? 'Continue' : 'Skip'}
      </button>
    </div>
  );
};

export default MustHavesStep; 