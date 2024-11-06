import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Settings.css';

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
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
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
        setWhatsappNumber(data.whatsapp_number || ''); // Set initial value for WhatsApp number
      } catch (error) {
        console.error("Error fetching user data:", error);
        navigate('/login'); // Navigate on error
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
        body: JSON.stringify({ whatsapp_number: whatsappNumber }), // Include whatsapp number
      });

      console.log("Update response status:", response.status);

      if (response.ok) {
        console.log('Settings updated successfully.');
        // Handle success (e.g., show a success message)
      } else {
        console.error('Failed to update settings.');
        // Handle error
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
    <div className="settings-container">
      <h2 className="settings-title">Settings</h2>
      <div className="user-info">
        <p><strong>Name:</strong> {userData ? userData.name : <span className="placeholder">Loading...</span>}</p>
        <p><strong>Email:</strong> {userData ? userData.email : <span className="placeholder">Loading...</span>}</p>
      </div>
      <label>
        WhatsApp Phone Number:
        <input
          type="text"
          value={whatsappNumber}
          onChange={handleWhatsappChange}
          placeholder="+1234567890"
        />
      </label>
      <button onClick={handleUpdateSettings}>Save Changes</button>
      <button className="logout-button" onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Settings;