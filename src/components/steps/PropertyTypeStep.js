import React from 'react';
import { RiHome4Line, RiBuilding2Line, RiDoorLine } from 'react-icons/ri';

const PropertyTypeStep = ({ values, onChange, onNext }) => {
  const options = [
    { id: 'House', icon: RiHome4Line, label: 'House' },
    { id: 'Flat', icon: RiBuilding2Line, label: 'Flat' },
    { id: 'Room', icon: RiDoorLine, label: 'Room' }
  ];

  const styles = {
    container: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      padding: '0 16px',
    },

    optionsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '12px',
      marginTop: '8px',
    },

    option: (isSelected) => ({
      background: isSelected 
        ? 'linear-gradient(145deg, #2E3F32, #3A4F3E)'
        : 'rgba(46, 63, 50, 0.03)',
      backdropFilter: isSelected ? 'none' : 'blur(20px)',
      WebkitBackdropFilter: isSelected ? 'none' : 'blur(20px)',
      border: '1px solid',
      borderColor: isSelected 
        ? 'rgba(255, 255, 255, 0.1)'
        : 'rgba(46, 63, 50, 0.08)',
      borderRadius: '20px',
      padding: '24px 20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '12px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      transform: isSelected ? 'scale(1.02)' : 'scale(1)',
      boxShadow: isSelected 
        ? '0 4px 20px rgba(46, 63, 50, 0.15)'
        : '0 2px 8px rgba(46, 63, 50, 0.05)',
    }),

    optionIcon: (isSelected) => ({
      fontSize: '32px',
      color: isSelected ? 'white' : '#2E3F32',
      transition: 'all 0.2s ease',
    }),

    optionLabel: (isSelected) => ({
      fontSize: '16px',
      fontWeight: '600',
      color: isSelected ? 'white' : '#2E3F32',
      transition: 'all 0.2s ease',
    }),

    nextButton: {
      position: 'absolute',
      bottom: 'max(env(safe-area-inset-bottom), 16px)',
      left: '16px',
      right: '16px',
      background: values.length > 0 ? '#2E3F32' : 'rgba(46, 63, 50, 0.1)',
      border: 'none',
      borderRadius: '14px',
      padding: '16px',
      color: values.length > 0 ? 'white' : '#666',
      fontSize: '17px',
      fontWeight: '600',
      transition: 'all 0.2s ease',
      cursor: values.length > 0 ? 'pointer' : 'default',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.optionsGrid}>
        {options.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            style={styles.option(values.includes(id))}
            onClick={() => {
              if (values.includes(id)) {
                onChange(values.filter(v => v !== id));
              } else {
                onChange([...values, id]);
              }
            }}
          >
            <Icon style={styles.optionIcon(values.includes(id))} />
            <span style={styles.optionLabel(values.includes(id))}>
              {label}
            </span>
          </button>
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

export default PropertyTypeStep; 