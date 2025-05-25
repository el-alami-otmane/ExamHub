import React from 'react';
import FiliereForm from '../components/FiliereForm';
import FiliereList from '../components/FiliereList';
import './FiliereManagement.css';

const FiliereManagement = () => {
  return (
    <div className="filiere-management-container">
      <div className="management-header">
        <h1>Gestion des Filières</h1>
      </div>
      <div className="management-content">
        <div className="form-section">
          <FiliereForm />
        </div>
        <div className="list-section">
          <FiliereList />
        </div>
      </div>
    </div>
  );
};

export default FiliereManagement;