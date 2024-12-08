import React, { useState } from 'react';
import BaseSearchModal from './BaseSearchModal.js';
import CityStep from './steps/CityStep.js';
import LocationStep from './steps/LocationStep.js';
import PropertyTypeStep from './steps/PropertyTypeStep.js';
import PriceBedroomsStep from './steps/PriceBedroomsStep.js';
import MustHavesStep from './steps/MustHavesStep.js';
import FinalizeStep from './steps/FinalizeStep.js';

const SearchModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
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

  const steps = [
    CityStep,
    LocationStep,
    PropertyTypeStep,
    PriceBedroomsStep,
    MustHavesStep,
    FinalizeStep
  ];

  const handleSaveSearch = async () => {
    if (isSaving) return;
    
    try {
      setIsSaving(true);
      const whopUserId = localStorage.getItem('whop_user_id');
      
      if (!whopUserId) {
        throw new Error('No user ID available');
      }

      const endpoint = '/api/save-search';
      const method = 'POST';

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
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to save search');
      }

      setStep(0);
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

  const renderStep = () => {
    const CurrentStep = steps[step];
    
    return (
      <CurrentStep 
        value={step === 0 ? searchCriteria.city : null}
        values={step !== 0 ? (
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
        ) : null}
        onChange={(values) => {
          switch(step) {
            case 0:
              console.log('City step change:', values);
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
      />
    );
  };

  return BaseSearchModal.renderModalFrame({
    isOpen,
    onClose: () => {
      onClose();
      setStep(0);
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
    },
    title: 'New Search',
    buttonState: {
      onClick: step === steps.length - 1 ? handleSaveSearch : () => setStep(prev => prev + 1),
      text: step === steps.length - 1 
        ? (isSaving ? 'Saving...' : 'Save Search') 
        : (step === 4 && searchCriteria.mustHaves.length === 0 ? 'Skip' : 'Continue'),
      disabled: step === 0 
        ? !searchCriteria.city 
        : step === 1 
          ? searchCriteria.locations.length === 0 
          : step === 2 
            ? searchCriteria.propertyTypes.length === 0 
            : false,
      opacity: (step === 0 && !searchCriteria.city) ||
              (step === 1 && searchCriteria.locations.length === 0) ||
              (step === 2 && searchCriteria.propertyTypes.length === 0) ||
              (step === 4 && searchCriteria.name.trim() === '')
                ? 0.5 
                : 1
    },
    children: renderStep()
  });
};

export default SearchModal; 