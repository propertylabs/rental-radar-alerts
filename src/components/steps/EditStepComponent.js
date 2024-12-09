import React from 'react';

const EditStepComponent = ({ StepComponent, values, value, onChange }) => {
  console.log('EditStepComponent rendering:', { values, value });

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    },
  };

  return (
    <div style={styles.container}>
      <StepComponent
        values={values}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default EditStepComponent; 