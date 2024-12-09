import React, { useState, useEffect } from 'react';
import BaseSearchModal from './BaseSearchModal.js';
import LocationStep from './steps/LocationStep.js';
import PropertyTypeStep from './steps/PropertyTypeStep.js';
import PriceBedroomsStep from './steps/PriceBedroomsStep.js';
import MustHavesStep from './steps/MustHavesStep.js';
import FinalizeStep from './steps/FinalizeStep.js';
import { RiMapPinLine, RiHome4Line, RiPriceTag3Line, RiCheckboxLine, RiBellLine, RiArrowRightSLine } from 'react-icons/ri';
import EditStepComponent from './steps/EditStepComponent.js';

const ACCENT = '#2E3F32'; // Deep forest green

// Move EditMenuStep outside of EditSearchModal
const EditMenuStep = ({ steps, onSelectStep }) => {
  const styles = {
    container: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      padding: '0px',
    },

    header: {
      marginBottom: '4px',
    },

    title: {
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

    menuList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    },

    menuItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      padding: '16px',
      margin: '0 8px',
      background: 'rgba(46, 63, 50, 0.02)',
      borderRadius: '16px',
      border: '1px solid rgba(46, 63, 50, 0.08)',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      WebkitTapHighlightColor: 'transparent',
      ':active': {
        transform: 'scale(0.98)',
        opacity: 0.9,
      },
    },

    menuItemIcon: {
      fontSize: '24px',
      color: ACCENT,
      flexShrink: 0,
    },

    menuItemContent: {
      flex: 1,
    },

    menuItemTitle: {
      fontSize: '17px',
      fontWeight: '600',
      color: ACCENT,
      marginBottom: '4px',
    },

    menuItemDescription: {
      fontSize: '15px',
      color: '#666',
      lineHeight: 1.3,
    },

    menuItemArrow: {
      fontSize: '20px',
      color: '#666',
      flexShrink: 0,
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Edit Search</h2>
        <p style={styles.description}>
          Choose what you'd like to modify
        </p>
      </div>

      <div style={styles.menuList}>
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <button
              key={step.id}
              style={styles.menuItem}
              onClick={() => onSelectStep(step.id)}
            >
              <Icon style={styles.menuItemIcon} />
              <div style={styles.menuItemContent}>
                <div style={styles.menuItemTitle}>{step.title}</div>
                <div style={styles.menuItemDescription}>{step.description}</div>
              </div>
              <RiArrowRightSLine style={styles.menuItemArrow} />
            </button>
          );
        })}
      </div>
    </div>
  );
};

