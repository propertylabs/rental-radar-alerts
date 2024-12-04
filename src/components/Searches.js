import React, { useEffect, useState } from 'react';
import { RiAddLine, RiMapPinLine, RiPriceTag3Line, RiHome4Line, RiMoreFill, RiSearchLine, RiEditBoxLine, RiDeleteBinLine, RiNotificationLine, RiNotificationOffLine } from 'react-icons/ri';

const ACCENT = '#2E3F32'; // Deep forest green

const SearchNameDisplay = ({ name }) => (
  <div style={styles.nameContainer}>
    <span style={styles.searchName}>{name.toUpperCase()}</span>
    <RiEditBoxLine style={styles.editIcon} />
  </div>
);

const Searches = () => {
  const [isStandalone] = useState(() => 
    window.matchMedia('(display-mode: standalone)').matches || 
    window.navigator.standalone || 
    true  // Default to true to ensure we're always below safe area
  );
  const [searches, setSearches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [searchToDelete, setSearchToDelete] = useState(null);

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

  // Revert the useEffect for click outside handling
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeMenu) {
        setActiveMenu(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [activeMenu]);

  // Revert the handleMoreClick to its simpler form
  const handleMoreClick = (searchId, event) => {
    event.stopPropagation();
    setActiveMenu(activeMenu === searchId ? null : searchId);
  };

  const handleDeleteClick = async (searchId, event) => {
    event.stopPropagation();
    setActiveMenu(null);
    setSearchToDelete(searchId);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!searchToDelete) return;
    
    try {
      const response = await fetch(`/api/delete-search?searchId=${searchToDelete}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSearches(searches.filter(search => search.id !== searchToDelete));
      } else {
        console.error('Failed to delete search');
      }
    } catch (error) {
      console.error('Error deleting search:', error);
    }
    
    setShowDeleteConfirm(false);
    setSearchToDelete(null);
  };

  const handleToggleNotifications = async (searchId, currentStatus, event) => {
    event.stopPropagation();
    
    const newStatus = currentStatus === 'enabled' ? 'disabled' : 'enabled';
    const whopUserId = localStorage.getItem('whop_user_id');
    
    try {
      const response = await fetch(`/api/update-notification`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: whopUserId,
          searchId: searchId,
          notifications: newStatus
        })
      });

      if (response.ok) {
        const button = event.currentTarget;
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
          button.style.transform = 'scale(1)';
        }, 100);

        setSearches(searches.map(search => 
          search.id === searchId 
            ? {...search, active: newStatus === 'enabled'}
            : search
        ));
      } else {
        console.error('Failed to update notifications:', await response.json());
      }
    } catch (error) {
      console.error('Error updating notifications:', error);
    }
  };

  // Loading state UI
  if (isLoading) {
    return (
      <div style={styles.pageContainer}>
        <div style={{
          ...styles.contentWrapper,
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
                  <button 
                    style={styles.moreButton}
                    onClick={(e) => handleMoreClick(search.id, e)}
                  >
                    <RiMoreFill style={{ fontSize: '24px' }} />
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

                {activeMenu === search.id && (
                  <div style={styles.menu} data-menu>
                    <button 
                      style={{
                        ...styles.menuItem,
                        color: '#ff3b30', // iOS red
                      }} 
                      onClick={(e) => handleDeleteClick(search.id, e)}
                    >
                      <RiDeleteBinLine style={{ fontSize: '20px', color: '#ff3b30' }} />
                      <span>Delete</span>
                    </button>
                    <button style={styles.menuItem}>
                      <RiEditBoxLine style={{ fontSize: '20px', color: ACCENT }} />
                      <span>Edit</span>
                    </button>
                    <button 
                      style={styles.menuItem}
                      onClick={(e) => handleToggleNotifications(search.id, search.active ? 'enabled' : 'disabled', e)}
                    >
                      {search.active ? (
                        <RiNotificationLine style={{ fontSize: '20px', color: ACCENT }} />
                      ) : (
                        <RiNotificationOffLine style={{ fontSize: '20px', color: ACCENT }} />
                      )}
                      <span>Notifications {search.active ? 'On' : 'Off'}</span>
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {showDeleteConfirm && (
        <div style={styles.modalBackdrop}>
          <div style={styles.modal}>
            <h3 style={styles.modalTitle}>Delete Search?</h3>
            <p style={styles.modalText}>Are you sure you want to delete this search?</p>
            <div style={styles.modalButtons}>
              <button 
                style={{...styles.modalButton, ...styles.cancelButton}}
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
              <button 
                style={{...styles.modalButton, ...styles.deleteButton}}
                onClick={handleConfirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
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
    background: 'linear-gradient(to bottom, #f8f9fa, #f0f2f1)',
    '-webkit-transform': 'translateZ(0)',
  },

  contentWrapper: {
    padding: '16px',
    paddingBottom: '32px',
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
    fontSize: '32px',
    fontWeight: '700',
    color: ACCENT,
    margin: 0,
    letterSpacing: '-0.5px',
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
    ':hover': {
      transform: 'scale(1.05)',
      boxShadow: '0 4px 12px rgba(46, 63, 50, 0.25)',
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
    background: '#fff',
    borderRadius: '20px',
    padding: '16px',
    border: '1px solid rgba(46, 63, 50, 0.08)',
    boxShadow: '0 4px 12px rgba(46, 63, 50, 0.08)',
    transition: 'all 0.2s ease',
    cursor: 'default',
    WebkitTapHighlightColor: 'transparent',
    '-webkit-touch-callout': 'none',
    userSelect: 'none',
    position: 'relative',
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
    color: 'rgba(46, 63, 50, 0.6)',
    borderRadius: '50%',
    transition: 'all 0.2s ease',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    WebkitTapHighlightColor: 'transparent',
    ':hover': {
      background: 'rgba(46, 63, 50, 0.08)',
      color: ACCENT,
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
    marginTop: '12px',
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
    marginTop: '8px',
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

  // Skeleton styles with matching theme
  skeletonCard: {
    background: '#fff',
    borderRadius: '20px',
    padding: '16px',
    border: '1px solid rgba(46, 63, 50, 0.08)',
    boxShadow: '0 4px 12px rgba(46, 63, 50, 0.08)',
    height: '172px',
  },

  skeletonContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    height: '100%',
    justifyContent: 'space-between',
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
    height: '24px',
    borderRadius: '12px',
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

  '@keyframes pulse': {
    '0%': { opacity: 0.6 },
    '50%': { opacity: 0.4 },
    '100%': { opacity: 0.6 },
  },

  nameContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 12px',
    background: 'rgba(46, 63, 50, 0.04)',
    borderRadius: '8px',
    border: '1px solid rgba(46, 63, 50, 0.08)',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    ':hover': {
      background: 'rgba(46, 63, 50, 0.06)',
      borderColor: 'rgba(46, 63, 50, 0.12)',
    },
  },

  searchName: {
    fontFamily: 'SF Mono, Menlo, monospace',
    fontSize: '15px',
    fontWeight: '500',
    color: ACCENT,
    letterSpacing: '-0.3px',
  },

  editIcon: {
    fontSize: '14px',
    color: 'rgba(46, 63, 50, 0.4)',
    transition: 'color 0.2s ease',
  },

  skeletonAddButton: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'rgba(46, 63, 50, 0.08)',
    animation: 'pulse 1.5s ease-in-out infinite',
  },

  menu: {
    position: 'absolute',
    right: '16px',
    top: '50px',
    background: 'rgba(255, 255, 255, 0.98)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
    padding: '8px',
    zIndex: 100,
    minWidth: '200px',
    animation: 'menuAppear 0.2s cubic-bezier(0.2, 0.85, 0.4, 1.2) forwards',
  },

  menuItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    width: '100%',
    border: 'none',
    background: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    ':hover': {
      background: 'rgba(46, 63, 50, 0.04)',
    },
  },

  modalBackdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.3)',
    backdropFilter: 'blur(4px)',
    WebkitBackdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },

  modal: {
    background: 'white',
    borderRadius: '20px',
    padding: '24px',
    width: '90%',
    maxWidth: '320px',
  },

  modalTitle: {
    margin: 0,
    marginBottom: '16px',
    fontSize: '20px',
    fontWeight: '600',
    color: ACCENT,
  },

  modalText: {
    margin: 0,
    marginBottom: '24px',
    color: '#666',
  },

  modalButtons: {
    display: 'flex',
    gap: '12px',
  },

  modalButton: {
    flex: 1,
    padding: '12px',
    borderRadius: '12px',
    border: 'none',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },

  cancelButton: {
    background: '#f5f5f5',
    color: '#666',
    ':hover': {
      background: '#eeeeee',
    },
  },

  deleteButton: {
    background: '#ff4444',
    color: 'white',
    ':hover': {
      background: '#ff2222',
    },
  },

  '@keyframes menuAppear': {
    '0%': {
      transform: 'scale(0.96)',
      opacity: 0,
    },
    '100%': {
      transform: 'scale(1)',
      opacity: 1,
    },
  },
};

export default Searches;
