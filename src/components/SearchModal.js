import React, { useState } from 'react';
import CityStep from './steps/CityStep.js';
import LocationStep from './steps/LocationStep.js';
import PropertyTypeStep from './steps/PropertyTypeStep.js';
import PriceBedroomsStep from './steps/PriceBedroomsStep.js';
import MustHavesStep from './steps/MustHavesStep.js';
import FinalizeStep from './steps/FinalizeStep.js';

const SearchModal = ({ isOpen, onClose, whopUserId }) => {
  const [step, setStep] = useState(1);
  const [searchCriteria, setSearchCriteria] = useState({
    city: null,
    locations: [],
    propertyTypes: [],
    minBedrooms: 1,
    maxBedrooms: 5,
    minPrice: 0,
    maxPrice: 3000,
    mustHaves: [],
    name: '',
    notifications: true,
  });

  const handleSaveSearch = async () => {
    try {
      console.log('Starting save search process...');
      
      const whopUserId = localStorage.getItem('whop_user_id');
      if (!whopUserId) {
        throw new Error('No user ID available');
      }

      const response = await fetch('/api/save-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: whopUserId,
          search_name: searchCriteria.name,
          postcodes: searchCriteria.locations,
          min_price: searchCriteria.minPrice,
          max_price: searchCriteria.maxPrice,
          min_bedrooms: searchCriteria.minBedrooms,
          max_bedrooms: searchCriteria.maxBedrooms,
          property_types: searchCriteria.propertyTypes,
          must_haves: searchCriteria.mustHaves,
          notifications: searchCriteria.notifications
        }),
      });

      console.log('API Response status:', response.status);
      const data = await response.json();
      console.log('API Response data:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save search');
      }

      console.log('Search saved successfully!');
      onClose();
    } catch (error) {
      console.error('Error saving search:', error);
    }
  };

  const styles = {
    backdrop: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.4)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      zIndex: 100000,
      display: 'flex',
      alignItems: 'flex-end',
      transition: 'opacity 0.3s ease',
      opacity: isOpen ? 1 : 0,
      pointerEvents: isOpen ? 'auto' : 'none',
      touchAction: 'none',
    },

    modal: {
      position: 'relative',
      width: '100%',
      height: 'calc(100dvh - env(safe-area-inset-top) - 100px)',
      background: 'white',
      borderTopLeftRadius: '20px',
      borderTopRightRadius: '20px',
      padding: '24px',
      transform: `translateY(${isOpen ? '0' : '100%'})`,
      transition: 'transform 0.3s ease',
      overflowY: 'hidden',
      touchAction: 'none',
    },

    header: {
      padding: '0px',
      marginBottom: '24px',
    },

    headerContent: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '32px',
    },

    headerLeft: {
      flex: 1,
      display: 'flex',
      justifyContent: 'flex-start',
    },

    headerCenter: {
      flex: 2,
      display: 'flex',
      justifyContent: 'center',
    },

    headerRight: {
      flex: 1,
      display: 'flex',
      justifyContent: 'flex-end',
    },

    title: {
      fontSize: '24px',
      fontWeight: '600',
      margin: 0,
      lineHeight: '32px',
    },

    backButton: {
      background: 'none',
      border: 'none',
      padding: '0',
      height: '32px',
      color: '#007AFF',
      fontSize: '17px',
      fontWeight: '500',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
    },

    closeButton: {
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      background: 'rgba(0, 0, 0, 0.06)',
      border: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      color: '#666',
      fontSize: '18px',
      transition: 'background-color 0.2s ease',
      padding: '0 0 1px 0',
      lineHeight: '18px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return <CityStep 
          value={searchCriteria.city}
          onChange={(city) => setSearchCriteria({...searchCriteria, city})}
          onNext={() => setStep(2)}
        />;
      case 2:
        return <LocationStep 
          values={searchCriteria.locations}
          city={searchCriteria.city}
          onChange={(locations) => setSearchCriteria({...searchCriteria, locations})}
          onNext={() => setStep(3)}
        />;
      case 3:
        return <PropertyTypeStep 
          values={searchCriteria.propertyTypes}
          onChange={(types) => setSearchCriteria({...searchCriteria, propertyTypes: types})}
          onNext={() => setStep(4)}
        />;
      case 4:
        return <PriceBedroomsStep 
          values={{
            minBedrooms: searchCriteria.minBedrooms,
            maxBedrooms: searchCriteria.maxBedrooms,
            minPrice: searchCriteria.minPrice,
            maxPrice: searchCriteria.maxPrice
          }}
          onChange={(values) => setSearchCriteria({
            ...searchCriteria,
            minBedrooms: values.minBedrooms,
            maxBedrooms: values.maxBedrooms,
            minPrice: values.minPrice,
            maxPrice: values.maxPrice
          })}
          onNext={() => setStep(5)}
        />;
      case 5:
        return <MustHavesStep 
          values={searchCriteria.mustHaves}
          onChange={(mustHaves) => setSearchCriteria({...searchCriteria, mustHaves})}
          onNext={() => setStep(6)}
        />;
      case 6:
        return <FinalizeStep 
          values={{
            name: searchCriteria.name,
            notifications: searchCriteria.notifications
          }}
          onChange={(values) => setSearchCriteria({
            ...searchCriteria,
            name: values.name,
            notifications: values.notifications
          })}
          onSave={handleSaveSearch}
        />;
      default:
        return null;
    }
  };

  const handleCloseButton = () => {
    onClose();
    setStep(1);
    setSearchCriteria({
      city: null,
      locations: [],
      propertyTypes: [],
      minBedrooms: 1,
      maxBedrooms: 5,
      minPrice: 0,
      maxPrice: 3000,
      mustHaves: [],
      name: '',
      notifications: true,
    });
  };

  const handleBackdropClose = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div style={styles.backdrop} onClick={handleBackdropClose}>
      <div 
        style={styles.modal} 
        onClick={(e) => e.stopPropagation()}
      >
        <div style={styles.header}>
          <div style={styles.headerContent}>
            <div style={styles.headerLeft}>
              {step > 1 && (
                <button style={styles.backButton} onClick={() => setStep(prev => prev - 1)}>
                  ← Back
                </button>
              )}
            </div>
            <div style={styles.headerCenter}>
              <h2 style={styles.title}>New Search</h2>
            </div>
            <div style={styles.headerRight}>
              <button style={styles.closeButton} onClick={handleCloseButton}>×</button>
            </div>
          </div>
        </div>
        {renderStep()}
      </div>
    </div>
  );
};

export default SearchModal; 