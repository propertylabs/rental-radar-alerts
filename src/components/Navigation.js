import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  RiSearchLine, RiSearchFill,
  RiNotification3Line, RiNotification3Fill,
  RiSettings4Line, RiSettings4Fill
} from 'react-icons/ri';

const Navigation = ({ isModalOpen }) => {
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const standalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    setIsStandalone(standalone);
  }, []);

  return (
    <nav style={{
      ...styles.navbar,
      paddingBottom: isStandalone ? 'calc(env(safe-area-inset-bottom) - 17px)' : '0',
      zIndex: isModalOpen ? -1 : 1000
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
            isActive ? <RiSearchFill style={styles.icon} /> : <RiSearchLine style={styles.icon} />
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
            isActive ? <RiNotification3Fill style={styles.icon} /> : <RiNotification3Line style={styles.icon} />
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
            isActive ? <RiSettings4Fill style={styles.icon} /> : <RiSettings4Line style={styles.icon} />
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
      padding: '16px 0',
    },
  },

  navItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textDecoration: 'none',
    padding: '8px',
    transition: 'color 0.2s ease',
    WebkitTapHighlightColor: 'transparent',
    borderRadius: '50%',
  },

  icon: {
    fontSize: '1.7rem',
    transition: 'transform 0.2s ease',
  },
};

export default Navigation;