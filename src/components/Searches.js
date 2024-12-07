import React, { useState, useEffect, useRef } from 'react';
import { 
  RiAddLine, 
  RiMapPinLine, 
  RiPriceTag3Line, 
  RiHome4Line, 
  RiMoreFill, 
  RiSearchLine, 
  RiEditBoxLine, 
  RiDeleteBinLine, 
  RiNotificationLine, 
  RiNotificationOffLine 
} from 'react-icons/ri';

const ACCENT = '#2E3F32';

const SearchNameDisplay = ({ name, searchId, onNameUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(name);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleStartEdit = (e) => {
    e.stopPropagation();
    setIsEditing(true);
    setEditedName(name);
  };

  const handleConfirmSave = async () => {
    setShowConfirm(false);
    setIsLoading(true);
    
    try {
      const whopUserId = localStorage.getItem('whop_user_id');
      console.log('Starting name update:', {
        userId: whopUserId,
        searchId,
        searchName: editedName.trim(),
        currentName: name
      });

      const response = await fetch('/api/update-search-name', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: whopUserId,
          searchId,
          searchName: editedName.trim()
        })
      });

      const data = await response.json();
      console.log('API Response:', data);

      if (response.ok) {
        onNameUpdate(searchId, editedName.trim());
        setIsEditing(false);
        console.log('Name update successful');
      } else {
        console.error('Failed to update name:', data.error);
        alert('Failed to update name. Please try again.');
      }
    } catch (error) {
      console.error('Error updating name:', error);
      alert('Error updating name. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isEditing) {
    return (
      <div style={styles.nameEditContainer}>
        <input
          ref={inputRef}
          style={styles.nameInput}
          value={editedName.toUpperCase()}
          onChange={(e) => setEditedName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && editedName.trim() && editedName.trim() !== name) {
              setShowConfirm(true);
            }
            if (e.key === 'Escape') {
              setIsEditing(false);
              setEditedName(name);
            }
          }}
          maxLength={30}
          onClick={(e) => e.stopPropagation()}
          autoFocus
        />
        <div style={styles.editButtons}>
          <button
            style={styles.editButton}
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(false);
              setEditedName(name);
            }}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            style={{...styles.editButton, ...styles.saveButton}}
            onClick={(e) => {
              e.stopPropagation();
              setShowConfirm(true);
            }}
            disabled={isLoading || !editedName.trim() || editedName.trim() === name}
          >
            {isLoading ? '...' : 'Save'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      style={styles.nameContainer}
      onClick={handleStartEdit}
    >
      <span style={styles.searchName}>{name.toUpperCase()}</span>
      <RiEditBoxLine style={styles.editIcon} />

      {showConfirm && (
        <div style={styles.confirmOverlay} onClick={(e) => e.stopPropagation()}>
          <div style={styles.confirmDialog}>
            <h3 style={styles.confirmTitle}>Update Search Name?</h3>
            <p style={styles.confirmText}>
              Change name from "{name}" to "{editedName.trim()}"?
            </p>
            <div style={styles.confirmButtons}>
              <button 
                style={{...styles.confirmButton, ...styles.cancelButton}}
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
              <button 
                style={{...styles.confirmButton, ...styles.saveButton}}
                onClick={handleConfirmSave}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

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

  @keyframes slide-in-new {
    from {
      transform: translateY(${-206}px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @keyframes slide-down {
    from {
      transform: translateY(0);
    }
    to {
      transform: translateY(16px);
    }
  }

  .slide-in-new {
    animation: slide-in-new 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
  }

  .slide-down {
    animation: slide-down 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  }

  @keyframes deleteCard {
    0% {
      transform: translateX(0);
      opacity: 1;
    }
    100% {
      transform: translateX(100%);
      opacity: 0;
    }
  }

  .card-deleting {
    animation: deleteCard 0.3s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
  }

  .card-moving {
    transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
  }
`;

const SearchesNew = ({ onOpenSearchModal }) => {
  const [isStandalone] = useState(() => 
    window.matchMedia('(display-mode: standalone)').matches || 
    window.navigator.standalone || 
    true
  );
  const [searches, setSearches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [searchToDelete, setSearchToDelete] = useState(null);
  const [cooldownButtons, setCooldownButtons] = useState(new Set());
  const [whopUserId, setWhopUserId] = useState(null);
  const [newSearchId, setNewSearchId] = useState(null);

  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = menuStyles;
    document.head.appendChild(styleSheet);

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, [menuStyles]);

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

  const handleMoreClick = (searchId, event) => {
    event.stopPropagation();
    setActiveMenu(activeMenu === searchId ? null : searchId);
  };

  const handleDeleteClick = (searchId) => {
    setSearchToDelete(searchId);
    setShowDeleteConfirm(true);
    setActiveMenu(null);
    document.body.style.overflow = 'hidden';
  };

  const handleConfirmDelete = async () => {
    if (!searchToDelete) return;

    try {
      const cardToDelete = searches.find(s => s.id === searchToDelete);
      if (cardToDelete) {
        setSearches(prevSearches => 
          prevSearches.map(search => 
            search.id === searchToDelete 
              ? { ...search, isDeleting: true }
              : search
          )
        );

        await new Promise(resolve => setTimeout(resolve, 300));
      }

      const response = await fetch('/api/delete-search', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          searchId: searchToDelete,
          user_id: whopUserId 
        }),
      });

      if (response.ok) {
        setSearches(prevSearches => prevSearches.filter(search => search.id !== searchToDelete));
      }
    } catch (error) {
      console.error('Error deleting search:', error);
    } finally {
      setShowDeleteConfirm(false);
      setSearchToDelete(null);
      document.body.style.overflow = '';
    }
  };

  const handleToggleNotifications = async (searchId, newStatus, event) => {
    event.stopPropagation();
    
    if (cooldownButtons.has(searchId)) {
      return;
    }

    setCooldownButtons(prev => new Set(prev).add(searchId));
    
    setTimeout(() => {
      setCooldownButtons(prev => {
        const next = new Set(prev);
        next.delete(searchId);
        return next;
      });
    }, 2000);
    
    try {
      const response = await fetch('/api/update-notification', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          searchId,
          user_id: whopUserId,
          notifications: newStatus
        })
      });

      if (response.ok) {
        setSearches(searches.map(search => 
          search.id === searchId 
            ? {...search, active: newStatus}
            : search
        ));
      }
    } catch (error) {
      console.error('Error updating notifications:', error);
    }
  };

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
              createdAt: search.created_at,
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

  useEffect(() => {
    const userId = localStorage.getItem('whop_user_id');
    setWhopUserId(userId);
    fetchUserSearches();
  }, []);

  const getNotificationButtonStyle = (searchId) => ({
    ...styles.menuItem,
    opacity: cooldownButtons.has(searchId) ? 0.5 : 1,
    cursor: cooldownButtons.has(searchId) ? 'default' : 'pointer',
  });

  const refreshSearches = async () => {
    console.log('Starting refreshSearches');
    const whopUserId = localStorage.getItem('whop_user_id');
    if (!whopUserId) return;

    const response = await fetch(`/api/get-user-searches?userId=${whopUserId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      console.log('Refresh response received');
      const result = await response.json();
      if (Array.isArray(result)) {
        const formattedSearches = result.map(search => ({
          id: search.id,
          name: search.searchName,
          location: search.postcodes.join(', '),
          price: search.criteria.minPrice && search.criteria.maxPrice 
            ? `£${search.criteria.minPrice}-${search.criteria.maxPrice}`
            : 'Any price',
          type: search.criteria.propertyTypes[0] || 'Any type',
          lastAlert: search.last_alert || 'No alerts yet',
          active: search.notifications
        }));
        console.log('Setting new searches:', formattedSearches);
        setSearches(formattedSearches);
      }
    }
  };

  useEffect(() => {
    const handleRefresh = () => {
      refreshSearches();
    };
    
    window.addEventListener('refreshSearches', handleRefresh);
    return () => window.removeEventListener('refreshSearches', handleRefresh);
  }, []);

  const handleNameUpdate = (searchId, newName) => {
    setSearches(searches.map(search => 
      search.id === searchId 
        ? {...search, name: newName}
        : search
    ));
  };

  return (
    <div style={styles.pageContainer}>
      <div style={{
        ...styles.contentWrapper,
        paddingTop: isStandalone ? 'calc(env(safe-area-inset-top) + 16px)' : '16px',
      }}>
        <h1 
          style={{...styles.title, cursor: 'pointer'}} 
          onClick={refreshSearches}
        >
          Searches (New)
        </h1>
        <button 
          style={styles.addButton}
          onClick={onOpenSearchModal}
        >
          <RiAddLine style={styles.addButtonIcon} />
        </button>
        
        <div style={styles.scrollContainer}>
          {isLoading ? (
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
            <div style={styles.emptyState}>
              <RiSearchLine style={styles.emptyStateIcon} />
              <p style={styles.emptyStateText}>No saved searches yet</p>
              <p style={styles.emptyStateSubtext}>Create your first search to get started</p>
            </div>
          ) : (
            <div style={styles.searchList}>
              {searches.map((search, index) => (
                <div 
                  key={search.id}
                  style={{
                    ...styles.searchCard,
                    transform: `translateY(${index * (206 + 24)}px)`,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    opacity: search.id === newSearchId ? 0 : 1,
                  }}
                  className={`
                    card-moving
                    ${search.isDeleting ? 'card-deleting' : ''}
                    ${search.id === newSearchId ? 'slide-in-new' : ''}
                  `}
                >
                  <div style={styles.cardStatus}>
                    <SearchNameDisplay 
                      name={search.name} 
                      searchId={search.id}
                      onNameUpdate={handleNameUpdate}
                    />
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
                          color: '#ff3b30',
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
                        onClick={(e) => handleToggleNotifications(search.id, !search.active, e)}
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
              ))}
            </div>
          )}
        </div>
      </div>

      {showDeleteConfirm && (
        <div style={styles.modalBackdrop}>
          <div style={styles.confirmModal}>
            <h3 style={styles.confirmTitle}>Delete Search?</h3>
            <p style={styles.confirmText}>
              Are you sure you want to delete this search? This action cannot be undone.
            </p>
            <div style={styles.confirmButtons}>
              <button 
                style={{...styles.confirmButton, ...styles.cancelButton}}
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setSearchToDelete(null);
                  document.body.style.overflow = '';
                }}
              >
                Cancel
              </button>
              <button 
                style={{...styles.confirmButton, ...styles.deleteButton}}
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
    overflow: 'hidden',
    background: 'linear-gradient(to bottom, #f8f9fa, #f0f2f1)',
    WebkitOverflowScrolling: 'touch',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    '-webkit-font-smoothing': 'antialiased',
    '-moz-osx-font-smoothing': 'grayscale',
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
    fontFamily: 'inherit',
  },

  addButton: {
    position: 'absolute',
    top: 'calc(env(safe-area-inset-top) + 16px)',
    right: '20px',
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

  searchList: {
    position: 'relative',
    height: '600px',
  },

  skeletonCard: {
    background: '#fff',
    borderRadius: '20px',
    padding: '16px',
    marginBottom: '24px',
    boxShadow: '0 4px 12px rgba(46, 63, 50, 0.08)',
    height: '172px',
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid rgba(46, 63, 50, 0.08)',
  },

  skeletonContent: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },

  skeletonTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },

  skeletonCount: {
    width: '140px',
    height: '34px',
    borderRadius: '8px',
    background: 'rgba(46, 63, 50, 0.08)',
    animation: 'pulse 1.5s ease-in-out infinite',
  },

  skeletonDot: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'rgba(46, 63, 50, 0.08)',
    animation: 'pulse 1.5s ease-in-out infinite',
    marginRight: '-8px',
  },

  skeletonLocation: {
    width: '60%',
    height: '24px',
    borderRadius: '12px',
    background: 'rgba(46, 63, 50, 0.08)',
    animation: 'pulse 1.5s ease-in-out infinite',
    marginTop: '12px',
  },

  skeletonPills: {
    display: 'flex',
    gap: '8px',
    marginTop: 'auto',
    paddingTop: '16px',
    marginBottom: '12px',
  },

  skeletonPill: {
    width: '120px',
    height: '36px',
    borderRadius: '20px',
    background: 'rgba(46, 63, 50, 0.08)',
    animation: 'pulse 1.5s ease-in-out infinite',
    padding: '8px 12px',
  },

  emptyState: {
    background: '#fff',
    borderRadius: '20px',
    padding: '32px 24px',
    border: '1px solid rgba(46, 63, 50, 0.08)',
    boxShadow: '0 4px 12px rgba(46, 63, 50, 0.08)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    height: '142px',
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

  searchCard: {
    background: '#fff',
    borderRadius: '20px',
    padding: '16px',
    border: '1px solid rgba(46, 63, 50, 0.08)',
    boxShadow: '0 4px 12px rgba(46, 63, 50, 0.08)',
    height: '172px',
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
    transition: 'all 0.2s ease',
    cursor: 'pointer',
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
  },

  modalBackdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.4)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    zIndex: 100000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px',
  },

  confirmModal: {
    background: 'white',
    borderRadius: '16px',
    padding: '24px',
    width: '100%',
    maxWidth: '320px',
  },

  confirmTitle: {
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '12px',
    color: '#2E3F32',
  },

  confirmText: {
    fontSize: '15px',
    color: '#666',
    marginBottom: '24px',
    lineHeight: 1.4,
  },

  confirmButtons: {
    display: 'flex',
    gap: '12px',
  },

  confirmButton: {
    flex: 1,
    padding: '12px',
    borderRadius: '12px',
    border: 'none',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
  },

  cancelButton: {
    background: 'rgba(46, 63, 50, 0.1)',
    color: '#2E3F32',
  },

  deleteButton: {
    background: '#ff3b30',
    color: 'white',
  },

  nameEditContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 12px',
    background: 'rgba(46, 63, 50, 0.04)',
    borderRadius: '8px',
    border: '1px solid rgba(46, 63, 50, 0.08)',
    transition: 'all 0.2s ease',
    maxWidth: 'calc(100% - 60px)',
  },

  nameInput: {
    background: 'none',
    border: 'none',
    fontFamily: 'SF Mono, Menlo, monospace',
    fontSize: '15px',
    fontWeight: '500',
    color: ACCENT,
    letterSpacing: '-0.3px',
    width: '100px',
    padding: 0,
    margin: 0,
    outline: 'none',
    textTransform: 'uppercase',
  },

  editButtons: {
    display: 'flex',
    gap: '8px',
    marginLeft: '8px',
  },

  editButton: {
    background: 'none',
    border: 'none',
    padding: '4px 8px',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    color: ACCENT,
    transition: 'all 0.2s ease',
  },

  saveButton: {
    background: ACCENT,
    color: 'white',
  },

  confirmOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.4)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    zIndex: 100000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px',
  },

  confirmDialog: {
    background: 'white',
    borderRadius: '16px',
    padding: '24px',
    width: '100%',
    maxWidth: '320px',
  },
};

export default SearchesNew; 