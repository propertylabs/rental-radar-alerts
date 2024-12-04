import React, { useState } from 'react';
import { RiHome4Line, RiBuilding2Line, RiDoorLine } from 'react-icons/ri';

const PropertyTypeStep = ({ values, onChange, onNext }) => {
  const [errorMessage, setErrorMessage] = useState(null);

  const options = [
    { id: 'House', icon: RiHome4Line, label: 'House' },
    { id: 'Flat', icon: RiBuilding2Line, label: 'Flat' },
    { id: 'Room', icon: RiDoorLine, label: 'Room' }
  ];

  const isRoomSelected = values.includes('Room');
  const hasNonRoomSelection = values.some(v => v !== 'Room');

  const handleOptionClick = (id) => {
    if (id === 'Room' && hasNonRoomSelection) {
      showError();
      return;
    }
    
    if (id !== 'Room' && isRoomSelected) {
      showError();
      return;
    }

    if (values.includes(id)) {
      onChange(values.filter(v => v !== id));
    } else {
      onChange([...values, id]);
    }
  };

  const showError = () => {
    setErrorMessage("Room searches cannot be combined with other property types. Please create a separate search for Rooms.");
    setTimeout(() => setErrorMessage(null), 3000);
  };

  const isDisabled = (id) => {
    if (id === 'Room') return hasNonRoomSelection;
    return isRoomSelected;
  };

  const styles = {
    container: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
      padding: '0 16px',
    },

    header: {
      marginBottom: '8px',
    },

    subtitle: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#2E3F32',
      margin: '0 0 8px 0',
    },

    description: {
      fontSize: '15px',
      color: '#666',
      margin: 0,
      lineHeight: 1.4,
    },

    optionsStack: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    },

    option: (isSelected, disabled) => ({
      width: '100%',
      background: disabled 
        ? 'rgba(0, 0, 0, 0.03)' 
        : isSelected 
          ? 'linear-gradient(145deg, #2E3F32, #3A4F3E)'
          : 'rgba(46, 63, 50, 0.03)',
      backdropFilter: isSelected ? 'none' : 'blur(20px)',
      WebkitBackdropFilter: isSelected ? 'none' : 'blur(20px)',
      border: '1px solid',
      borderColor: disabled
        ? 'rgba(0, 0, 0, 0.06)'
        : isSelected 
          ? 'rgba(255, 255, 255, 0.1)'
          : 'rgba(46, 63, 50, 0.08)',
      borderRadius: '16px',
      padding: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      cursor: disabled ? 'default' : 'pointer',
      transition: 'all 0.2s ease',
      transform: isSelected && !disabled ? 'scale(1.02)' : 'scale(1)',
      boxShadow: isSelected && !disabled
        ? '0 4px 20px rgba(46, 63, 50, 0.15)'
        : '0 2px 8px rgba(46, 63, 50, 0.05)',
      opacity: disabled ? 0.5 : 1,
    }),

    optionIcon: (isSelected, disabled) => ({
      fontSize: '32px',
      color: disabled 
        ? '#999' 
        : isSelected 
          ? 'white' 
          : '#2E3F32',
      transition: 'all 0.2s ease',
    }),

    optionLabel: (isSelected, disabled) => ({
      fontSize: '16px',
      fontWeight: '600',
      color: disabled 
        ? '#999' 
        : isSelected 
          ? 'white' 
          : '#2E3F32',
      transition: 'all 0.2s ease',
    }),

    errorMessage: {
      position: 'relative',
      background: 'rgba(255, 59, 48, 0.08)',
      borderRadius: '12px',
      padding: '12px 16px',
      margin: '4px 0',
      opacity: errorMessage ? 1 : 0,
      transform: `translateY(${errorMessage ? '0' : '-10px'})`,
      transition: 'all 0.3s ease',
      pointerEvents: 'none',
    },

    errorText: {
      color: '#ff3b30',
      fontSize: '14px',
      lineHeight: '1.4',
      textAlign: 'center',
      margin: 0,
      fontWeight: '500',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
    },

    errorIcon: {
      fontSize: '16px',
      flexShrink: 0,
    },

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
      <div style={styles.header}>
        <h3 style={styles.subtitle}>Property Type</h3>
        <p style={styles.description}>
          Select the type of property you're interested in. You can choose multiple options.
        </p>
      </div>

      <div style={styles.optionsStack}>
        {options.map(({ id, icon: Icon, label }) => {
          const isDisabledOption = isDisabled(id);
          const isSelected = values.includes(id);
          
          return (
            <button
              key={id}
              style={styles.option(isSelected, isDisabledOption)}
              onClick={() => handleOptionClick(id)}
            >
              <Icon style={styles.optionIcon(isSelected, isDisabledOption)} />
              <span style={styles.optionLabel(isSelected, isDisabledOption)}>
                {label}
              </span>
            </button>
          );
        })}
      </div>

      <div style={{...styles.errorMessage, visibility: errorMessage ? 'visible' : 'hidden'}}>
        {errorMessage && (
          <p style={styles.errorText}>
            <span style={styles.errorIcon}>⚠️</span>
            {errorMessage}
          </p>
        )}
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