import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotSub = () => {
  const navigate = useNavigate();

  const handleSubscribe = () => {
    const redirectUri = encodeURIComponent(window.location.origin + '/oauth/callback');
    const subscribeUrl = `https://whop.com/rental-radar/?redirect_uri=${redirectUri}`;
    window.location.href = subscribeUrl;
  };

  return (
    <div className="notsub-container">
      <h1>You are not subscribed</h1>
      <button className="subscribe-button" onClick={handleSubscribe}>
        Subscribe
      </button>
    </div>
  );
};

export default NotSub;