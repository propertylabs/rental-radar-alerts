// src/components/CriteriaList.js
import React from 'react';

const CriteriaList = ({ criteria, onToggleEnable, onDelete }) => {
  return (
    <div>
      <h2>Your Saved Criteria</h2>
      <ul>
        {criteria.map((crit, index) => (
          <li key={index}>
            {crit.bedrooms} bedrooms in {crit.location} for {crit.price} 
            <button onClick={() => onToggleEnable(index)}>
              {crit.enabled ? 'Disable' : 'Enable'}
            </button>
            <button onClick={() => onDelete(index)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CriteriaList;
