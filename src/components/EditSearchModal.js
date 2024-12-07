import React, { useState, useEffect } from 'react';
import BaseSearchModal from './BaseSearchModal.js';
import LocationStep from './steps/LocationStep.js';
import PropertyTypeStep from './steps/PropertyTypeStep.js';
import PriceBedroomsStep from './steps/PriceBedroomsStep.js';
import MustHavesStep from './steps/MustHavesStep.js';
import FinalizeStep from './steps/FinalizeStep.js';

const EditSearchModal = ({ isOpen, onClose, searchData }) => {
  console.log('EditSearchModal render:', { isOpen, searchData });

  const [step, setStep] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState({
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

  // Initialize with search data when available
  useEffect(() => {
    console.log('searchData changed:', searchData);
    if (searchData) {
      console.log('Setting search criteria with:', searchData);
      setSearchCriteria({
        locations: searchData.location.split(', '),
        propertyTypes: [searchData.type],
        minBedrooms: 1,
        maxBedrooms: 5,
        minPrice: searchData.price === 'Any price' ? 0 : parseInt(searchData.price.split('-')[0].replace('£', '')),
        maxPrice: searchData.price === 'Any price' ? 3000 : parseInt(searchData.price.split('-')[1]),
        mustHaves: [],
        name: searchData.name,
        notifications: searchData.active,
      });
    }
  }, [searchData]);

  const steps = [
    LocationStep,
    PropertyTypeStep,
    PriceBedroomsStep,
    MustHavesStep,
    FinalizeStep
  ];

  // Add reset function
  const resetModal = () => {
    setStep(0);
    setIsSaving(false);
    setIsSaved(false);
    setSearchCriteria({
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

  // Update handleSaveSearch
  const handleSaveSearch = async () => {
    if (isSaving) return;
    try {
      setIsSaving(true);
      const whopUserId = localStorage.getItem('whop_user_id');
      
      if (!whopUserId) {
        throw new Error('No user ID available');
      }

      const response = await fetch('/api/update-search', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: whopUserId,
          searchId: searchData.id,
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

      if (!response.ok) {
        throw new Error('Failed to update search');
      }

      setIsSaved(true);
      setTimeout(() => {
        resetModal();  // Reset before closing
        onClose();
        window.dispatchEvent(new CustomEvent('refreshSearches'));
      }, 500);
    } catch (error) {
      alert('Failed to update search');
      console.error('Error updating search:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const renderStep = () => {
    console.log('Rendering step:', step, 'with criteria:', searchCriteria);
    const CurrentStep = steps[step];
    
    return (
      <CurrentStep 
        values={
          step === 0 ? searchCriteria.locations :
          step === 1 ? searchCriteria.propertyTypes :
          step === 2 ? {
            minBedrooms: searchCriteria.minBedrooms,
            maxBedrooms: searchCriteria.maxBedrooms,
            minPrice: searchCriteria.minPrice,
            maxPrice: searchCriteria.maxPrice
          } :
          step === 3 ? searchCriteria.mustHaves :
          {
            name: searchCriteria.name,
            notifications: searchCriteria.notifications
          }
        }
        onChange={(values) => {
          switch(step) {
            case 0:
              setSearchCriteria({...searchCriteria, locations: values});
              break;
            case 1:
              setSearchCriteria({...searchCriteria, propertyTypes: values});
              break;
            case 2:
              setSearchCriteria({
                ...searchCriteria,
                minBedrooms: values.minBedrooms,
                maxBedrooms: values.maxBedrooms,
                minPrice: values.minPrice,
                maxPrice: values.maxPrice
              });
              break;
            case 3:
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
        isEditing={true}
      />
    );
  };

  return BaseSearchModal.renderModalFrame({
    isOpen,
    onClose: () => {
      resetModal();  // Reset before closing
      onClose();
    },
    title: 'Edit Search',
    step,
    setStep,
    children: renderStep()
  });
};

export default EditSearchModal;