import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaStar, FaCog } from 'react-icons/fa';

const Navigation = () => {
  return (
    <nav className="navigation-bar">
      <Link to="/dashboard">
        <FaHome /> Home
      </Link>
      <Link to="/dashboard/saved-searches">
        <FaStar /> Saved Searches
      </Link>
      <Link to="/dashboard/settings">
        <FaCog /> Settings
      </Link>
    </nav>
  );
};

export default Navigation;