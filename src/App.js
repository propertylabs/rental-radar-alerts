import React, { useState } from 'react';
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
import SearchModal from './components/SearchModal';

const DashboardLayout = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  
  return (
    <div>
      <Navigation />
      <div className="content">
        {React.cloneElement(children, { 
          setModalState: setIsModalOpen,
          setModalContent: setModalContent,
          onOpenSearchModal: () => setIsSearchModalOpen(true)
        })}
      </div>
      {isModalOpen && <ModalBackdrop>{modalContent}</ModalBackdrop>}
      <SearchModal 
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
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