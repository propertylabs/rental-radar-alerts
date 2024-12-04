import React from 'react';

const PropertyTypeStep = ({ values, onChange, onNext, onBack }) => {
  const options = ['House', 'Flat', 'Room'];

  const styles = {
    container: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      padding: '0 16px',
    },

    option: (isSelected) => ({
      background: isSelected ? '#2E3F32' : 'rgba(46, 63, 50, 0.04)',
      border: '1px solid',
      borderColor: isSelected ? '#2E3F32' : 'rgba(46, 63, 50, 0.08)',
      borderRadius: '16px',
      padding: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      fontSize: '18px',
      fontWeight: '600',
      color: isSelected ? 'white' : '#2E3F32',
    }),

    nextButton: {
      position: 'absolute',
      bottom: 'max(env(safe-area-inset-bottom), 16px)',
      left: '16px',
      right: '16px',
      background: '#2E3F32',
      border: 'none',
      borderRadius: '14px',
      padding: '16px',
      color: 'white',
      fontSize: '17px',
      fontWeight: '600',
      opacity: values.length > 0 ? 1 : 0.5,
      transition: 'opacity 0.2s ease',
      cursor: values.length > 0 ? 'pointer' : 'default',
    },
  };

  const toggleOption = (option) => {
    if (values.includes(option)) {
      onChange(values.filter(v => v !== option));
    } else {
      onChange([...values, option]);
    }
  };

  return (
    <div style={styles.container}>
      {options.map(option => (
        <button
          key={option}
          style={styles.option(values.includes(option))}
          onClick={() => toggleOption(option)}
        >
          {option}
        </button>
      ))}

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