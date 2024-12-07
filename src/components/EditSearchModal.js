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
const EditMenuStep = ({ onSelectStep }) => {
  const menuItems = [
    { 
      id: 0, 
      title: 'Location',
      description: 'Change postcodes and areas',
      icon: RiMapPinLine 
    },
    { 
      id: 1, 
      title: 'Property Type',
      description: 'Switch between house, flat, or room',
      icon: RiHome4Line 
    },
    { 
      id: 2, 
      title: 'Price & Bedrooms',
      description: 'Adjust your budget and size requirements',
      icon: RiPriceTag3Line 
    },
    { 
      id: 3, 
      title: 'Must-Haves',
      description: 'Update essential property features',
      icon: RiCheckboxLine 
    },
    { 
      id: 4, 
      title: 'Name & Notifications',
      description: 'Change search name and alert preferences',
      icon: RiBellLine 
    },
  ];

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
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              style={styles.menuItem}
              onClick={() => onSelectStep(item.id)}
            >
              <Icon style={styles.menuItemIcon} />
              <div style={styles.menuItemContent}>
                <div style={styles.menuItemTitle}>{item.title}</div>
                <div style={styles.menuItemDescription}>{item.description}</div>
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
  console.log('EditSearchModal render:', { isOpen, searchData });

  const [step, setStep] = useState(-1);
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
    EditMenuStep,
    LocationStep,
    PropertyTypeStep,
    PriceBedroomsStep,
    MustHavesStep,
    FinalizeStep
  ];

  // Add reset function
  const resetModal = () => {
    setStep(-1);
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
    const CurrentStep = steps[step + 1];
    
    if (step === -1) {
      return <CurrentStep onSelectStep={(selectedStep) => setStep(selectedStep)} />;
    }

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
        onNext={() => setStep(-1)}
        onSave={step === steps.length - 2 ? handleSaveSearch : undefined}
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