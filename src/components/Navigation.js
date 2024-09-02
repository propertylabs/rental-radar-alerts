import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaSearch, FaBell, FaCog } from 'react-icons/fa'; // Import icons

const Navigation = () => {
  return (
    <nav style={styles.navbar}>
      <div style={styles.navContainer}>
        <NavLink to="/dashboard" style={styles.navItem} activeStyle={styles.activeNavItem}>
          <FaHome style={styles.icon} /> Home
        </NavLink>
        <NavLink to="/dashboard/searches" style={styles.navItem} activeStyle={styles.activeNavItem}>
          <FaSearch style={styles.icon} /> Searches
        </NavLink>
        <NavLink to="/dashboard/alerts" style={styles.navItem} activeStyle={styles.activeNavItem}>
          <FaBell style={styles.icon} /> Alerts
        </NavLink>
        <NavLink to="/dashboard/settings" style={styles.navItem} activeStyle={styles.activeNavItem}>
          <FaCog style={styles.icon} /> Settings
        </NavLink>
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    position: 'fixed',
    bottom: 0,
    width: '100%',
    backgroundColor: '#fff',
    // boxShadow: '0 -1px 5px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    justifyContent: 'center',
    padding: '10px 0',
    zIndex: 1000,
  },
  navContainer: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    maxWidth: '500px', // Limit the maximum width to center the navigation bar
  },
  navItem: {
    textDecoration: 'none',
    color: '#000',
    fontSize: '14px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1, // Distribute space equally among items
  },
  activeNavItem: {
    color: '#007bff',
  },
  icon: {
    marginBottom: '4px',
  },
};

export default Navigation;