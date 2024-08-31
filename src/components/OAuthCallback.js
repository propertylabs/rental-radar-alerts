import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const OAuthCallback = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');

      if (!code) {
        console.error("Authorization code is missing.");
        setErrorMessage("Failed to receive authorization code.");
        return;
      }

      try {
        // Call the serverless function with the authorization code
        const response = await axios.get(`/api/whop-auth?code=${code}`);

        if (response.data.access_token) {
          console.log("Access token received successfully:", response.data.access_token);
          localStorage.setItem('token', response.data.access_token);

          setTimeout(() => {
            navigate('/dashboard');
          }, 1000); // Delay navigation by 1 second
        } else {
          setErrorMessage("Failed to receive access token.");
          console.error("Failed to receive access token:", response.data);
        }
      } catch (error) {
        if (error.response && error.response.status === 403) {
          setErrorMessage(error.response.data.error || "You must be subscribed to Rental Radar to access this app.");
        } else {
          console.error('Error during API request:', error.response?.data || error.message);
          setErrorMessage('An error occurred during the API request.');
        }
      }
    };

    handleOAuthCallback();
  }, [navigate]);

  return (
    <div>
      <h2>Processing OAuth Callback...</h2>
      {errorMessage && (
        <div className="error-popup">
          <p>{errorMessage}</p>
          <button onClick={() => navigate('/login')}>OK</button>
        </div>
      )}
    </div>
  );
};

export default OAuthCallback;