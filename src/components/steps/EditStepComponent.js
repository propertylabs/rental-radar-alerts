import React, { useState } from 'react';

const EditStepComponent = ({ StepComponent, values, onChange, onBack, isSaving }) => {
  const [hasChanges, setHasChanges] = useState(false);
  const [localValues, setLocalValues] = useState(values);

  const handleChange = (newValues) => {
    setLocalValues(newValues);
    setHasChanges(true);
  };

  return (
    <StepComponent
      values={localValues}
      onChange={handleChange}
      onSave={() => {
        onChange(localValues);
        setHasChanges(false);
      }}
      onBack={onBack}
      hasChanges={hasChanges}
      isSaving={isSaving}
      isEditing={true}
    />
  );
};

export default EditStepComponent; 