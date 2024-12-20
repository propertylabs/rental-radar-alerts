import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login.js';
import OAuthCallback from './components/OAuthCallback.js';
import PrivateRoute from './components/PrivateRoute.js';
import Searches from './components/Searches.js';
import Alerts from './components/Alerts.js';
import Settings from './components/Settings.js';
import Navigation from './components/Navigation.js';
import NotSub from './components/NotSub.js';
import ModalBackdrop from './components/ModalBackdrop.js';
import SearchModal from './components/SearchModal.js';
import EditSearchModal from './components/EditSearchModal.js';

const DashboardLayout = ({ children }) => {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [searchToEdit, setSearchToEdit] = useState(null);
  
  useEffect(() => {
    if (isSearchModalOpen || isEditModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setSearchToEdit(null);
    }
  }, [isSearchModalOpen, isEditModalOpen]);

  return (
    <div>
      <Navigation />
      <div className="content">
        {React.cloneElement(children, { 
          onOpenSearchModal: () => setIsSearchModalOpen(true),
          onOpenEditModal: (searchData) => {
            setSearchToEdit(searchData);
            setIsEditModalOpen(true);
          }
        })}
      </div>
      <SearchModal 
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
      />
      <EditSearchModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        searchData={searchToEdit}
      />
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to={localStorage.getItem('token') ? "/searches" : "/login"} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/oauth/callback" element={<OAuthCallback />} />
        <Route path="/notsub" element={<NotSub />} />
        <Route element={<PrivateRoute />}>
          <Route path="/searches" element={<DashboardLayout><Searches /></DashboardLayout>} />
          <Route path="/alerts" element={<DashboardLayout><Alerts /></DashboardLayout>} />
          <Route path="/settings" element={<DashboardLayout><Settings /></DashboardLayout>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;