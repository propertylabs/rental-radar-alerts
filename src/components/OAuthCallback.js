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
          localStorage.setItem('token', data.access_token);
          localStorage.setItem('whop_user_id', data.whop_user_id);

          if (window.opener) {
            console.log('Popup detected, sending message to parent...');
            window.opener.postMessage({ 
              type: 'WHOP_LOGIN_SUCCESS',
              token: data.access_token,
              whop_user_id: data.whop_user_id
            }, window.location.origin);
            
            console.log('Message sent, closing window...');
            window.close();
          } else {
            console.log('No opener found, navigating normally');
            navigate('/searches');
          }
        } else {
          console.error("User is not a paying subscriber.");
          navigate('/notsub');
        }
      } catch (error) {
        console.error('Error during API request:', error.message);
        navigate('/notsub');
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