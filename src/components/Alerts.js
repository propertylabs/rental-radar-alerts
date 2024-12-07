import React, { useState } from 'react';

const ACCENT = '#2E3F32';

const Alerts = () => {
  const [isStandalone] = useState(() => 
    window.matchMedia('(display-mode: standalone)').matches || 
    window.navigator.standalone || 
    true
  );

  return (
    <div style={styles.pageContainer}>
      <div style={{
        ...styles.contentWrapper,
        paddingTop: isStandalone ? 'calc(env(safe-area-inset-top) + 16px)' : '16px',
      }}>
        <h1 style={styles.title}>Alerts</h1>
        
        <div style={styles.scrollContainer}>
          {/* Regular alerts content will go here */}
        </div>
      </div>
    </div>
  );
};

const styles = {
  pageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
    background: 'linear-gradient(to bottom, #f8f9fa, #f0f2f1)',
    WebkitOverflowScrolling: 'touch',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    '-webkit-font-smoothing': 'antialiased',
    '-moz-osx-font-smoothing': 'grayscale',
  },

  contentWrapper: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },

  title: {
    fontSize: '32px',
    fontWeight: '700',
    color: ACCENT,
    margin: '0 20px 16px',
    letterSpacing: '-0.5px',
    fontFamily: 'inherit',
  },

  scrollContainer: {
    flex: 1,
    overflow: 'auto',
    paddingBottom: 'calc(env(safe-area-inset-bottom) + 16px)',
    padding: '0 20px',
  },

  devMenu: {
    background: 'white',
    borderRadius: '12px',
    padding: '20px',
    marginTop: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },

  devTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: ACCENT,
    marginTop: 0,
    marginBottom: '16px',
  },

  devButton: {
    width: '100%',
    padding: '12px 16px',
    background: ACCENT,
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    ':hover': {
      backgroundColor: '#243528',
    },
  },
};

export default Alerts;
