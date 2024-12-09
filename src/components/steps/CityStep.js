import React, { useState } from 'react';
import { 
  RiBuilding4Fill,    // Changed from RiBuilding4Line
  RiBuilding2Fill,    // Changed from RiBuilding2Line
  RiBuilding3Fill,    // Changed from RiBuildings2Line
  RiBuildingFill      // Changed from RiBuildings4Line
} from 'react-icons/ri';

const CityStep = ({ value, onChange }) => {
  const [pressedId, setPressedId] = useState(null);

  const cities = [
    { id: 'manchester', name: 'Manchester', icon: RiBuilding4Fill },
    { id: 'london', name: 'London', icon: RiBuilding2Fill },
    { id: 'nyc', name: 'New York', icon: RiBuilding3Fill, disabled: true },
    { id: 'la', name: 'Los Angeles', icon: RiBuildingFill, disabled: true }
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
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '16px',
      padding: '8px',
    },

    cityCard: (isSelected, isPressed, isDisabled) => ({
      aspectRatio: '1',
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
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      cursor: isDisabled ? 'default' : 'pointer',
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      transform: `scale(${isPressed ? 0.98 : isSelected ? 1.02 : 1})`,
      boxShadow: isSelected
        ? '0 4px 20px rgba(46, 63, 50, 0.15)'
        : '0 2px 8px rgba(46, 63, 50, 0.05)',
      opacity: isDisabled ? 0.5 : 1,
      WebkitTapHighlightColor: 'transparent',
    }),

    cityIcon: (isSelected) => ({
      fontSize: '32px',
      color: isSelected ? 'white' : '#2E3F32',
      transition: 'color 0.2s ease',
    }),

    cityName: (isSelected) => ({
      fontSize: '17px',
      fontWeight: '600',
      color: isSelected ? 'white' : '#2E3F32',
      transition: 'color 0.2s ease',
      letterSpacing: '-0.2px',
      textAlign: 'center',
    }),

    comingSoon: {
      fontSize: '13px',
      color: '#666',
      marginTop: '4px',
    },
  };

  const handleCityClick = (cityId) => {
    console.log('City clicked:', cityId);
    console.log('Current value:', value);
    console.log('Is disabled:', cities.find(city => city.id === cityId).disabled);
    
    if (!cities.find(city => city.id === cityId).disabled) {
      console.log('Calling onChange with:', cityId === value ? null : cityId);
      onChange(cityId === value ? null : cityId);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.subtitle}>Location</h3>
        <p style={styles.description}>
          Select your city to start your search
        </p>
      </div>

      <div style={styles.grid}>
        {cities.map((city) => {
          const isSelected = value === city.id;
          const isPressed = pressedId === city.id;
          const Icon = city.icon;
          
          return (
            <button
              key={city.id}
              style={styles.cityCard(isSelected, isPressed, city.disabled)}
              onClick={() => handleCityClick(city.id)}
              onMouseDown={() => !city.disabled && setPressedId(city.id)}
              onMouseUp={() => setPressedId(null)}
              onMouseLeave={() => setPressedId(null)}
              onTouchStart={() => !city.disabled && setPressedId(city.id)}
              onTouchEnd={() => setPressedId(null)}
              disabled={city.disabled}
            >
              <Icon style={styles.cityIcon(isSelected)} />
              <div>
                <div style={styles.cityName(isSelected)}>{city.name}</div>
                {city.disabled && (
                  <div style={styles.comingSoon}>Coming soon</div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CityStep; 