import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Settings.css';

const Settings = () => {
  const [userData, setUserData] = useState(null);
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

        const response = await fetch('/api/get-user-data', {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        });
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
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
      <button className="logout-button" onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Settings;