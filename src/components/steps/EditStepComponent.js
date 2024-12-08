import React from 'react';

const EditStepComponent = ({ StepComponent, values, onChange, onBack, isSaving, hasChanges }) => {
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      padding: '20px',
    },
  };

  // Pass these props up to BaseSearchModal's continue button
  const continueButtonProps = {
    onClick: hasChanges ? () => onChange(values) : onBack,
    disabled: isSaving,
    text: isSaving ? 'Saving...' : (hasChanges ? 'Save Changes' : 'Back'),
    opacity: hasChanges ? 1 : 0.8
  };

  return (
    <div style={styles.container}>
      <StepComponent
        values={values}
        onChange={onChange}
        continueButtonProps={continueButtonProps}
      />
    </div>
  );
};

export default EditStepComponent; 