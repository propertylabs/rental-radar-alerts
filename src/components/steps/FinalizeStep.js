import React, { useState } from 'react';
import { RiBellLine, RiBellFill } from 'react-icons/ri';

const FinalizeStep = ({ values, onChange, onSave, isSaving, isSaved }) => {
  const styles = {
    container: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: '32px',
      padding: '0px',
    },

    header: {
      marginBottom: '4px',
    },

    subtitle: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#2E3F32',
      margin: '0 0 8px 0',
      letterSpacing: '-0.5px',
    },

    description: {
      fontSize: '17px',
      color: '#666',
      margin: 0,
      lineHeight: 1.4,
      letterSpacing: '-0.2px',
    },

    inputContainer: {
      margin: '0 8px',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
    },

    field: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    },

    label: {
      fontSize: '15px',
      fontWeight: '600',
      color: '#2E3F32',
      letterSpacing: '-0.2px',
    },

    input: {
      height: '58px',
      background: 'rgba(46, 63, 50, 0.02)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(46, 63, 50, 0.08)',
      borderRadius: '16px',
      padding: '0 16px',
      fontSize: '17px',
      color: '#2E3F32',
      outline: 'none',
    },

    notificationToggle: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px',
      background: 'rgba(46, 63, 50, 0.02)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(46, 63, 50, 0.08)',
      borderRadius: '16px',
      cursor: 'pointer',
    },

    toggleText: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
    },

    toggleTitle: {
      fontSize: '17px',
      fontWeight: '600',
      color: '#2E3F32',
      letterSpacing: '-0.2px',
    },

    toggleDescription: {
      fontSize: '15px',
      color: '#666',
      letterSpacing: '-0.2px',
    },

    toggleIcon: (isEnabled) => ({
      fontSize: '24px',
      color: isEnabled ? '#2E3F32' : '#666',
      transition: 'all 0.2s ease',
    }),

    saveButton: {
      position: 'absolute',
      bottom: 'max(env(safe-area-inset-bottom), 24px)',
      left: '16px',
      right: '16px',
      background: values.name
        ? 'linear-gradient(145deg, #2E3F32, #3A4F3E)'
        : 'rgba(46, 63, 50, 0.1)',
      border: 'none',
      borderRadius: '16px',
      padding: '18px',
      color: values.name ? 'white' : '#666',
      fontSize: '17px',
      fontWeight: '600',
      cursor: values.name ? 'pointer' : 'default',
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      letterSpacing: '-0.2px',
      boxShadow: values.name 
        ? '0 4px 12px rgba(46, 63, 50, 0.2)'
        : 'none',
      opacity: isSaving ? 0.7 : 1,
    },
  };

  const handleSave = async () => {
    if (!values.name || isSaving || isSaved) return;
    await onSave();
  };

  const getButtonText = () => {
    if (isSaved) return 'Saved';
    if (isSaving) return 'Saving...';
    return 'Save Search';
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.subtitle}>Name Your Search</h3>
        <p style={styles.description}>
          Give your search a name and choose your notification preferences
        </p>
      </div>

      <div style={styles.inputContainer}>
        <div style={styles.field}>
          <label style={styles.label}>Search Name</label>
          <input
            style={styles.input}
            placeholder="e.g. City Centre Flat"
            value={values.name || ''}
            onChange={(e) => onChange({ ...values, name: e.target.value })}
          />
        </div>

        <div 
          style={styles.notificationToggle}
          onClick={() => onChange({ ...values, notifications: !values.notifications })}
        >
          <div style={styles.toggleText}>
            <div style={styles.toggleTitle}>Notifications</div>
            <div style={styles.toggleDescription}>
              Get alerts when new properties match your search
            </div>
          </div>
          {values.notifications ? (
            <RiBellFill style={styles.toggleIcon(true)} />
          ) : (
            <RiBellLine style={styles.toggleIcon(false)} />
          )}
        </div>
      </div>

      <button 
        style={{
          ...styles.saveButton,
          background: isSaved 
            ? '#34C759'
            : values.name
              ? 'linear-gradient(145deg, #2E3F32, #3A4F3E)'
              : 'rgba(46, 63, 50, 0.1)',
          cursor: isSaved ? 'default' : values.name ? 'pointer' : 'default',
        }}
        onClick={handleSave}
        disabled={!values.name || isSaving || isSaved}
      >
        {getButtonText()}
      </button>
    </div>
  );
};

export default FinalizeStep; 