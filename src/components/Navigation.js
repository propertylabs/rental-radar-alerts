import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaSearch, FaBell, FaCog, FaShareSquare, FaInfoCircle } from 'react-icons/fa'; // Import FaInfoCircle icon
import './Navigation.css';

const Navigation = () => {
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIOSUser, setIsIOSUser] = useState(false);
  const [showIOSPopup, setShowIOSPopup] = useState(false); // Separate state for iOS "Add to Home Screen" popup
  const [showInfoPopup, setShowInfoPopup] = useState(false); // State to manage the info button popup

  useEffect(() => {
    // Check if the app is running in standalone mode
    const standalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    setIsStandalone(standalone);

    // Check if the user is on an iOS device
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOSUser(isIOS);

    // Show the iOS popup if the user is on iOS and not in standalone mode
    if (isIOS && !standalone) {
      setShowIOSPopup(true);
    }
  }, []);

  const closeIOSPopup = () => {
    setShowIOSPopup(false);
  };

  const toggleInfoPopup = () => {
    setShowInfoPopup(!showInfoPopup);
  };

  return (
    <>
      {/* Info button in the top left corner */}
      <button className="info-button" onClick={toggleInfoPopup}>
        <FaInfoCircle />
      </button>

      {/* Info Popup */}
      {showInfoPopup && (
        <div className="info-popup">
          <div className="popup-content">
            <button className="popup-close" onClick={toggleInfoPopup}>&times;</button>
            <p>{isStandalone ? 'Standalone mode detected' : 'Standalone mode not detected'}</p>
            {isIOSUser && <p>iOS user detected</p>}
          </div>
        </div>
      )}

      {/* iOS "Add to Home Screen" Popup */}
      {showIOSPopup && (
        <div className="popup">
          <div className="popup-content">
            <button className="popup-close" onClick={closeIOSPopup}>&times;</button>
            <p>Install this app to your home screen for a better experience.</p>
            <p>
              Tap <FaShareSquare className="share-icon" /> then 'Add to Home Screen'.
            </p>
          </div>
        </div>
      )}

      <nav className={isStandalone ? 'standalone-navbar' : 'navbar'}>
        <div className="nav-container">
          <NavLink to="/dashboard" className="nav-item" activeClassName="active-nav-item">
            <FaHome className="icon" />
            <span>Home</span>
          </NavLink>
          <NavLink to="/dashboard/searches" className="nav-item" activeClassName="active-nav-item">
            <FaSearch className="icon" />
            <span>Searches</span>
          </NavLink>
          <NavLink to="/dashboard/alerts" className="nav-item" activeClassName="active-nav-item">
            <FaBell className="icon" />
            <span>Alerts</span>
          </NavLink>
          <NavLink to="/dashboard/settings" className="nav-item" activeClassName="active-nav-item">
            <FaCog className="icon" />
            <span>Settings</span>
          </NavLink>
        </div>
      </nav>
    </>
  );
};

export default Navigation;