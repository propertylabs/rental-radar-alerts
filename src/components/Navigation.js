import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaSearch, FaBell, FaCog, FaShareSquare } from 'react-icons/fa';
import './Navigation.css';

const Navigation = () => {
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIOSUser, setIsIOSUser] = useState(false);
  const [showIOSOverlay, setShowIOSOverlay] = useState(false); // Full-screen overlay state

  useEffect(() => {
    // Check if the app is running in standalone mode
    const standalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    setIsStandalone(standalone);

    // Check if the user is on an iOS device
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOSUser(isIOS);

    // Show the iOS overlay if the user is on iOS and not in standalone mode
    if (isIOS && !standalone) {
      setShowIOSOverlay(true);
    }
  }, []);

  const closeIOSOverlay = () => {
    setShowIOSOverlay(false);
  };

  return (
    <>
      {/* Full-screen iOS "Add to Home Screen" Overlay */}
      {showIOSOverlay && (
        <div className="ios-overlay">
          <div className="ios-overlay-content">
            <button className="overlay-close" onClick={closeIOSOverlay}>&times;</button>
            <p>Install this app to your home screen for a better experience.</p>
            <p>
              Tap <FaShareSquare className="share-icon" /> then 'Add to Home Screen'.
            </p>
          </div>
        </div>
      )}

      <nav className={isStandalone ? 'standalone-navbar' : 'navbar'}>
        <div className="nav-container">
          <NavLink to="/searches" className="nav-item" activeClassName="active-nav-item">
            <FaSearch className="icon" />
            <span>Searches</span>
          </NavLink>
          <NavLink to="/alerts" className="nav-item" activeClassName="active-nav-item">
            <FaBell className="icon" />
            <span>Alerts</span>
          </NavLink>
          <NavLink to="/settings" className="nav-item" activeClassName="active-nav-item">
            <FaCog className="icon" />
            <span>Settings</span>
          </NavLink>
        </div>
      </nav>
    </>
  );
};

export default Navigation;