import React, { useEffect, useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';

const PrivateRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuthenticationAndSubscription = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      try {
        // Use fetch to call the subscription check endpoint
        const response = await fetch('/api/check-subscription', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to verify subscription status');
        }

        const data = await response.json();

        // If the user is not subscribed, treat it as not authenticated
        setIsAuthenticated(data.isSubscriber);
      } catch (error) {
        console.error("Error checking subscription status:", error);
        setIsAuthenticated(false);
      }
    };

    checkAuthenticationAndSubscription();
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>; // Show a loading state while checking
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />; // Redirect all non-authenticated or non-subscribers to login
  }

  return <Outlet />;
};

export default PrivateRoute;