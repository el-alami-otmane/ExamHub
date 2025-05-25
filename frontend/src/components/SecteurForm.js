import React, { useState } from 'react';
import { createSecteur } from '../api/api';

const SecteurForm = () => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createSecteur({ name });
      setMessage('Secteur créé avec succès !');
      setName('');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.error || 'Erreur lors de la création');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="secteur-form">
      <h2>Ajouter un Nouveau Secteur</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nom:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="form-input"
          />
        </div>
        <button type="submit" className="submit-btn">
          Ajouter Secteur
        </button>
      </form>
      {message && (
        <div className={`message ${message.includes('succès') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default SecteurForm;