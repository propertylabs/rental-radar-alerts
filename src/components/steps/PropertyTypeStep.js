import React, { useState } from 'react';
import { RiHome4Line, RiBuilding2Line, RiDoorLine } from 'react-icons/ri';

const PropertyTypeStep = ({ values, onChange, onNext, isEditing, onBack }) => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [errorButtonId, setErrorButtonId] = useState(null);
  const [pressedId, setPressedId] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [localValues, setLocalValues] = useState(values);

  const options = [
    { 
      id: 'House', 
      icon: RiHome4Line, 
      label: 'House',
      description: 'Detached, semi-detached, or terraced houses'
    },
    { 
      id: 'Flat', 
      icon: RiBuilding2Line, 
      label: 'Flat',
      description: 'Apartments and maisonettes'
    },
    { 
      id: 'Room', 
      icon: RiDoorLine, 
      label: 'Room',
      description: 'Single rooms in shared properties'
    }
  ];

  const isRoomSelected = values.includes('Room');
  const hasNonRoomSelection = values.some(v => v !== 'Room');

  const handleOptionClick = (id) => {
    if ((id === 'Room' && hasNonRoomSelection) || 
        (id !== 'Room' && isRoomSelected)) {
      showError(id);
      return;
    }
    
    if (values.includes(id)) {
      onChange(values.filter(v => v !== id));
    } else {
      onChange([...values, id]);
    }
  };

  const showError = (buttonId) => {
    setErrorButtonId(buttonId);
    setErrorMessage("Room searches cannot be combined with other property types. Please create a separate search for Rooms.");
    setTimeout(() => {
      setErrorButtonId(null);
      setErrorMessage(null);
    }, 3000);
  };

  const isDisabled = (id) => {
    if (id === 'Room') return hasNonRoomSelection;
    return isRoomSelected;
  };

  const handleChange = (newValues) => {
    setLocalValues(newValues);
    setHasChanges(true);
  };

  const styles = {
    container: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
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

    optionsStack: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
    },

    option: (isSelected, disabled, isPressed, showingError) => ({
      width: '100%',
      background: disabled 
        ? 'rgba(0, 0, 0, 0.03)' 
        : isSelected 
          ? 'linear-gradient(145deg, #2E3F32, #3A4F3E)'
          : 'rgba(46, 63, 50, 0.02)',
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
      flexDirection: 'column',
      gap: '8px',
      cursor: disabled ? 'default' : 'pointer',
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      transform: `scale(${isPressed ? 0.98 : isSelected && !disabled ? 1.02 : 1})`,
      boxShadow: isSelected && !disabled
        ? '0 4px 20px rgba(46, 63, 50, 0.15)'
        : '0 2px 8px rgba(46, 63, 50, 0.05)',
      opacity: disabled ? 0.5 : 1,
      WebkitTapHighlightColor: 'transparent',
      position: 'relative',
      overflow: 'hidden',
    }),

    optionTop: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },

    optionIcon: (isSelected, disabled) => ({
      fontSize: '24px',
      color: disabled 
        ? '#999' 
        : isSelected 
          ? 'white' 
          : '#2E3F32',
      transition: 'all 0.2s ease',
    }),

    optionLabel: (isSelected, disabled) => ({
      fontSize: '17px',
      fontWeight: '600',
      color: disabled 
        ? '#999' 
        : isSelected 
          ? 'white' 
          : '#2E3F32',
      transition: 'all 0.2s ease',
      letterSpacing: '-0.2px',
    }),

    optionDescription: (isSelected, disabled) => ({
      fontSize: '14px',
      color: disabled 
        ? '#999' 
        : isSelected 
          ? 'rgba(255, 255, 255, 0.8)' 
          : '#666',
      transition: 'all 0.2s ease',
      letterSpacing: '-0.1px',
    }),

    errorMessage: {
      background: 'rgba(46, 63, 50, 0.04)',
      borderRadius: '12px', // Slightly smaller
      padding: '10px 16px', // Reduced padding
      margin: '0', // Remove margin
      opacity: errorMessage ? 1 : 0,
      transform: `translateY(${errorMessage ? '0' : '-10px'})`,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      position: 'relative',
      zIndex: 10000,
    },

    errorText: {
      color: '#2E3F32',
      fontSize: '14px', // Slightly smaller
      lineHeight: 1.3, // Tighter line height
      textAlign: 'center',
      margin: 0,
      fontWeight: '500',
      letterSpacing: '-0.2px',
      display: 'flex',
      alignItems: 'center',
      gap: '6px', // Space between icon and text
    },

    errorIcon: {
      fontSize: '16px',
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
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      cursor: values.length > 0 ? 'pointer' : 'default',
      letterSpacing: '-0.2px',
      boxShadow: values.length > 0 
        ? '0 4px 12px rgba(46, 63, 50, 0.2)'
        : 'none',
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
        {options.map(({ id, icon: Icon, label, description }) => {
          const isDisabledOption = isDisabled(id);
          const isSelected = values.includes(id);
          const isPressed = pressedId === id;
          const showingError = errorButtonId === id;
          
          return (
            <button
              key={id}
              style={styles.option(isSelected, isDisabledOption, isPressed, showingError)}
              onClick={() => handleOptionClick(id)}
              onMouseDown={() => setPressedId(id)}
              onMouseUp={() => setPressedId(null)}
              onMouseLeave={() => setPressedId(null)}
              onTouchStart={() => setPressedId(id)}
              onTouchEnd={() => setPressedId(null)}
            >
              <div style={styles.optionTop}>
                <Icon style={styles.optionIcon(isSelected, isDisabledOption)} />
                <span style={styles.optionLabel(isSelected, isDisabledOption)}>
                  {label}
                </span>
              </div>
              <span style={styles.optionDescription(isSelected, isDisabledOption)}>
                {description}
              </span>
            </button>
          );
        })}
      </div>

      <div style={{...styles.errorMessage, visibility: errorMessage ? 'visible' : 'hidden'}}>
        {errorMessage && (
          <p style={styles.errorText}>
            <span style={styles.errorIcon}>ⓘ</span>
            {" " + errorMessage} {/* Add space after icon */}
          </p>
        )}
      </div>

      <button 
        style={styles.nextButton}
        onClick={hasChanges ? () => onChange(localValues) : onBack}
      >
        {hasChanges ? 'Save Changes' : 'Back'}
      </button>
    </div>
  );
};

export default PropertyTypeStep; 