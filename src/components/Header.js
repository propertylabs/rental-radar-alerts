import React from 'react';
import './Header.css';

const Header = ({ pageTitle }) => {
  return (
    <header className="fixed-header">
      <div className="header-container">
        <h1 className="header-title">{pageTitle}</h1>
      </div>
    </header>
  );
};

export default Header;