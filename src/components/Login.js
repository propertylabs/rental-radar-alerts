import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const clientId = process.env.REACT_APP_WHOP_CLIENT_ID;
  const redirectUri = process.env.REACT_APP_WHOP_REDIRECT_URI;
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  useEffect(() => {
    const handleResize = () => {
      setWindowHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleResize);
      }
    };
  }, []);

  const handleWhopLogin = () => {
    const authUrl = `https://whop.com/oauth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}`;
    const width = 600;
    const height = 700;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;
    window.open(authUrl, "_blank", `width=${width},height=${height},top=${top},left=${left},noopener`);
  };

  return (
    <div style={{ ...styles.container, height: windowHeight }}>
      {/* Top Image Section */}
      <div style={styles.imageSection}>
        <img 
          src="/login-bk.jpg" 
          alt="Rental Search" 
          style={styles.backgroundImage}
        />
        <img 
          src="/radar-icon.png" 
          alt="Radar Icon" 
          style={styles.radarIcon}
        />
      </div>

      {/* Bottom Content Section */}
      <div style={styles.contentSection}>
        <p style={styles.description}>
          Find your perfect rental property with real-time alerts and advanced search features.
        </p>

        <button onClick={handleWhopLogin} style={styles.loginButton}>
          Login with Whop
        </button>

        <a href="#" style={styles.learnMore}>Learn more</a>
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    position: 'fixed',
    top: 0,
    left: 0,
  },

  imageSection: {
    height: '60%',
    width: '100%',
    overflow: 'hidden',
    position: 'relative',
  },

  backgroundImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },

  radarIcon: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100px', // Adjust size as needed
    height: '100px', // Adjust size as needed
  },

  contentSection: {
    backgroundColor: '#fff',
    height: '40%',
    borderTopLeftRadius: '20px',
    borderTopRightRadius: '20px',
    marginTop: '-20px',
    padding: '30px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
    zIndex: 1,
    overflow: 'hidden',
  },

  description: {
    fontSize: '1.2rem',
    color: '#333',
    textAlign: 'center',
    marginBottom: '30px',
    maxWidth: '600px',
    lineHeight: 1.4,
  },

  loginButton: {
    backgroundColor: '#000',
    color: '#fff',
    border: 'none',
    borderRadius: '30px',
    padding: '16px 32px',
    fontSize: '1.1rem',
    fontWeight: '500',
    cursor: 'pointer',
    width: '100%',
    maxWidth: '400px',
    marginBottom: '20px',
    transition: 'background-color 0.2s ease',
  },

  learnMore: {
    color: '#666',
    textDecoration: 'none',
    fontSize: '1rem',
    marginTop: 'auto',
    padding: '10px',
  },

  '@media (min-width: 768px)': {
    container: {
      flexDirection: 'row',
    },
    
    imageSection: {
      width: '60%',
      height: '100%',
    },
    
    contentSection: {
      width: '40%',
      height: '100%',
      margin: 0,
      borderRadius: 0,
      justifyContent: 'center',
      padding: '40px',
    },
    
    loginButton: {
      width: '80%',
    },
  },
};

export default Login;