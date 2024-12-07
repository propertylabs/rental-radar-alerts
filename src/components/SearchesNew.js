import React, { useState } from 'react';

const ACCENT = '#2E3F32'; // Deep forest green

const SearchesNew = () => {
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
        <h1 style={styles.title}>Saved Searches (New)</h1>
        <div style={styles.scrollContainer}>
          <div style={styles.devInfo}>
            <h2 style={styles.devInfoTitle}>Development Version</h2>
            <p style={styles.devInfoText}>This is the new version of the Searches page, currently under development.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  pageContainer: {
    flex: 1,
    overflow: 'auto',
    background: 'linear-gradient(to bottom, #f8f9fa, #f0f2f1)',
    WebkitOverflowScrolling: 'touch',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    '-webkit-font-smoothing': 'antialiased',
    '-moz-osx-font-smoothing': 'grayscale',
    position: 'relative',
    height: '100%',
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

  devInfo: {
    background: 'white',
    borderRadius: '12px',
    padding: '20px',
    marginTop: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },

  devInfoTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: ACCENT,
    marginTop: 0,
    marginBottom: '12px',
  },

  devInfoText: {
    fontSize: '15px',
    color: '#666',
    lineHeight: '1.4',
    margin: 0,
  },
};

export default SearchesNew; 