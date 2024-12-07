import React, { useState } from 'react';
import { RiMapPinLine } from 'react-icons/ri';

const PostcodesStep = ({ values, onChange, onNext }) => {
  const [pressedId, setPressedId] = useState(null);

  const postcodes = ['M1', 'M2', 'M3', 'M4', 'M5'];

  const styles = {
    wrapper: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
      padding: '0',
      height: '100%',
      maxHeight: 'calc(100% - 80px)',
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

    optionsStack: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
    },

    option: (isSelected, isPressed) => ({
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
      alignItems: 'center',
      gap: '12px',
      cursor: 'pointer',
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      transform: `scale(${isPressed ? 0.98 : isSelected ? 1.02 : 1})`,
      boxShadow: isSelected
        ? '0 4px 20px rgba(46, 63, 50, 0.15)'
        : '0 2px 8px rgba(46, 63, 50, 0.05)',
      WebkitTapHighlightColor: 'transparent',
    }),

    icon: (isSelected) => ({
      fontSize: '24px',
      color: isSelected ? 'white' : '#2E3F32',
      transition: 'color 0.2s ease',
    }),

    label: (isSelected) => ({
      fontSize: '17px',
      fontWeight: '600',
      color: isSelected ? 'white' : '#2E3F32',
      transition: 'color 0.2s ease',
      letterSpacing: '-0.2px',
    }),

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

  const handleOptionClick = (postcode) => {
    if (values.includes(postcode)) {
      onChange(values.filter(p => p !== postcode));
    } else {
      onChange([...values, postcode]);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <h2 style={styles.title}>Location</h2>
        <p style={styles.subtitle}>
          Select the areas you're interested in. You can choose multiple postcodes.
        </p>
      </div>

      <div style={styles.optionsStack}>
        {postcodes.map((postcode) => {
          const isSelected = values.includes(postcode);
          const isPressed = pressedId === postcode;
          
          return (
            <button
              key={postcode}
              style={styles.option(isSelected, isPressed)}
              onClick={() => handleOptionClick(postcode)}
              onMouseDown={() => setPressedId(postcode)}
              onMouseUp={() => setPressedId(null)}
              onMouseLeave={() => setPressedId(null)}
              onTouchStart={() => setPressedId(postcode)}
              onTouchEnd={() => setPressedId(null)}
            >
              <RiMapPinLine style={styles.icon(isSelected)} />
              <span style={styles.label(isSelected)}>
                {postcode}
              </span>
            </button>
          );
        })}
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

export default PostcodesStep; 