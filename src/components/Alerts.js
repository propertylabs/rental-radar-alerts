import React from 'react';

const Alerts = () => {
  const handleButtonClick = () => {
    alert('Twilio API not configured');
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <button onClick={handleButtonClick}>Test WhatsApp Message</button>
    </div>
  );
};

export default Alerts;