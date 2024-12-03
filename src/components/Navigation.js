import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { RiSearchLine, RiNotification3Line, RiSettings4Line } from 'react-icons/ri';

const Navigation = () => {
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const standalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    setIsStandalone(standalone);
  }, []);

  return (
    <nav style={{
      ...styles.navbar,
      paddingBottom: isStandalone ? 'env(safe-area-inset-bottom)' : '0'
    }}>
      <div style={styles.navContainer}>
        <NavLink 
          to="/searches" 
          style={({ isActive }) => ({
            ...styles.navItem,
            color: isActive ? '#000' : '#666'
          })}
        >
          <RiSearchLine style={styles.icon} />
          <span style={styles.label}>Searches</span>
        </NavLink>
        <NavLink 
          to="/alerts" 
          style={({ isActive }) => ({
            ...styles.navItem,
            color: isActive ? '#000' : '#666'
          })}
        >
          <RiNotification3Line style={styles.icon} />
          <span style={styles.label}>Alerts</span>
        </NavLink>
        <NavLink 
          to="/settings" 
          style={({ isActive }) => ({
            ...styles.navItem,
            color: isActive ? '#000' : '#666'
          })}
        >
          <RiSettings4Line style={styles.icon} />
          <span style={styles.label}>Settings</span>
        </NavLink>
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    zIndex: 1000,
    borderTop: '1px solid rgba(0, 0, 0, 0.06)',
  },

  navContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: '12px 0',
    maxWidth: '500px',
    margin: '0 auto',
  },

  navItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textDecoration: 'none',
    fontSize: '0.82rem',
    fontWeight: '500',
    gap: '4px',
    padding: '8px 16px',
    transition: 'color 0.2s ease',
    WebkitTapHighlightColor: 'transparent',
  },

  icon: {
    fontSize: '1.5rem',
    transition: 'transform 0.2s ease',
  },

  label: {
    fontSize: '0.75rem',
    fontWeight: '500',
  },
};

export default Navigation;