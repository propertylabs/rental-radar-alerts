import React, { useState, useEffect } from 'react';
import BaseSearchModal from './BaseSearchModal.js';
import LocationStep from './steps/LocationStep.js';
import PropertyTypeStep from './steps/PropertyTypeStep.js';
import PriceBedroomsStep from './steps/PriceBedroomsStep.js';
import MustHavesStep from './steps/MustHavesStep.js';
import FinalizeStep from './steps/FinalizeStep.js';
import { RiMapPinLine, RiHome4Line, RiPriceTag3Line, RiCheckboxLine, RiBellLine, RiArrowRightSLine } from 'react-icons/ri';

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
      padding: '8px',
    },

    menuItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      padding: '16px',
      background: 'rgba(46, 63, 50, 0.02)',
      borderRadius: '16px',
      border: '1px solid rgba(46, 63, 50, 0.08)',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
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
    if (searchData) {
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

  const resetModal = () => {
    setSelectedStep(null);
    setIsSaving(false);
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

  const handleSectionSave = async (stepId, values) => {
    setIsSaving(true);
    try {
      const whopUserId = localStorage.getItem('whop_user_id');
      
      if (!whopUserId) {
        throw new Error('No user ID available');
      }

      // Update local state first
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

      // Save to API
      const response = await fetch('/api/update-search', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: whopUserId,
          searchId: searchData.id,
          search_name: updatedCriteria.name,
          postcodes: updatedCriteria.locations,
          min_price: updatedCriteria.minPrice,
          max_price: updatedCriteria.maxPrice,
          min_bedrooms: updatedCriteria.minBedrooms,
          max_bedrooms: updatedCriteria.maxBedrooms,
          property_types: updatedCriteria.propertyTypes,
          must_haves: updatedCriteria.mustHaves,
          notifications: updatedCriteria.notifications,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update search');
      }

      // Return to menu and refresh list
      setSelectedStep(null);
      window.dispatchEvent(new CustomEvent('refreshSearches'));

    } catch (error) {
      alert('Failed to update search');
      console.error('Error updating search:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const renderStep = () => {
    if (selectedStep === null) {
      return (
        <EditMenuStep 
          steps={steps}
          onSelectStep={setSelectedStep}
        />
      );
    }

    const step = steps[selectedStep];
    const StepComponent = step.component;

    return (
      <StepComponent 
        values={
          selectedStep === 0 ? searchCriteria.locations :
          selectedStep === 1 ? searchCriteria.propertyTypes :
          selectedStep === 2 ? {
            minBedrooms: searchCriteria.minBedrooms,
            maxBedrooms: searchCriteria.maxBedrooms,
            minPrice: searchCriteria.minPrice,
            maxPrice: searchCriteria.maxPrice
          } :
          selectedStep === 3 ? searchCriteria.mustHaves :
          {
            name: searchCriteria.name,
            notifications: searchCriteria.notifications
          }
        }
        onChange={(values) => handleSectionSave(selectedStep, values)}
        isEditing={true}
        isSaving={isSaving}
      />
    );
  };

  return BaseSearchModal.renderModalFrame({
    isOpen,
    onClose: () => {
      resetModal();
      onClose();
    },
    title: selectedStep === null ? 'Edit Search' : steps[selectedStep].title,
    showBack: selectedStep !== null,
    onBack: () => setSelectedStep(null),
    children: renderStep()
  });
};

export default EditSearchModal;