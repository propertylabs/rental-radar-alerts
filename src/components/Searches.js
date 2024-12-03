import React from 'react';
import { RiAddLine, RiMapPinLine, RiPriceTag3Line, RiHome4Line } from 'react-icons/ri';

const Searches = () => {
  // Dummy data for demonstration
  const savedSearches = [
    {
      id: 1,
      location: 'Manchester City Centre',
      price: '£800-1200',
      type: 'Flat',
      propertyCount: 42,
      lastAlert: '2h ago'
    },
    {
      id: 2,
      location: 'Didsbury',
      price: '£1000-1500',
      type: 'House',
      propertyCount: 28,
      lastAlert: '5h ago'
    }
  ];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Searches</h1>
      </div>

      <div style={styles.searchGrid}>
        {/* Add New Search Card */}
        <div style={styles.addCard}>
          <div style={styles.addCardContent}>
            <div style={styles.addIconWrapper}>
              <RiAddLine style={styles.addIcon} />
            </div>
            <span style={styles.addText}>Create new search</span>
          </div>
        </div>

        {/* Saved Search Cards */}
        {savedSearches.map(search => (
          <div key={search.id} style={styles.searchCard}>
            <div style={styles.cardHeader}>
              <div style={styles.propertyCount}>{search.propertyCount}</div>
              <div style={styles.lastAlert}>{search.lastAlert}</div>
            </div>
            
            <div style={styles.cardContent}>
              <div style={styles.locationRow}>
                <RiMapPinLine style={styles.cardIcon} />
                <span style={styles.location}>{search.location}</span>
              </div>
              
              <div style={styles.detailRow}>
                <div style={styles.detail}>
                  <RiPriceTag3Line style={styles.detailIcon} />
                  <span>{search.price}</span>
                </div>
                <div style={styles.detail}>
                  <RiHome4Line style={styles.detailIcon} />
                  <span>{search.type}</span>
                </div>
              </div>
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
  },

  header: {
    marginBottom: '24px',
  },

  title: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#000',
    margin: 0,
  },

  searchGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '16px',
    '@media (min-width: 768px)': {
      gap: '24px',
    },
  },

  addCard: {
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    borderRadius: '16px',
    border: '2px dashed rgba(0, 0, 0, 0.1)',
    height: '160px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    ':hover': {
      borderColor: 'rgba(0, 0, 0, 0.2)',
      transform: 'translateY(-2px)',
    },
  },

  addCardContent: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
  },

  addIconWrapper: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    background: '#000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  addIcon: {
    fontSize: '24px',
    color: '#fff',
  },

  addText: {
    color: '#000',
    fontSize: '14px',
    fontWeight: '500',
  },

  searchCard: {
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    borderRadius: '16px',
    padding: '16px',
    height: '160px',
    display: 'flex',
    flexDirection: 'column',
    cursor: 'pointer',
    transition: 'transform 0.2s ease',
    ':hover': {
      transform: 'translateY(-2px)',
    },
  },

  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },

  propertyCount: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#000',
  },

  lastAlert: {
    fontSize: '12px',
    color: '#666',
  },

  cardContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },

  locationRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '16px',
  },

  location: {
    fontSize: '16px',
    fontWeight: '500',
    color: '#000',
  },

  detailRow: {
    display: 'flex',
    gap: '16px',
  },

  detail: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '14px',
    color: '#666',
  },

  cardIcon: {
    fontSize: '18px',
    color: '#000',
  },

  detailIcon: {
    fontSize: '16px',
  },
};

export default Searches;
