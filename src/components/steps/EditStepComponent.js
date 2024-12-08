import React from 'react';

const EditStepComponent = ({ StepComponent, values, onChange, onBack, isSaving, hasChanges }) => {
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    },
    
    content: {
      flex: 1,
      overflowY: 'auto',
      padding: '20px',
    },

    footer: {
      padding: '16px 20px',
      borderTop: '1px solid #eee',
    },

    button: {
      width: '100%',
      padding: '16px',
      fontSize: '17px',
      fontWeight: '600',
      border: 'none',
      borderRadius: '12px',
      backgroundColor: '#2E3F32',
      color: 'white',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      opacity: hasChanges ? 1 : 0.8,
    }
  };

  const handleButtonClick = () => {
    if (hasChanges) {
      onChange(values);
    } else {
      onBack();
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <StepComponent
          values={values}
          onChange={onChange}
        />
      </div>
      
      <div style={styles.footer}>
        <button 
          style={styles.button}
          onClick={handleButtonClick}
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : (hasChanges ? 'Save Changes' : 'Back')}
        </button>
      </div>
    </div>
  );
};

export default EditStepComponent; 