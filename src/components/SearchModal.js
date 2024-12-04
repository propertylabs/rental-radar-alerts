import React, { useState } from 'react';
import PostcodesStep from './steps/PostcodesStep.js';
import PropertyTypeStep from './steps/PropertyTypeStep.js';

const SearchModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    postcodes: [],
    price: { min: null, max: null },
    bedrooms: { min: null, max: null },
    propertyTypes: [],
    mustHaves: []
  });

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
      padding: '0 24px',
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
      fontSize: '20px',
      transition: 'background-color 0.2s ease',
      padding: '0 0 2px 0',
      lineHeight: 0,
    },
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return <PostcodesStep 
          values={formData.postcodes}
          onChange={(postcodes) => setFormData({...formData, postcodes})}
          onNext={() => setStep(2)}
        />;
      case 2:
        return <PropertyTypeStep 
          values={formData.propertyTypes}
          onChange={(types) => setFormData({...formData, propertyTypes: types})}
          onNext={() => setStep(3)}
          onBack={() => setStep(1)}
        />;
      default:
        return null;
    }
  };

  return (
    <div style={styles.backdrop} onClick={onClose}>
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
              <button style={styles.closeButton} onClick={onClose}>×</button>
            </div>
          </div>
        </div>
        {renderStep()}
      </div>
    </div>
  );
};

export default SearchModal; 