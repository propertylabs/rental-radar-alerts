import React from 'react';

const EditStepComponent = ({ StepComponent, values, onChange, onBack, isSaving, hasChanges }) => {
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      padding: '16px',
    },
    
    stepContent: {
      flex: 1,
      overflowY: 'auto',
    },

    bottomButton: {
      width: '100%',
      padding: '16px',
      borderRadius: '12px',
      border: 'none',
      backgroundColor: '#2E3F32',
      color: 'white',
      fontSize: '17px',
      fontWeight: '600',
      marginTop: '16px',
      cursor: 'pointer',
      transition: 'opacity 0.2s ease',
      opacity: hasChanges ? 1 : 0.5,
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.stepContent}>
        <StepComponent
          values={values}
          onChange={onChange}
        />
      </div>

      <button 
        style={styles.bottomButton}
        onClick={hasChanges ? () => onChange(values) : onBack}
        disabled={isSaving}
      >
        {isSaving ? 'Saving...' : (hasChanges ? 'Save Changes' : 'Back')}
      </button>
    </div>
  );
};

export default EditStepComponent; 