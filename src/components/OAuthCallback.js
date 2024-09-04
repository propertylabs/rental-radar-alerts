import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const OAuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');

      if (!code) {
        console.error("Authorization code is missing.");
        navigate('/notsub');
        return;
      }

      try {
        const response = await fetch(`/api/whop-auth?code=${code}`);
        const data = await response.json();

        if (data.access_token && data.whop_user_id && data.isSubscriber) {
          // Store the token and Whop user ID if the user is a paying subscriber
          localStorage.setItem('token', data.access_token);
          localStorage.setItem('whop_user_id', data.whop_user_id);

          setTimeout(() => {
            navigate('/dashboard');
          }, 1000); // Delay navigation by 1 second
        } else {
          console.error("User is not a paying subscriber.");
          navigate('/notsub'); // Redirect non-subscribers to the notsub page
        }
      } catch (error) {
        console.error('Error during API request:', error.message);
        navigate('/notsub'); // Redirect to notsub on error
      }
    };

    handleOAuthCallback();
  }, [navigate]);

  return (
    <div>
      <h2>Processing OAuth Callback...</h2>
    </div>
  );
};

export default OAuthCallback;