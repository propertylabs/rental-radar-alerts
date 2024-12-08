import React from 'react';

const EditStepComponent = ({ StepComponent, values, onChange }) => {
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      padding: '20px',
    },
  };

  return (
    <div style={styles.container}>
      <StepComponent
        values={values}
        onChange={onChange}
      />
    </div>
  );
};

export default EditStepComponent; 