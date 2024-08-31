// src/components/CriteriaForm.js
import React, { useState } from 'react';

const CriteriaForm = ({ onAddCriteria }) => {
  const [bedrooms, setBedrooms] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newCriteria = { bedrooms, price, location, enabled: true };
    onAddCriteria(newCriteria);
    setBedrooms('');
    setPrice('');
    setLocation('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Bedrooms:
        <input
          type="number"
          value={bedrooms}
          onChange={(e) => setBedrooms(e.target.value)}
          required
        />
      </label>
      <br />
      <label>
        Price:
        <input
          type="text"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
      </label>
      <br />
      <label>
        Location:
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />
      </label>
      <br />
      <button type="submit">Add Criteria</button>
    </form>
  );
};

export default CriteriaForm;