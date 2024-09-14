import React, { useState, useEffect } from 'react';
import './Alerts.css';

const Alerts = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [to, setTo] = useState(''); // Recipient phone number
  const [message, setMessage] = useState(''); // Message content
  const [sendingStatus, setSendingStatus] = useState('');
  const [envStatus, setEnvStatus] = useState(null); // State for environment variables status

  const handleOpenModal = () => {
    setIsModalOpen(true);
    adjustModalHeight();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEnvStatus(null); // Reset env status when modal closes
  };

  const adjustModalHeight = () => {
    const modal = document.querySelector('.simple-modal-content');
    if (modal) {
      const visibleHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
      const topSafeArea = parseInt(getComputedStyle(document.documentElement).getPropertyValue('env(safe-area-inset-top)')) || 0;
      const bottomSafeArea = parseInt(getComputedStyle(document.documentElement).getPropertyValue('env(safe-area-inset-bottom)')) || 0;
      modal.style.height = `calc(${visibleHeight}px - ${topSafeArea}px - ${bottomSafeArea}px)`;
      modal.style.maxHeight = `calc(100vh - ${topSafeArea}px - ${bottomSafeArea}px)`;
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      const handleResize = () => adjustModalHeight();
      window.addEventListener('resize', handleResize);
      if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', handleResize);
      }
      return () => {
        window.removeEventListener('resize', handleResize);
        if (window.visualViewport) {
          window.visualViewport.removeEventListener('resize', handleResize);
        }
      };
    }
  }, [isModalOpen]);

  const handleSendMessage = async () => {
    setSendingStatus('Sending...');
    try {
      const response = await fetch('/api/send-whatsapp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'send-message',
          to,
          message,
        }),
      });

      if (response.ok) {
        setSendingStatus('Message sent successfully!');
      } else {
        const errorData = await response.json();
        setSendingStatus(`Failed to send message: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      setSendingStatus('Error sending message.');
    }
  };

  const checkEnvVariables = async () => {
    try {
      const response = await fetch('/api/send-whatsapp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'check-env' }),
      });

      if (response.ok) {
        const result = await response.json();
        setEnvStatus(result.envStatus);
      } else {
        setEnvStatus({ error: 'Failed to check environment variables.' });
      }
    } catch (error) {
      console.error('Error checking environment variables:', error);
      setEnvStatus({ error: 'Error checking environment variables.' });
    }
  };

  return (
    <div>
      <h1>Alerts</h1>
      <button onClick={handleOpenModal}>Test WhatsApp Message</button>

      {isModalOpen && (
        <div className="simple-modal">
          <div className="simple-modal-content">
            <span className="simple-modal-close" onClick={handleCloseModal}>&times;</span>
            <h2>WhatsApp Message Test</h2>
            <input
              type="text"
              placeholder="Recipient Number (e.g., +447530793577)"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              style={{ marginBottom: '10px', width: '100%' }}
            />
            <textarea
              placeholder="Enter your message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{ marginBottom: '10px', width: '100%', height: '100px' }}
            />
            <button onClick={handleSendMessage}>Send Message</button>
            <p>{sendingStatus}</p>
            <hr />
            <button onClick={checkEnvVariables}>Check Twilio Env Variables Found</button>
            {envStatus && (
              <div>
                <h4>Environment Variables Status:</h4>
                <p>Account SID: {envStatus.accountSid}</p>
                <p>Auth Token: {envStatus.authToken}</p>
                <p>WhatsApp Number: {envStatus.whatsappNumber}</p>
                {envStatus.error && <p>{envStatus.error}</p>}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Alerts;