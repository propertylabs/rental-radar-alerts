import React, { useState } from 'react';
import { 
  RiParkingBoxLine,
  RiHomeWifiLine,
  RiPlantLine,
  RiDoorOpenLine,
  RiTempHotLine,
  RiWaterFlashLine
} from 'react-icons/ri';

const MustHavesStep = ({ values, onChange }) => {
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
      width: '100%',
      background: isSelected 
        ? 'linear-gradient(145deg, #2E3F32, #3A4F3E)'
        : 'rgba(46, 63, 50, 0.02)',
      backdropFilter: isSelected ? 'none' : 'blur(20px)',
      WebkitBackdropFilter: isSelected ? 'none' : 'blur(20px)',
      border: '1px solid',
      borderColor: isSelected 
        ? 'rgba(255, 255, 255, 0.1)'
        : 'rgba(46, 63, 50, 0.08)',
      borderRadius: '16px',
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      cursor: 'pointer',
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      transform: `scale(${isPressed ? 0.98 : isSelected ? 1.02 : 1})`,
      boxShadow: isSelected
        ? '0 4px 20px rgba(46, 63, 50, 0.15)'
        : '0 2px 8px rgba(46, 63, 50, 0.05)',
      WebkitTapHighlightColor: 'transparent',
    }),

    featureTop: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },

    featureIcon: (isSelected) => ({
      fontSize: '24px',
      color: isSelected ? 'white' : '#2E3F32',
      transition: 'all 0.2s ease',
    }),

    featureName: (isSelected) => ({
      fontSize: '17px',
      fontWeight: '600',
      color: isSelected ? 'white' : '#2E3F32',
      transition: 'all 0.2s ease',
      letterSpacing: '-0.2px',
    }),

    featureDescription: (isSelected) => ({
      fontSize: '14px',
      color: isSelected ? 'rgba(255, 255, 255, 0.8)' : '#666',
      transition: 'all 0.2s ease',
      letterSpacing: '-0.1px',
    }),
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
              <div style={styles.featureTop}>
                <Icon style={styles.featureIcon(isSelected)} />
                <span style={styles.featureName(isSelected)}>{feature.name}</span>
              </div>
              <span style={styles.featureDescription(isSelected)}>{feature.description}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MustHavesStep; 