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
        <h1 style={styles.title}>Saved Searches</h1>
        <div style={styles.scrollContainer}>
          <p>New Searches page coming soon...</p>
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
};

export default SearchesNew; 