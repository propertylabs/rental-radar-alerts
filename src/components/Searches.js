import React, { useEffect, useState } from 'react';
import { RiAddLine, RiMapPinLine, RiPriceTag3Line, RiHome4Line, RiMoreFill, RiSearchLine, RiEditBoxLine, RiDeleteBinLine, RiNotificationLine, RiNotificationOffLine } from 'react-icons/ri';

const ACCENT = '#2E3F32'; // Deep forest green

const SearchNameDisplay = ({ name }) => (
  <div style={styles.nameContainer}>
    <span style={styles.searchName}>{name.toUpperCase()}</span>
    <RiEditBoxLine style={styles.editIcon} />
  </div>
);

const Searches = ({ setModalState, setModalContent }) => {
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
  const [cooldownButtons, setCooldownButtons] = useState(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);

  const menuStyles = `
    @keyframes scaleIn {
      from {
        opacity: 0;
        transform: scale(0.8);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }

    @keyframes fadeOut {
      from {
        opacity: 1;
        transform: translateY(0);
      }
      to {
        opacity: 0;
        transform: translateY(20px);
      }
    }

    .menu-animation {
      animation: scaleIn 0.2s ease-out forwards;
      transform-origin: top right;
    }

    .card-delete-animation {
      animation: fadeOut 0.3s ease-out forwards;
    }
  `;

  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = menuStyles;
    document.head.appendChild(styleSheet);

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, [menuStyles]);

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

  const handleDeleteClick = (searchId, event) => {
    console.log('1. Delete clicked for searchId:', searchId);
    event.stopPropagation();
    setActiveMenu(null);
    
    // Set searchToDelete first
    setSearchToDelete(searchId);
    
    // Then create and set modal content with searchId directly
    const modalContent = (
      <div style={styles.modal}>
        <h3 style={styles.modalTitle}>Delete Search?</h3>
        <p style={styles.modalText}>Are you sure you want to delete this search?</p>
        <div style={styles.modalButtons}>
          <button 
            style={{...styles.modalButton, ...styles.cancelButton}}
            onClick={() => {
              console.log('Cancel clicked');
              handleCloseModal();
              document.body.style.overflow = '';
            }}
          >
            Cancel
          </button>
          <button 
            style={{...styles.modalButton, ...styles.deleteButton}}
            onClick={() => {
              console.log('2. Confirm delete clicked with ID:', searchId);
              handleConfirmDelete(searchId); // Pass searchId directly
            }}
          >
            Delete
          </button>
        </div>
      </div>
    );
    
    document.body.style.overflow = 'hidden';
    setModalContent(modalContent);
    setModalState(true);
  };

  const handleConfirmDelete = async (searchId) => {
    console.log('3. handleConfirmDelete called with searchId:', searchId);
    if (!searchId) {
      console.log('No searchId provided');
      return;
    }
    
    // Rest of the function using searchId instead of searchToDelete
    setModalState(false);
    setModalContent(null);
    
    const searchToRestore = searches.find(s => s.id === searchId);
    console.log('4. Found search to restore:', searchToRestore);
    
    try {
      console.log('5. Making delete API call');
      const response = await fetch('/api/delete-search', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          searchId: searchId
        })
      });

      console.log('6. API response:', response.status);
      if (!response.ok) {
        console.error('Delete failed:', await response.json());
        setSearches(prev => [...prev, searchToRestore]);
      }
    } catch (error) {
      console.error('7. API error:', error);
      setSearches(prev => [...prev, searchToRestore]);
    }
  };

  
  const handleToggleNotifications = async (searchId, currentStatus, event) => {
    event.stopPropagation();
    
    // If button is in cooldown, ignore the click
    if (cooldownButtons.has(searchId)) {
      return;
    }

    const newStatus = currentStatus === 'enabled' ? 'disabled' : 'enabled';
    const whopUserId = localStorage.getItem('whop_user_id');
    
    // Optimistically update UI
    setSearches(searches.map(search => 
      search.id === searchId 
        ? {...search, active: newStatus === 'enabled'}
        : search
    ));

    // Add button to cooldown
    setCooldownButtons(prev => new Set(prev).add(searchId));
    
    // Remove from cooldown after 2 seconds
    setTimeout(() => {
      setCooldownButtons(prev => {
        const next = new Set(prev);
        next.delete(searchId);
        return next;
      });
    }, 2000);
    
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

      if (!response.ok) {
        // If API call fails, revert the UI change
        setSearches(searches.map(search => 
          search.id === searchId 
            ? {...search, active: currentStatus === 'enabled'}
            : search
        ));
        console.error('Failed to update notifications:', await response.json());
      }
    } catch (error) {
      // If API call errors, revert the UI change
      setSearches(searches.map(search => 
        search.id === searchId 
          ? {...search, active: currentStatus === 'enabled'}
          : search
      ));
      console.error('Error updating notifications:', error);
    }
  };

  const handleCloseModal = () => {
    setShowDeleteConfirm(false);
    setSearchToDelete(null);
    document.body.style.overflow = '';
    setModalState(false);
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

  const getNotificationButtonStyle = (searchId) => ({
    ...styles.menuItem,
    opacity: cooldownButtons.has(searchId) ? 0.5 : 1, // Visual feedback for cooldown
    cursor: cooldownButtons.has(searchId) ? 'default' : 'pointer',
  });

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
              <div 
                key={search.id} 
                style={styles.searchCard}
                className={search.isDeleting ? 'card-delete-animation' : ''}
              >
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
                  <div 
                    className="menu-animation"
                    style={styles.menu}
                  >
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
                      style={getNotificationButtonStyle(search.id)}
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
    transition: 'all 0.3s ease',
    cursor: 'default',
    WebkitTapHighlightColor: 'transparent',
    '-webkit-touch-callout': 'none',
    userSelect: 'none',
    position: 'relative',
    transform: 'translateY(0)',
    opacity: 1,
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
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(25px)',
    WebkitBackdropFilter: 'blur(25px)',
    borderRadius: '14px',
    boxShadow: '0 2px 24px rgba(0, 0, 0, 0.08), 0 0 1px rgba(0, 0, 0, 0.1)',
    padding: '6px',
    zIndex: 100,
    minWidth: '220px',
  },

  menuItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    width: '100%',
    border: 'none',
    background: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    fontWeight: '510',
    fontSize: '16px',
    WebkitTapHighlightColor: 'transparent',
    color: 'inherit',
    textDecoration: 'none',
    WebkitAppearance: 'none',
    ':active': {
      background: 'rgba(46, 63, 50, 0.06)',
    },
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
};

export default Searches;
