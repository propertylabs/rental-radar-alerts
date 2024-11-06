import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Settings.css'; // Ensure this includes only minimal custom styles

const Settings = () => {
  const [userData, setUserData] = useState(null);
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const whopUserId = localStorage.getItem('whop_user_id');

        if (!token || !whopUserId) {
          console.error("User is not authenticated or Whop user ID is missing.");
          navigate('/login');
          return;
        }

        console.log("Token and Whop User ID found:", { token, whopUserId });

        const response = await fetch('/api/get-user-data', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Response status:", response.status);

        if (!response.ok) {
          console.error(`Error: ${response.status} - ${response.statusText}`);
          navigate('/login');
          return;
        }

        const data = await response.json();
        console.log('User data fetched successfully:', data);
        setUserData(data);
        setWhatsappNumber(data.whatsapp_number || '');
      } catch (error) {
        console.error("Error fetching user data:", error);
        navigate('/login');
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleWhatsappChange = (event) => {
    setWhatsappNumber(event.target.value);
  };

  const handleUpdateSettings = async () => {
    try {
      const response = await fetch('/api/update-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ whatsapp_number: whatsappNumber }),
      });

      console.log("Update response status:", response.status);

      if (response.ok) {
        console.log('Settings updated successfully.');
      } else {
        console.error('Failed to update settings.');
      }
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };

  const handleLogout = () => {
    console.log("User logged out.");
    localStorage.removeItem('token');
    localStorage.removeItem('whop_user_id');
    navigate('/login');
  };

  return (
    <div className="settings-container p-card">
      <h2 className="settings-title p-card-title">Settings</h2>
      <div className="p-card-content">
        <div className="p-card-text">
          <p><strong>Name:</strong> {userData ? userData.name : <span className="p-placeholder">Loading...</span>}</p>
        </div>
        <div className="p-card-text">
          <p><strong>Email:</strong> {userData ? userData.email : <span className="p-placeholder">Loading...</span>}</p>
        </div>
        <div className="p-input-container">
          <label className="p-form-label" htmlFor="whatsappNumber">WhatsApp Phone Number:</label>
          <input
            type="text"
            id="whatsappNumber"
            className="p-form-text"
            value={whatsappNumber}
            onChange={handleWhatsappChange}
            placeholder="+1234567890"
          />
        </div>
        <button className="p-btn p-prim-col p-btn-md" onClick={handleUpdateSettings}>Save Changes</button>
        <button className="p-btn p-btn-md p-btn-destructive logout-button" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default Settings;