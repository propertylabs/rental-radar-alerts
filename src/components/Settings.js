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

  const ProfileSection = ({ userData }) => (
    <div style={styles.profileCard}>
      <div style={styles.profileImageContainer}>
        {userData?.image_url ? (
          <img 
            src={userData.image_url} 
            alt={userData.name} 
            style={styles.profileImage}
          />
        ) : (
          <div style={styles.profileImagePlaceholder}>
            {userData?.name?.charAt(0) || '?'}
          </div>
        )}
      </div>
      <div style={styles.profileInfo}>
        <h2 style={styles.profileName}>{userData?.name || 'Loading...'}</h2>
        <p style={styles.profileEmail}>{userData?.email || 'Loading...'}</p>
      </div>
      <div style={styles.membershipBadge}>
        Pro Member
      </div>
    </div>
  );

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
        <div style={styles.iconContainer}>
          {icon}
        </div>
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
        paddingTop: isStandalone ? 'calc(env(safe-area-inset-top))' : '0',
      }}>
        <div style={styles.scrollContainer}>
          <ProfileSection userData={userData} />

          <SettingsGroup title="App Preferences">
            <SettingsRow 
              icon={<RiPaletteLine style={styles.icon} />}
              label="Appearance"
              value="Light"
            />
            <SettingsRow 
              icon={<RiNotificationLine style={styles.icon} />}
              label="Notifications"
              value="On"
            />
          </SettingsGroup>

          <SettingsGroup title="Privacy & Security">
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

          <SettingsGroup title="Account">
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
    background: '#F5F5F7', // Apple-style background
    WebkitOverflowScrolling: 'touch',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  },

  contentWrapper: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },

  scrollContainer: {
    flex: 1,
    overflow: 'auto',
    padding: '16px',
    paddingBottom: 'calc(env(safe-area-inset-bottom) + 16px)',
  },

  profileCard: {
    background: 'white',
    borderRadius: '24px',
    padding: '24px',
    marginBottom: '24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
  },

  profileImageContainer: {
    width: '100px',
    height: '100px',
    marginBottom: '16px',
    position: 'relative',
  },

  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '3px solid white',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },

  profileImagePlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #2E3F32 0%, #4A6350 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '36px',
    color: 'white',
    fontWeight: '600',
    border: '3px solid white',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },

  profileInfo: {
    marginBottom: '16px',
  },

  profileName: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#2E3F32',
    margin: '0 0 4px 0',
    letterSpacing: '-0.5px',
  },

  profileEmail: {
    fontSize: '15px',
    color: '#666',
    margin: 0,
    letterSpacing: '-0.2px',
  },

  membershipBadge: {
    background: 'linear-gradient(135deg, #2E3F32 0%, #4A6350 100%)',
    color: 'white',
    padding: '6px 12px',
    borderRadius: '12px',
    fontSize: '13px',
    fontWeight: '600',
    letterSpacing: '-0.2px',
  },

  group: {
    marginBottom: '24px',
  },

  groupTitle: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#6d6d72',
    textTransform: 'uppercase',
    marginLeft: '16px',
    marginBottom: '8px',
    letterSpacing: '0.1em',
  },

  groupContent: {
    background: 'white',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
  },

  row: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    borderBottom: '1px solid rgba(0,0,0,0.05)',
    ':active': {
      backgroundColor: '#f8f8f8',
    },
  },

  iconContainer: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    background: 'rgba(46, 63, 50, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
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
    fontSize: '18px',
    color: '#2E3F32',
  },

  rowLabel: {
    fontSize: '17px',
    fontWeight: '400',
    letterSpacing: '-0.2px',
    color: '#2E3F32',
  },

  rowValue: {
    fontSize: '17px',
    color: '#8e8e93',
    letterSpacing: '-0.2px',
  },

  chevron: {
    fontSize: '20px',
    color: '#c7c7cc',
  },
};

export default Settings;