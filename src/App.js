// src/App.js
import React, { useState } from 'react';
import CriteriaForm from './components/CriteriaForm';
import CriteriaList from './components/CriteriaList';

function App() {
  const [criteria, setCriteria] = useState([]);

  const addCriteria = (newCriteria) => {
    setCriteria([...criteria, newCriteria]);
  };

  const toggleEnable = (index) => {
    const updatedCriteria = criteria.map((crit, i) =>
      i === index ? { ...crit, enabled: !crit.enabled } : crit
    );
    setCriteria(updatedCriteria);
  };

  const deleteCriteria = (index) => {
    const updatedCriteria = criteria.filter((_, i) => i !== index);
    setCriteria(updatedCriteria);
  };

  return (
    <div className="App">
      <h1>Property Alerts Setup</h1>
      <CriteriaForm onAddCriteria={addCriteria} />
      <CriteriaList 
        criteria={criteria}
        onToggleEnable={toggleEnable}
        onDelete={deleteCriteria}
      />
    </div>
  );
}

export default App;
