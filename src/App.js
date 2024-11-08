import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login.js';
import OAuthCallback from './components/OAuthCallback.js';
import PrivateRoute from './components/PrivateRoute.js';
import Home from './components/Home.js';
import Searches from './components/Searches.js';
import Alerts from './components/Alerts.js';
import Settings from './components/Settings.js';
import Header from './components/Header.js';
import Navigation from './components/Navigation.js';
import NotSub from './components/NotSub.js';

const DashboardLayout = ({ children, pageTitle }) => (
  <div>
    <Navigation /> {/* Move this here for testing */}
    <Header pageTitle={pageTitle} />
    <div className="content">
      {children}
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to={localStorage.getItem('token') ? "/dashboard" : "/login"} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/oauth/callback" element={<OAuthCallback />} />
        <Route path="/notsub" element={<NotSub />} />
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<DashboardLayout pageTitle="Dashboard"><Home /></DashboardLayout>} />
          <Route path="/dashboard/searches" element={<DashboardLayout pageTitle="Searches"><Searches /></DashboardLayout>} />
          <Route path="/dashboard/alerts" element={<DashboardLayout pageTitle="Alerts"><Alerts /></DashboardLayout>} />
          <Route path="/dashboard/settings" element={<DashboardLayout pageTitle="Settings"><Settings /></DashboardLayout>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;