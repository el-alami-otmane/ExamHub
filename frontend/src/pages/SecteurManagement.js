import React from 'react';
import SecteurForm from '../components/SecteurForm';
import SecteurList from '../components/SecteurList';
import './SecteurManagement.css';

const SecteurManagement = () => {
  return (
    <div className="secteur-management-container">
      <div className="secteur-header">
        <h1>Gestion des Secteurs</h1>
      </div>
      <div className="secteur-content">
        <div className="form-section">
          <SecteurForm />
        </div>
        <div className="list-section">
          <SecteurList />
        </div>
      </div>
    </div>
  );
};

export default SecteurManagement;