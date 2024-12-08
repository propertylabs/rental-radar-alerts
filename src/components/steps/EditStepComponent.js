import React, { useState } from 'react';

const EditStepComponent = ({ StepComponent, values, onChange, onBack, isSaving, hasChanges }) => {
  const styles = {
    saveButton: {
      opacity: hasChanges ? 1 : 0.5,
      pointerEvents: hasChanges ? 'auto' : 'none',
    },
    backButton: {
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button 
          style={styles.backButton}
          onClick={onBack}
        >
          Back
        </button>
        <button 
          style={styles.saveButton}
          onClick={() => onChange(values)}
          disabled={!hasChanges || isSaving}
        >
          {isSaving ? 'Saving...' : 'Save'}
        </button>
      </div>
      
      <StepComponent
        values={values}
        onChange={onChange}
      />
    </div>
  );
};

export default EditStepComponent; 