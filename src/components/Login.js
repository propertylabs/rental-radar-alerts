import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [envVariables, setEnvVariables] = useState(null);
  const navigate = useNavigate();

  const clientId = process.env.REACT_APP_WHOP_CLIENT_ID;
  const redirectUri = process.env.REACT_APP_WHOP_REDIRECT_URI;

  const handleWhopLogin = () => {
    const authUrl = `https://whop.com/oauth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}`;

    // Open in a small, centered pop-up window
    const width = 600;
    const height = 700;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;

    window.open(authUrl, "_blank", `width=${width},height=${height},top=${top},left=${left},noopener`);
  };

  const handlePrintEnvVariables = () => {
    setEnvVariables({
      clientId,
      redirectUri,
    });
  };

  const handleGoToSafeArea = () => {
    navigate('/safearea');
  };

  return (
    <div style={styles.container}>
      <h2>Login with Whop</h2>
      <button onClick={handleWhopLogin} style={styles.button}>Login with Whop</button>

      <button onClick={handlePrintEnvVariables} style={styles.button}>
        Print Whop Env Variables
      </button>

      {envVariables && (
        <div style={styles.envContainer}>
          <p><strong>Client ID:</strong> {envVariables.clientId}</p>
          <p><strong>Redirect URI:</strong> {envVariables.redirectUri}</p>
        </div>
      )}

      <button onClick={handleGoToSafeArea} style={styles.button}>
        Go to Safe Area
      </button>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    textAlign: 'center',
  },
  button: {
    padding: '10px 20px',
    margin: '10px 0',
    fontSize: '16px',
    cursor: 'pointer',
  },
  envContainer: {
    marginTop: '20px',
    textAlign: 'left',
  },
};

export default Login;