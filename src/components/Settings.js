import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  RiUserLine, 
  RiNotificationLine, 
  RiPaletteLine, 
  RiShieldLine,
  RiQuestionLine,
  RiLogoutBoxLine,
  RiDeleteBinLine,
  RiArrowRightSLine,
} from 'react-icons/ri';

const ACCENT = '#2E3F32'; // Deep forest green to match Searches

const Settings = () => {
  const [userData, setUserData] = useState(null);
  const [isStandalone] = useState(() => 
    window.matchMedia('(display-mode: standalone)').matches || 
    window.navigator.standalone || 
    true  // Default to true to ensure we're always below safe area
  );
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const whopUserId = localStorage.getItem('whop_user_id');

        if (!token || !whopUserId) {
          console.error("User is not authenticated or Whop user ID is missing.");
          navigate('/login');
          return;
        }

        const response = await fetch('/api/get-user-data', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('whop_user_id');
    navigate('/login');
  };

  const SettingsGroup = ({ title, children }) => (
    <div style={styles.group}>
      <div style={styles.groupTitle}>{title}</div>
      <div style={styles.groupContent}>
        {children}
      </div>
    </div>
  );

  const SettingsRow = ({ icon, label, value, onClick, isDestructive }) => (
    <div 
      style={{
        ...styles.row,
        color: isDestructive ? '#FF3B30' : 'inherit'
      }}
      onClick={onClick}
    >
      <div style={styles.rowLeft}>
        {icon}
        <span style={styles.rowLabel}>{label}</span>
      </div>
      <div style={styles.rowRight}>
        {value && <span style={styles.rowValue}>{value}</span>}
        <RiArrowRightSLine style={styles.chevron} />
      </div>
    </div>
  );

  return (
    <div style={styles.pageContainer}>
      <div style={{
        ...styles.contentWrapper,
        paddingTop: isStandalone ? 'calc(env(safe-area-inset-top) + 16px)' : '16px',
      }}>
        <h1 style={styles.title}>Settings</h1>

        <div style={styles.scrollContainer}>
          <SettingsGroup title="Account & Profile">
            <SettingsRow 
              icon={<RiUserLine style={styles.icon} />}
              label="Name"
              value={userData?.name || 'Loading...'}
            />
            <SettingsRow 
              icon={<RiUserLine style={styles.icon} />}
              label="Email"
              value={userData?.email || 'Loading...'}
            />
          </SettingsGroup>

          <SettingsGroup title="Notifications">
            <SettingsRow 
              icon={<RiNotificationLine style={styles.icon} />}
              label="Push Notifications"
              value="On"
            />
            <SettingsRow 
              icon={<RiNotificationLine style={styles.icon} />}
              label="Email Alerts"
              value="Daily"
            />
          </SettingsGroup>

          <SettingsGroup title="App Preferences">
            <SettingsRow 
              icon={<RiPaletteLine style={styles.icon} />}
              label="Appearance"
              value="Light"
            />
          </SettingsGroup>

          <SettingsGroup title="Privacy & Data">
            <SettingsRow 
              icon={<RiShieldLine style={styles.icon} />}
              label="Privacy Settings"
            />
            <SettingsRow 
              icon={<RiShieldLine style={styles.icon} />}
              label="Data & Storage"
            />
          </SettingsGroup>

          <SettingsGroup title="Support">
            <SettingsRow 
              icon={<RiQuestionLine style={styles.icon} />}
              label="Help Center"
            />
          </SettingsGroup>

          <SettingsGroup title="Account Actions">
            <SettingsRow 
              icon={<RiLogoutBoxLine style={styles.icon} />}
              label="Log Out"
              onClick={handleLogout}
              isDestructive
            />
            <SettingsRow 
              icon={<RiDeleteBinLine style={styles.icon} />}
              label="Delete Account"
              isDestructive
            />
          </SettingsGroup>
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
    background: '#f2f2f7', // iOS system gray background
    WebkitOverflowScrolling: 'touch',
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
  },

  scrollContainer: {
    flex: 1,
    overflow: 'auto',
    paddingBottom: 'calc(env(safe-area-inset-bottom) + 16px)',
  },

  group: {
    marginBottom: '32px',
  },

  groupTitle: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#6d6d72', // iOS gray text
    textTransform: 'uppercase',
    marginLeft: '20px',
    marginBottom: '8px',
  },

  groupContent: {
    background: 'white',
    borderTop: '1px solid rgba(0,0,0,0.1)',
    borderBottom: '1px solid rgba(0,0,0,0.1)',
  },

  row: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 20px',
    minHeight: '44px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    ':active': {
      backgroundColor: '#f2f2f7',
    },
    borderBottom: '1px solid rgba(0,0,0,0.1)',
  },

  rowLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },

  rowRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },

  icon: {
    fontSize: '20px',
    color: ACCENT,
  },

  rowLabel: {
    fontSize: '17px',
    fontWeight: '400',
  },

  rowValue: {
    fontSize: '17px',
    color: '#8e8e93', // iOS gray
  },

  chevron: {
    fontSize: '20px',
    color: '#c7c7cc', // iOS light gray
  },
};

export default Settings;