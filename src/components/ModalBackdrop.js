import React from 'react';

const ModalBackdrop = ({ children }) => {
  const styles = {
    backdrop: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 'env(safe-area-inset-bottom, 0px)',
      background: 'rgba(0, 0, 0, 0.4)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100000,
      height: 'calc(100dvh + env(safe-area-inset-bottom, 0px))',
      width: '100vw',
      overflow: 'hidden',
      touchAction: 'none',
    },
  };

  return (
    <div style={styles.backdrop}>
      {children}
    </div>
  );
};

export default ModalBackdrop; 