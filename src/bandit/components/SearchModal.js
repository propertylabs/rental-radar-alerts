import React, { useState } from 'react';
import PostcodesStep from './steps/PostcodesStep.js';
import PropertyTypeStep from './steps/PropertyTypeStep.js';
import PriceBedroomsStep from './steps/PriceBedroomsStep.js';
import CityStep from './steps/CityStep.js';

const SearchModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [searchCriteria, setSearchCriteria] = useState({
    city: null,
    postcodes: [],
    propertyTypes: [],
    minBedrooms: 1,
    maxBedrooms: 5,
    minPrice: 0,
    maxPrice: 3000,
  });

  const styles = {
    // ... existing styles remain the same ...
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
        return <PostcodesStep 
          values={searchCriteria.postcodes}
          city={searchCriteria.city}
          onChange={(postcodes) => setSearchCriteria({...searchCriteria, postcodes})}
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
            maxPrice: searchCriteria.maxPrice,
            propertyTypes: searchCriteria.propertyTypes
          }}
          onChange={(values) => setSearchCriteria({
            ...searchCriteria,
            minBedrooms: values.minBedrooms,
            maxBedrooms: values.maxBedrooms,
            minPrice: values.minPrice,
            maxPrice: values.maxPrice
          })}
          onNext={() => onClose()}
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
      postcodes: [],
      propertyTypes: [],
      minBedrooms: 1,
      maxBedrooms: 5,
      minPrice: 0,
      maxPrice: 3000,
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