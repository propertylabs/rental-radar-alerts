// GoogleMapLoader.js
import React, { useEffect } from 'react';

const GoogleMapLoader = () => {
  useEffect(() => {
    const loadGoogleMaps = async () => {
      try {
        const response = await fetch('/api/get-google-maps-api-key');
        const data = await response.json();

        if (!data.apiKey) {
          console.error('Google Maps API key not found');
          return;
        }

        const existingScript = document.getElementById('googleMaps');

        if (!existingScript) {
          const script = document.createElement('script');
          script.src = `https://maps.googleapis.com/maps/api/js?key=${data.apiKey}&libraries=places,drawing`;
          script.id = 'googleMaps';
          script.async = true;
          script.defer = true;
          document.body.appendChild(script);

          script.onload = () => {
            console.log('Google Maps script loaded');
          };
        } else {
          console.log('Google Maps script already exists');
        }
      } catch (error) {
        console.error('Error loading Google Maps script:', error);
      }
    };

    loadGoogleMaps();
  }, []);

  return null;
};

export default GoogleMapLoader;