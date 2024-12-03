import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  RiSearchLine, RiSearchFill,
  RiNotification3Line, RiNotification3Fill,
  RiSettings4Line, RiSettings4Fill
} from 'react-icons/ri';

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
          {({ isActive }) => (
            <>
              {isActive ? <RiSearchFill style={styles.icon} /> : <RiSearchLine style={styles.icon} />}
              <span style={styles.label}>Searches</span>
            </>
          )}
        </NavLink>
        <NavLink 
          to="/alerts" 
          style={({ isActive }) => ({
            ...styles.navItem,
            color: isActive ? '#000' : '#666'
          })}
        >
          {({ isActive }) => (
            <>
              {isActive ? <RiNotification3Fill style={styles.icon} /> : <RiNotification3Line style={styles.icon} />}
              <span style={styles.label}>Alerts</span>
            </>
          )}
        </NavLink>
        <NavLink 
          to="/settings" 
          style={({ isActive }) => ({
            ...styles.navItem,
            color: isActive ? '#000' : '#666'
          })}
        >
          {({ isActive }) => (
            <>
              {isActive ? <RiSettings4Fill style={styles.icon} /> : <RiSettings4Line style={styles.icon} />}
              <span style={styles.label}>Settings</span>
            </>
          )}
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
    padding: '8px 0',
    maxWidth: '500px',
    margin: '0 auto',
    '@media (min-width: 768px)': {
      padding: '12px 0',
    },
  },

  navItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textDecoration: 'none',
    fontSize: '0.82rem',
    fontWeight: '500',
    gap: '2px',
    padding: '6px 16px',
    transition: 'color 0.2s ease',
    WebkitTapHighlightColor: 'transparent',
    '@media (min-width: 768px)': {
      gap: '4px',
      padding: '8px 16px',
    },
  },

  icon: {
    fontSize: '1.3rem',
    transition: 'transform 0.2s ease',
    '@media (min-width: 768px)': {
      fontSize: '1.5rem',
    },
  },

  label: {
    fontSize: '0.7rem',
    fontWeight: '500',
    '@media (min-width: 768px)': {
      fontSize: '0.75rem',
    },
  },
};

export default Navigation;