import React, { useState, useEffect } from 'react';
import { RiAddLine, RiMapPinLine, RiPriceTag3Line, RiHome4Line, RiSearchLine } from 'react-icons/ri';

const ACCENT = '#2E3F32'; // Deep forest green

const SearchesNew = ({ onOpenSearchModal }) => {
  const [isStandalone] = useState(() => 
    window.matchMedia('(display-mode: standalone)').matches || 
    window.navigator.standalone || 
    true
  );
  const [searches, setSearches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch searches when component mounts
  useEffect(() => {
    const fetchUserSearches = async () => {
      setIsLoading(true);
      try {
        const whopUserId = localStorage.getItem('whop_user_id');
        if (!whopUserId) {
          console.error('No user ID found');
          setIsLoading(false);
          return;
        }

        const response = await fetch(`/api/get-user-searches?userId=${whopUserId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          const result = await response.json();
          if (Array.isArray(result)) {
            const formattedSearches = result
              .map(search => ({
                id: search.id,
                name: search.searchName,
                location: search.postcodes.join(', '),
                price: search.criteria.minPrice && search.criteria.maxPrice 
                  ? `£${search.criteria.minPrice}-${search.criteria.maxPrice}`
                  : 'Any price',
                type: search.criteria.propertyTypes[0] || 'Any type',
                lastAlert: search.last_alert || 'No alerts yet',
                active: search.notifications,
              }))
              .sort((a, b) => b.createdAt - a.createdAt);

            setSearches(formattedSearches);
          }
        }
      } catch (error) {
        console.error('Error fetching searches:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserSearches();
  }, []);

  return (
    <div style={styles.pageContainer}>
      <div style={{
        ...styles.contentWrapper,
        paddingTop: isStandalone ? 'calc(env(safe-area-inset-top) + 16px)' : '16px',
      }}>
        <div style={styles.header}>
          <h1 style={styles.title}>Searches (New)</h1>
          <button 
            style={styles.addButton}
            onClick={onOpenSearchModal}
          >
            <RiAddLine style={styles.addButtonIcon} />
          </button>
        </div>

        <div style={styles.scrollContainer}>
          {isLoading ? (
            // Skeleton loading state
            [...Array(3)].map((_, i) => (
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
            ))
          ) : searches.length === 0 ? (
            // Empty state
            <div style={styles.emptyState}>
              <RiSearchLine style={styles.emptyStateIcon} />
              <p style={styles.emptyStateText}>No saved searches yet</p>
              <p style={styles.emptyStateSubtext}>Create your first search to get started</p>
            </div>
          ) : (
            // Search list
            searches.map(search => (
              <div key={search.id} style={styles.searchCard}>
                <div style={styles.cardStatus}>
                  <div style={styles.nameContainer}>
                    <span style={styles.searchName}>{search.name}</span>
                  </div>
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

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: '0 20px 16px',
  },

  title: {
    fontSize: '32px',
    fontWeight: '700',
    color: ACCENT,
    margin: 0,
    letterSpacing: '-0.5px',
    fontFamily: 'inherit',
  },

  addButton: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: ACCENT,
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 8px rgba(46, 63, 50, 0.15)',
  },

  addButtonIcon: {
    color: '#fff',
    fontSize: '24px',
  },

  scrollContainer: {
    flex: 1,
    overflow: 'auto',
    paddingBottom: 'calc(env(safe-area-inset-bottom) + 16px)',
    padding: '0 20px',
  },

  // Skeleton styles
  skeletonCard: {
    background: '#fff',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '16px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },

  skeletonContent: {
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
    height: '24px',
    borderRadius: '12px',
    background: 'rgba(46, 63, 50, 0.08)',
    animation: 'pulse 1.5s ease-in-out infinite',
  },

  skeletonDot: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    background: 'rgba(46, 63, 50, 0.08)',
    animation: 'pulse 1.5s ease-in-out infinite',
  },

  skeletonLocation: {
    width: '70%',
    height: '20px',
    borderRadius: '10px',
    background: 'rgba(46, 63, 50, 0.08)',
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
    background: 'rgba(46, 63, 50, 0.08)',
    animation: 'pulse 1.5s ease-in-out infinite',
  },

  // Empty state styles
  emptyState: {
    background: '#fff',
    borderRadius: '12px',
    padding: '32px 24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    marginTop: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },

  emptyStateIcon: {
    fontSize: '32px',
    color: 'rgba(46, 63, 50, 0.2)',
    marginBottom: '8px',
  },

  emptyStateText: {
    fontSize: '18px',
    fontWeight: '600',
    color: ACCENT,
    margin: 0,
  },

  emptyStateSubtext: {
    fontSize: '15px',
    color: '#666',
    margin: 0,
  },

  // Search card styles
  searchCard: {
    background: '#fff',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '16px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },

  cardStatus: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },

  nameContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 12px',
    background: 'rgba(46, 63, 50, 0.04)',
    borderRadius: '8px',
    border: '1px solid rgba(46, 63, 50, 0.08)',
  },

  searchName: {
    fontFamily: 'SF Mono, Menlo, monospace',
    fontSize: '15px',
    fontWeight: '500',
    color: ACCENT,
    letterSpacing: '-0.3px',
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
    color: ACCENT,
  },

  locationText: {
    fontSize: '18px',
    fontWeight: '600',
    color: ACCENT,
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
    gap: '6px',
    padding: '8px 12px',
    background: 'rgba(46, 63, 50, 0.04)',
    borderRadius: '20px',
    fontSize: '14px',
    color: ACCENT,
    fontWeight: '500',
  },

  pillIcon: {
    fontSize: '16px',
  },

  lastUpdated: {
    fontSize: '13px',
    color: 'rgba(46, 63, 50, 0.6)',
    marginTop: '12px',
  },

  '@keyframes pulse': {
    '0%': { opacity: 0.6 },
    '50%': { opacity: 0.4 },
    '100%': { opacity: 0.6 },
  },
};

export default SearchesNew; 