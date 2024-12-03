import React, { useEffect, useState } from 'react';
import { RiAddLine, RiMapPinLine, RiPriceTag3Line, RiHome4Line, RiMoreFill } from 'react-icons/ri';

const Searches = () => {
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const standalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    setIsStandalone(standalone);
  }, []);

  // Dummy data
  const savedSearches = [
    {
      id: 1,
      location: 'Manchester City Centre',
      price: '£800-1200',
      type: 'Flat',
      propertyCount: 42,
      lastAlert: '2h ago',
      active: true
    },
    {
      id: 2,
      location: 'Didsbury',
      price: '£1000-1500',
      type: 'House',
      propertyCount: 28,
      lastAlert: '5h ago',
      active: true
    }
  ];

  return (
    <div style={{
      ...styles.container,
      paddingTop: isStandalone ? 'calc(env(safe-area-inset-top) + 16px)' : '16px'
    }}>
      {/* Header Section */}
      <div style={styles.header}>
        <h1 style={styles.title}>Saved Searches</h1>
        <button style={styles.addButton}>
          <RiAddLine style={styles.addButtonIcon} />
        </button>
      </div>

      {/* Search Cards */}
      <div style={styles.searchList}>
        {savedSearches.map(search => (
          <div key={search.id} style={styles.searchCard}>
            {/* Card Status Bar */}
            <div style={styles.cardStatus}>
              <div style={styles.statusIndicator}>
                <span style={styles.propertyCount}>{search.propertyCount}</span>
                <span style={styles.propertyLabel}>properties</span>
              </div>
              <button style={styles.moreButton}>
                <RiMoreFill />
              </button>
            </div>

            {/* Main Content */}
            <div style={styles.mainContent}>
              <div style={styles.locationSection}>
                <RiMapPinLine style={styles.locationIcon} />
                <h2 style={styles.locationText}>{search.location}</h2>
              </div>

              {/* Criteria Pills */}
              <div style={styles.criteriaSection}>
                <div style={styles.pill}>
                  <RiPriceTag3Line style={styles.pillIcon} />
                  <span>{search.price}</span>
                </div>
                <div style={styles.pill}>
                  <RiHome4Line style={styles.pillIcon} />
                  <span>{search.type}</span>
                </div>
              </div>
            </div>

            {/* Last Updated */}
            <div style={styles.lastUpdated}>
              Updated {search.lastAlert}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '16px',
    paddingBottom: '80px',
    maxWidth: '800px',
    margin: '0 auto',
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },

  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#000',
    margin: 0,
  },

  addButton: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: '#000',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'transform 0.2s ease',
    ':hover': {
      transform: 'scale(1.05)',
    },
  },

  addButtonIcon: {
    color: '#fff',
    fontSize: '24px',
  },

  searchList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },

  searchCard: {
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderRadius: '20px',
    padding: '20px',
    border: '1px solid rgba(0, 0, 0, 0.06)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    cursor: 'pointer',
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.04)',
    },
  },

  cardStatus: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },

  statusIndicator: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '4px',
  },

  propertyCount: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#000',
  },

  propertyLabel: {
    fontSize: '14px',
    color: '#666',
  },

  moreButton: {
    background: 'none',
    border: 'none',
    padding: '8px',
    cursor: 'pointer',
    color: '#666',
    borderRadius: '50%',
    ':hover': {
      background: 'rgba(0, 0, 0, 0.05)',
    },
  },

  mainContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },

  locationSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },

  locationIcon: {
    fontSize: '20px',
    color: '#000',
  },

  locationText: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#000',
    margin: 0,
  },

  criteriaSection: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },

  pill: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '6px 12px',
    background: 'rgba(0, 0, 0, 0.05)',
    borderRadius: '20px',
    fontSize: '14px',
    color: '#666',
  },

  pillIcon: {
    fontSize: '16px',
  },

  lastUpdated: {
    fontSize: '12px',
    color: '#666',
    marginTop: '16px',
  },
};

export default Searches;