const EditSearchModal = ({ isOpen, onClose, searchData }) => {
  const [selectedStep, setSelectedStep] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [originalValues, setOriginalValues] = useState(null);
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

  // Complete reset when modal closes
  const handleModalClose = () => {
    setSelectedStep(null);
    setIsSaving(false);
    setHasChanges(false);
    setOriginalValues(null);
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
    onClose();
  };

  // Reset when modal closes
  useEffect(() => {
    if (!isOpen) {
      handleModalClose();
    }
  }, [isOpen]);

  // Initialize when new search data is provided
  useEffect(() => {
    console.log('Search data changed:', searchData);
    if (searchData && isOpen) {
      console.log('Loading new search data:', searchData);
      const city = inferCityFromPostcodes(searchData.postcodes);
      const newCriteria = {
        city,
        locations: searchData.postcodes,
        propertyTypes: searchData.criteria.propertyTypes,
        minBedrooms: searchData.criteria.minBedrooms,
        maxBedrooms: searchData.criteria.maxBedrooms,
        minPrice: searchData.criteria.minPrice,
        maxPrice: searchData.criteria.maxPrice,
        mustHaves: searchData.criteria.mustHaves || [],
        name: searchData.searchName,
        notifications: searchData.notifications,
      };
      setSearchCriteria(newCriteria);
      setOriginalValues(newCriteria);
      setHasChanges(false);
      setSelectedStep(null);
    }
  }, [searchData?.id, isOpen]);

  const steps = [
    { 
      id: 0,
      title: 'Location',
      description: 'Change postcodes and areas',
      icon: RiMapPinLine,
      component: LocationStep
    },
    { 
      id: 1,
      title: 'Property Type',
      description: 'Switch between house, flat, or room',
      icon: RiHome4Line,
      component: PropertyTypeStep
    },
    { 
      id: 2,
      title: 'Price & Bedrooms',
      description: 'Adjust your budget and size requirements',
      icon: RiPriceTag3Line,
      component: PriceBedroomsStep
    },
    { 
      id: 3,
      title: 'Must-Haves',
      description: 'Update essential property features',
      icon: RiCheckboxLine,
      component: MustHavesStep
    },
    { 
      id: 4,
      title: 'Name & Notifications',
      description: 'Change search name and alert preferences',
      icon: RiBellLine,
      component: FinalizeStep
    },
  ];

  // Track changes in step components
  const handleStepChange = (stepId, values) => {
    let originalStepValues;
    
    // Get original values for comparison
    switch(stepId) {
      case 0:
        originalStepValues = originalValues.locations;
        break;
      case 1:
        originalStepValues = originalValues.propertyTypes;
        break;
      case 2:
        originalStepValues = {
          minBedrooms: originalValues.minBedrooms,
          maxBedrooms: originalValues.maxBedrooms,
          minPrice: originalValues.minPrice,
          maxPrice: originalValues.maxPrice
        };
        break;
      case 3:
        originalStepValues = originalValues.mustHaves;
        break;
      case 4:
        originalStepValues = {
          name: originalValues.name,
          notifications: originalValues.notifications
        };
        break;
    }

    // Compare current values with original values
    const hasActualChanges = JSON.stringify(values) !== JSON.stringify(originalStepValues);
    setHasChanges(hasActualChanges);

    // Update current criteria
    const updatedCriteria = { ...searchCriteria };
    switch(stepId) {
      case 0:
        updatedCriteria.locations = values;
        break;
      case 1:
        updatedCriteria.propertyTypes = values;
        break;
      case 2:
        updatedCriteria.minBedrooms = values.minBedrooms;
        updatedCriteria.maxBedrooms = values.maxBedrooms;
        updatedCriteria.minPrice = values.minPrice;
        updatedCriteria.maxPrice = values.maxPrice;
        break;
      case 3:
        updatedCriteria.mustHaves = values;
        break;
      case 4:
        updatedCriteria.name = values.name;
        updatedCriteria.notifications = values.notifications;
        break;
    }
    setSearchCriteria(updatedCriteria);
  };

  // When a step is selected, store the original values
  const handleStepSelect = (stepId) => {
    setOriginalValues({ ...searchCriteria });
    setSelectedStep(stepId);
  };

  const handleBack = () => {
    if (hasChanges) {
      if (window.confirm('You have unsaved changes. Are you sure you want to go back?')) {
        setSelectedStep(null);
        setHasChanges(false);
      }
    } else {
      setSelectedStep(null);
    }
  };

  const handleSectionSave = async (stepId, values) => {
    setIsSaving(true);
    try {
      const whopUserId = localStorage.getItem('whop_user_id');
      
      if (!whopUserId) {
        throw new Error('No user ID available');
      }

      // Log what we're sending to the API
      console.log('Saving step:', stepId, 'with values:', values);

      // Format the data correctly for the API
      const updateData = {
        user_id: whopUserId,
        searchId: searchData.id,
        search_name: values.name,
        postcodes: values.locations,
        min_price: values.minPrice,
        max_price: values.maxPrice,
        min_bedrooms: values.minBedrooms,
        max_bedrooms: values.maxBedrooms,
        property_types: values.propertyTypes,
        must_haves: values.mustHaves,
        notifications: values.notifications,
      };

      // Only include relevant fields based on which step we're saving
      const relevantData = {
        user_id: whopUserId,
        searchId: searchData.id,
        ...(stepId === 0 && { postcodes: values }),
        ...(stepId === 1 && { property_types: values }),
        ...(stepId === 2 && {
          min_price: values.minPrice,
          max_price: values.maxPrice,
          min_bedrooms: values.minBedrooms,
          max_bedrooms: values.maxBedrooms,
        }),
        ...(stepId === 3 && { must_haves: values }),
        ...(stepId === 4 && {
          search_name: values.name,
          notifications: values.notifications,
        }),
      };

      console.log('Sending to API:', relevantData);

      const response = await fetch('/api/update-search', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(relevantData),
      });

      if (!response.ok) {
        throw new Error('Failed to update search');
      }

      // Return to menu and refresh list
      setSelectedStep(null);
      window.dispatchEvent(new CustomEvent('refreshSearches'));

    } catch (error) {
      console.error('Error updating search:', error);
      alert('Failed to update search');
    } finally {
      setIsSaving(false);
    }
  };

  const styles = {
    doneButton: {
      background: 'none',
      border: 'none',
      padding: '8px 16px',
      color: '#007AFF',
      fontSize: '17px',
      fontWeight: '500',
      cursor: 'pointer',
    }
  };

  // Move stepValues calculation outside of renderStep
  const getStepValues = (step) => {
    if (step === null) return null;
    
    return step === 0 ? searchCriteria.locations :
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
      };
  };

  // Move inferCityFromPostcodes to top level and add logging
  const inferCityFromPostcodes = (postcodes) => {
    if (!postcodes) {
      console.log('No postcodes provided to inferCityFromPostcodes');
      return null;
    }
    console.log('Inferring city from postcodes:', postcodes);

    // If any postcode starts with M, it's Manchester
    if (postcodes.some(p => p.startsWith('M'))) {
      console.log('Detected Manchester from postcodes');
      return 'manchester';
    }
    // If any postcode starts with SW or NW, it's London
    if (postcodes.some(p => p.startsWith('SW') || p.startsWith('NW'))) {
      console.log('Detected London from postcodes');
      return 'london';
    }
    console.log('No city detected from postcodes');
    return null;
  };

  const renderStep = () => {
    if (selectedStep === null) {
      return (
        <EditMenuStep 
          steps={steps}
          onSelectStep={handleStepSelect}
        />
      );
    }

    const step = steps[selectedStep];
    const stepValues = getStepValues(selectedStep);
    
    // Add logging for LocationStep
    if (selectedStep === 0) {
      const inferredCity = inferCityFromPostcodes(searchCriteria.locations);
      console.log('Rendering LocationStep with:', {
        stepId: selectedStep,
        locations: searchCriteria.locations,
        inferredCity,
        searchCriteria
      });
    }

    return (
      <EditStepComponent
        StepComponent={step.component}
        values={stepValues}
        value={selectedStep === 0 ? inferCityFromPostcodes(searchCriteria.locations) : null}
        onChange={(values) => {
          handleStepChange(selectedStep, values);
        }}
      />
    );
  };

  // Replace existing handleClose with new one
  const handleClose = () => {
    if (hasChanges) {
      if (window.confirm('You have unsaved changes. Are you sure you want to close?')) {
        handleModalClose();
      }
    } else {
      handleModalClose();
    }
  };

  // Get current step values for the save button
  const currentStepValues = getStepValues(selectedStep);

  return BaseSearchModal.renderModalFrame({
    isOpen,
    onClose: handleClose,
    title: 'Edit Search',
    showCloseButton: false,
    showBackButton: false,
    buttonState: selectedStep !== null ? {
      onClick: hasChanges ? () => handleSectionSave(selectedStep, currentStepValues) : handleBack,
      text: hasChanges ? 'Save' : 'Back',
      disabled: isSaving,
      opacity: hasChanges ? 1 : 0.8
    } : null,
    customHeaderRight: selectedStep === null ? (
      <button 
        style={styles.doneButton} 
        onClick={handleClose}
      >
        Done
      </button>
    ) : null,
    children: renderStep()
  });
};

export default EditSearchModal;