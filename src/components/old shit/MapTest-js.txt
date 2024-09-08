import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './MapTest.css'; // Custom CSS for the map

function MapTest() {
  const [geoData, setGeoData] = useState(null); // Store GeoJSON data
  const [selectedPostcodes, setSelectedPostcodes] = useState({}); // Track selected postcodes by name

  // Fetch GeoJSON data when component mounts
  useEffect(() => {
    fetch('/data/manchester-M.geojson') // Adjust path to your data location
      .then((response) => response.json())
      .then((data) => setGeoData(data))
      .catch((error) => console.error('Error fetching GeoJSON:', error));
  }, []);

  // Define default style for unselected features
  const defaultStyle = {
    color: 'black',
    weight: 1,
    fillOpacity: 0.3,
  };

  // Define the highlighted style for selected features
  const highlightedStyle = {
    color: 'blue',
    weight: 5,
    fillOpacity: 0.7,
  };

  // Function to define the style of each feature dynamically based on its selection state
  const styleFeature = (feature) => {
    const postcodeName = feature.properties.name;
    // Check if this postcode is selected, and apply the highlighted style if so
    if (selectedPostcodes[postcodeName]) {
      return highlightedStyle;
    } else {
      return defaultStyle;
    }
  };

  // Function to handle the click event for each postcode
  const onEachPostcode = (feature, layer) => {
    const postcodeName = feature.properties.name;

    // Click event handler for each postcode layer
    layer.on('click', () => {
      setSelectedPostcodes((prevSelected) => {
        const newSelected = { ...prevSelected }; // Copy current selection state

        if (newSelected[postcodeName]) {
          // If the postcode is already selected, deselect it
          delete newSelected[postcodeName]; // Remove from selected list
        } else {
          // If the postcode is not selected, select it
          newSelected[postcodeName] = true; // Mark as selected
        }

        return newSelected; // Return updated selection state
      });
    });

    // Add a tooltip to display the postcode name
    layer.bindTooltip(postcodeName, { permanent: true, direction: 'center', className: 'zone-label' });
  };

  return (
    <div className="map-page">
      <h1 className="map-title">Manchester Postcode Map</h1>
      <MapContainer
        center={[53.483959, -2.244644]} // Centered on Manchester
        zoom={12} // Initial zoom level
        className="map-container"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Render GeoJSON when data is loaded */}
        {geoData && (
          <GeoJSON
            data={geoData}
            style={styleFeature} // Use dynamic styling based on selection state
            onEachFeature={onEachPostcode} // Attach event handling to each postcode
          />
        )}
      </MapContainer>
    </div>
  );
}

export default MapTest;