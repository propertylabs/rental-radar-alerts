import React, { useState } from 'react';
import CityStep from './steps/CityStep.js';
import LocationStep from './steps/LocationStep.js';
import PropertyTypeStep from './steps/PropertyTypeStep.js';
import PriceBedroomsStep from './steps/PriceBedroomsStep.js';
import MustHavesStep from './steps/MustHavesStep.js';
import FinalizeStep from './steps/FinalizeStep.js';

const SearchModal = ({ isOpen, onClose, searchToEdit }) => {
  const isEditing = !!searchToEdit;

  const getPriceValues = () => {
    if (!searchToEdit?.price) return { minPrice: 0, maxPrice: 3000 };
    const [min, max] = searchToEdit.price.split('-');
    return {
      minPrice: parseInt(min?.replace('£', '')) || 0,
      maxPrice: parseInt(max) || 3000
    };
  };

  const steps = isEditing ? [
    LocationStep,
    PropertyTypeStep,
    PriceBedroomsStep,
    MustHavesStep,
    FinalizeStep
  ] : [
    CityStep,
    LocationStep,
    PropertyTypeStep,
    PriceBedroomsStep,
    MustHavesStep,
    FinalizeStep
  ];

  const [step, setStep] = useState(isEditing ? 0 : 0);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState({
    city: searchToEdit?.city || null,
    locations: searchToEdit?.location?.split(', ') || [],
    propertyTypes: searchToEdit?.type ? [searchToEdit.type] : [],
    minBedrooms: parseInt(searchToEdit?.criteria?.minBedrooms) || 1,
    maxBedrooms: parseInt(searchToEdit?.criteria?.maxBedrooms) || 5,
    ...getPriceValues(),
    mustHaves: searchToEdit?.criteria?.mustHaves || [],
    name: searchToEdit?.name || '',
    notifications: searchToEdit?.notifications ?? true,
  });

  const modalTitle = isEditing ? 'Edit Search' : 'New Search';

  const handleSaveSearch = async () => {
    if (isSaving) return;
    
    try {
      setIsSaving(true);
      const whopUserId = localStorage.getItem('whop_user_id');
      
      if (!whopUserId) {
        throw new Error('No user ID available');
      }

      const endpoint = isEditing ? '/api/update-search' : '/api/save-search';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(endpoint, {
        method,
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
          notifications: searchCriteria.notifications,
          ...(isEditing && { searchId: searchToEdit.id }),
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to save search');
      }

      setStep(1);
      setIsSaving(false);
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
      
      onClose();

      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('refreshSearches'));
      }, 500);

    } catch (error) {
      console.error('Error saving search:', error);
      setIsSaving(false);
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
    console.log('Current step:', step);
    console.log('Steps array:', steps);
    console.log('Current step component:', steps[step]);
    console.log('Search criteria:', searchCriteria);
    
    const CurrentStep = steps[step];
    
    if (!CurrentStep) {
      console.error('No step component found for step:', step);
      return null;
    }
    
    return (
      <CurrentStep 
        values={
          step === 0 ? searchCriteria.city :
          step === 1 ? searchCriteria.locations :
          step === 2 ? searchCriteria.propertyTypes :
          step === 3 ? {
            minBedrooms: searchCriteria.minBedrooms,
            maxBedrooms: searchCriteria.maxBedrooms,
            minPrice: searchCriteria.minPrice,
            maxPrice: searchCriteria.maxPrice
          } :
          step === 4 ? searchCriteria.mustHaves :
          {
            name: searchCriteria.name,
            notifications: searchCriteria.notifications
          }
        }
        onChange={(values) => {
          switch(step) {
            case 0:
              setSearchCriteria({...searchCriteria, city: values});
              break;
            case 1:
              setSearchCriteria({...searchCriteria, locations: values});
              break;
            case 2:
              setSearchCriteria({...searchCriteria, propertyTypes: values});
              break;
            case 3:
              setSearchCriteria({
                ...searchCriteria,
                minBedrooms: values.minBedrooms,
                maxBedrooms: values.maxBedrooms,
                minPrice: values.minPrice,
                maxPrice: values.maxPrice
              });
              break;
            case 4:
              setSearchCriteria({...searchCriteria, mustHaves: values});
              break;
            default:
              setSearchCriteria({
                ...searchCriteria,
                name: values.name,
                notifications: values.notifications
              });
          }
        }}
        onNext={() => setStep(prev => prev + 1)}
        onSave={step === steps.length - 1 ? handleSaveSearch : undefined}
        isSaving={isSaving}
        isSaved={isSaved}
        isEditing={isEditing}
      />
    );
  };

  const handleCloseButton = () => {
    console.log('Inside handleCloseButton');
    onClose();
    setStep(1);
    setIsSaving(false);
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
              <h2 style={styles.title}>{modalTitle}</h2>
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