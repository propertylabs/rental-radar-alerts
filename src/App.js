import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login.js';
import OAuthCallback from './components/OAuthCallback.js';
import PrivateRoute from './components/PrivateRoute.js';
import Home from './components/Home.js';
import Searches from './components/Searches.js';
import Alerts from './components/Alerts.js';
import Settings from './components/Settings.js';
import Navigation from './components/Navigation.js';
import NotSub from './components/NotSub.js'; // Import the NotSub component
// import MapTest from './components/MapTest.js';


const DashboardLayout = ({ children }) => (
  <div>
    {children}
    <Navigation /> {/* Fixed Navigation Bar */}
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to={localStorage.getItem('token') ? "/dashboard" : "/login"} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/oauth/callback" element={<OAuthCallback />} />
        <Route path="/notsub" element={<NotSub />} /> {/* Add the NotSub route */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<DashboardLayout><Home /></DashboardLayout>} />
          <Route path="/dashboard/searches" element={<DashboardLayout><Searches /></DashboardLayout>} />
          <Route path="/dashboard/alerts" element={<DashboardLayout><Alerts /></DashboardLayout>} />
          <Route path="/dashboard/settings" element={<DashboardLayout><Settings /></DashboardLayout>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;