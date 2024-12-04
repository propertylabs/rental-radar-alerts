import React, { useEffect, useState } from 'react';
import { RiAddLine, RiMapPinLine, RiPriceTag3Line, RiHome4Line, RiMoreFill, RiSearchLine, RiEditBoxLine } from 'react-icons/ri';

const SearchNameDisplay = ({ name }) => (
  <div style={styles.nameContainer}>
    <span style={styles.searchName}>{name.toUpperCase()}</span>
    <RiEditBoxLine style={styles.editIcon} />
  </div>
);

const Searches = () => {
  const [isStandalone, setIsStandalone] = useState(false);
  const [searches, setSearches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const standalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    setIsStandalone(standalone);
  }, []);

  // Fetch user's saved searches
  const fetchUserSearches = async () => {
    setIsLoading(true);
    const whopUserId = localStorage.getItem('whop_user_id');

    if (!whopUserId) {
      console.error('User ID not found');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/get-user-searches?userId=${whopUserId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (Array.isArray(result)) {
          // Updated transformation to match the API response structure
          const formattedSearches = result.map(search => ({
            id: search.id,
            name: search.searchName,
            location: search.postcodes.join(', '),
            price: search.criteria.minPrice && search.criteria.maxPrice 
              ? `£${search.criteria.minPrice}-${search.criteria.maxPrice}`
              : 'Any price',
            type: search.criteria.propertyTypes[0] || 'Any type',
            lastAlert: search.last_alert || 'No alerts yet',
            active: search.notifications === 'enabled'
          }));
          setSearches(formattedSearches);
        }
      } else {
        console.error('Failed to fetch searches:', response.status);
      }
    } catch (error) {
      console.error('Error fetching searches:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch searches when component mounts
  useEffect(() => {
    fetchUserSearches();
  }, []);

  // Loading state UI
  if (isLoading) {
    return (
      <div style={{
        ...styles.container,
        paddingTop: isStandalone ? 'calc(env(safe-area-inset-top) + 16px)' : '16px'
      }}>
        <div style={styles.header}>
          <h1 style={styles.title}>Saved Searches</h1>
          <div style={styles.skeletonAddButton} />
        </div>
        <div style={styles.searchList}>
          {[1, 2, 3].map(i => (
            <div key={i} style={styles.skeletonCard}>
              <div style={styles.skeletonContent}>
                <div style={styles.skeletonTop}>
                  <div style={styles.skeletonCount} />
                  <div style={styles.skeletonDot} />
                </div>
                <div style={styles.skeletonLocation} />
                <div style={styles.skeletonPills}>
                  <div style={styles.skeletonPill} />
                  <div style={styles.skeletonPill} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={styles.pageContainer}>
      <div style={{
        ...styles.contentWrapper,
        paddingTop: isStandalone ? 'calc(env(safe-area-inset-top) + 16px)' : '16px'
      }}>
        <div style={styles.header}>
          <h1 style={styles.title}>Saved Searches</h1>
          <button style={styles.addButton}>
            <RiAddLine style={styles.addButtonIcon} />
          </button>
        </div>

        <div style={styles.searchList}>
          {searches.length === 0 ? (
            <div style={styles.emptyState}>
              <RiSearchLine style={styles.emptyStateIcon} />
              <p style={styles.emptyStateText}>No saved searches yet</p>
              <p style={styles.emptyStateSubtext}>Create your first search to get started</p>
            </div>
          ) : (
            searches.map(search => (
              <div key={search.id} style={styles.searchCard}>
                <div style={styles.cardStatus}>
                  <SearchNameDisplay name={search.name} />
                  <button style={styles.moreButton}>
                    <RiMoreFill />
                  </button>
                </div>

                <div style={styles.mainContent}>
                  <div style={styles.locationSection}>
                    <RiMapPinLine style={styles.locationIcon} />
                    <h2 style={styles.locationText}>{search.location}</h2>
                  </div>

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

                <div style={styles.lastUpdated}>
                  Updated {search.lastAlert}
                </div>
              </div>
            ))
          )}
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
    overflow: 'auto',
    WebkitOverflowScrolling: 'touch',
    background: '#fff',
    '-webkit-transform': 'translateZ(0)', // Force GPU acceleration
  },

  contentWrapper: {
    padding: '16px',
    paddingBottom: '80px',
    maxWidth: '800px',
    margin: '0 auto',
    minHeight: '100%',
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
    position: 'relative',
    zIndex: 1,
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

  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '32px',
    borderRadius: '20px',
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(0, 0, 0, 0.06)',
  },

  emptyStateIcon: {
    fontSize: '48px',
    color: '#666',
  },

  emptyStateText: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#000',
    margin: 0,
  },

  emptyStateSubtext: {
    fontSize: '16px',
    color: '#666',
    textAlign: 'center',
  },

  // Skeleton styles
  skeletonAddButton: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'rgba(0, 0, 0, 0.06)',
    animation: 'pulse 1.5s ease-in-out infinite',
  },

  skeletonCard: {
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderRadius: '20px',
    padding: '20px',
    height: '140px', // Match height of actual cards
    border: '1px solid rgba(0, 0, 0, 0.06)',
    overflow: 'hidden',
  },

  skeletonContent: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },

  skeletonTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  skeletonCount: {
    width: '80px',
    height: '28px',
    borderRadius: '14px',
    background: 'rgba(0, 0, 0, 0.06)',
    animation: 'pulse 1.5s ease-in-out infinite',
  },

  skeletonDot: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    background: 'rgba(0, 0, 0, 0.06)',
    animation: 'pulse 1.5s ease-in-out infinite',
  },

  skeletonLocation: {
    width: '70%',
    height: '24px',
    borderRadius: '12px',
    background: 'rgba(0, 0, 0, 0.06)',
    animation: 'pulse 1.5s ease-in-out infinite',
  },

  skeletonPills: {
    display: 'flex',
    gap: '8px',
  },

  skeletonPill: {
    width: '100px',
    height: '32px',
    borderRadius: '16px',
    background: 'rgba(0, 0, 0, 0.06)',
    animation: 'pulse 1.5s ease-in-out infinite',
  },

  '@keyframes pulse': {
    '0%': {
      opacity: 0.6,
    },
    '50%': {
      opacity: 0.4,
    },
    '100%': {
      opacity: 0.6,
    },
  },

  nameContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 12px',
    background: 'rgba(0, 0, 0, 0.03)',
    borderRadius: '8px',
    border: '1px solid rgba(0, 0, 0, 0.06)',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    ':hover': {
      background: 'rgba(0, 0, 0, 0.05)',
      borderColor: 'rgba(0, 0, 0, 0.1)',
    },
  },

  searchName: {
    fontFamily: 'SF Mono, Menlo, monospace',
    fontSize: '15px',
    fontWeight: '500',
    color: '#000',
    letterSpacing: '-0.3px',
    textTransform: 'uppercase',
  },

  editIcon: {
    fontSize: '14px',
    color: 'rgba(0, 0, 0, 0.4)',
    transition: 'color 0.2s ease',
  },
};

export default Searches;
