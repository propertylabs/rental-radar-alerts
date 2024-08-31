import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CriteriaForm from './components/CriteriaForm';
import CriteriaList from './components/CriteriaList';
import Login from './components/Login';
import OAuthCallback from './components/OAuthCallback';
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './components/Dashboard';

function App() {
  const [criteria, setCriteria] = useState([]);

  const addCriteria = (newCriteria) => {
    setCriteria([...criteria, newCriteria]);
  };

  const toggleEnable = (index) => {
    const updatedCriteria = criteria.map((crit, i) =>
      i === index ? { ...crit, enabled: !crit.enabled } : crit
    );
    setCriteria(updatedCriteria);
  };

  const deleteCriteria = (index) => {
    const updatedCriteria = criteria.filter((_, i) => i !== index);
    setCriteria(updatedCriteria);
  };

  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router>
       <Routes>
          <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/oauth/callback" element={<OAuthCallback />} />
            <PrivateRoute path="/dashboard" component={Dashboard} />
            <Route path="/setup" element={
              <div className="App">
                <h1>Property Alerts Setup</h1>
                <CriteriaForm onAddCriteria={addCriteria} />
                <CriteriaList 
                  criteria={criteria}
                  onToggleEnable={toggleEnable}
                  onDelete={deleteCriteria}
                />
              </div>
            } />
          </Routes>
        </Router> 
  );
}

export default App;





