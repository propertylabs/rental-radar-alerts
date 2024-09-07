import React, { useState, useEffect } from 'react';
import './Alerts.css';

const Alerts = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
    adjustModalHeight(); // Adjust height when opening modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const adjustModalHeight = () => {
    const modal = document.querySelector('.simple-modal-content');
    if (modal) {
      // Get the visible height, considering URL bar in Safari
      const visibleHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;

      // Use safe area insets if available
      const topSafeArea = parseInt(getComputedStyle(document.documentElement).getPropertyValue('env(safe-area-inset-top)')) || 0;
      const bottomSafeArea = parseInt(getComputedStyle(document.documentElement).getPropertyValue('env(safe-area-inset-bottom)')) || 0;

      // Set the modal height dynamically based on the visible area and safe insets
      modal.style.height = `calc(${visibleHeight}px - ${topSafeArea}px - ${bottomSafeArea}px)`;
      modal.style.maxHeight = `calc(100vh - ${topSafeArea}px - ${bottomSafeArea}px)`; // Set max-height for good measure
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      // Adjust height on window resize or when the URL bar appears/disappears
      const handleResize = () => adjustModalHeight();

      window.addEventListener('resize', handleResize);
      if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', handleResize); // Listen for URL bar changes
      }

      return () => {
        window.removeEventListener('resize', handleResize);
        if (window.visualViewport) {
          window.visualViewport.removeEventListener('resize', handleResize);
        }
      };
    }
  }, [isModalOpen]);

  return (
    <div>
      <h1>Alerts</h1>
      <button onClick={handleOpenModal}>Pop Up</button>

      {isModalOpen && (
        <div className="simple-modal">
          <div className="simple-modal-content">
            <span className="simple-modal-close" onClick={handleCloseModal}>&times;</span>
            <h2>Empty Modal</h2>
            <p>This is a simple test modal.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Alerts;