import React from 'react';

const BaseSearchModal = {
  styles: {
    backdrop: {
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
      alignItems: 'flex-end',
      transition: 'opacity 0.3s ease',
      touchAction: 'none',
    },

    modal: {
      position: 'relative',
      width: '100%',
      height: 'calc(100dvh - env(safe-area-inset-top) - 100px)',
      background: 'white',
      borderTopLeftRadius: '20px',
      borderTopRightRadius: '20px',
      padding: '24px',
      transition: 'transform 0.3s ease',
      overflowY: 'hidden',
      touchAction: 'none',
    },

    header: {
      padding: '0px',
      marginBottom: '24px',
    },

    headerContent: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '32px',
    },

    headerLeft: {
      flex: 1,
      display: 'flex',
      justifyContent: 'flex-start',
    },

    headerCenter: {
      flex: 2,
      display: 'flex',
      justifyContent: 'center',
    },

    headerRight: {
      flex: 1,
      display: 'flex',
      justifyContent: 'flex-end',
    },

    title: {
      fontSize: '24px',
      fontWeight: '600',
      margin: 0,
      lineHeight: '32px',
    },

    backButton: {
      background: 'none',
      border: 'none',
      padding: '0',
      height: '32px',
      color: '#007AFF',
      fontSize: '17px',
      fontWeight: '500',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
    },

    closeButton: {
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      background: 'rgba(0, 0, 0, 0.06)',
      border: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      color: '#666',
      fontSize: '18px',
      transition: 'background-color 0.2s ease',
      padding: '0 0 1px 0',
      lineHeight: '18px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
  },

  renderModalFrame: ({ isOpen, onClose, children, title, step, setStep }) => (
    <div 
      style={{
        ...BaseSearchModal.styles.backdrop,
        opacity: isOpen ? 1 : 0,
        pointerEvents: isOpen ? 'auto' : 'none',
      }} 
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        style={{
          ...BaseSearchModal.styles.modal,
          transform: `translateY(${isOpen ? '0' : '100%'})`,
        }} 
        onClick={(e) => e.stopPropagation()}
      >
        <div style={BaseSearchModal.styles.header}>
          <div style={BaseSearchModal.styles.headerContent}>
            <div style={BaseSearchModal.styles.headerLeft}>
              {step > 0 && (
                <button 
                  style={BaseSearchModal.styles.backButton} 
                  onClick={() => setStep(prev => prev - 1)}
                >
                  ← Back
                </button>
              )}
            </div>
            <div style={BaseSearchModal.styles.headerCenter}>
              <h2 style={BaseSearchModal.styles.title}>{title}</h2>
            </div>
            <div style={BaseSearchModal.styles.headerRight}>
              <button 
                style={BaseSearchModal.styles.closeButton} 
                onClick={onClose}
              >
                ×
              </button>
            </div>
          </div>
        </div>
        {children}
      </div>
    </div>
  ),
};

export default BaseSearchModal; 