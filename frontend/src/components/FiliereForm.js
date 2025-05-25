import React, { useState, useEffect } from 'react';
import { createFiliere, fetchSecteurs } from '../api/api';

const FiliereForm = () => {
  const [name, setName] = useState('');
  const [secteurId, setSecteurId] = useState('');
  const [niveaux, setNiveaux] = useState([]);
  const [secteurs, setSecteurs] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadSecteurs = async () => {
      try {
        const { data } = await fetchSecteurs();
        setSecteurs(data);
      } catch (error) {
        console.error(error);
      }
    };
    loadSecteurs();
  }, []);

  const handleNiveauChange = (niveau) => {
    if (niveaux.includes(niveau)) {
      setNiveaux(niveaux.filter(n => n !== niveau));
    } else {
      setNiveaux([...niveaux, niveau]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createFiliere({ name, secteurId, niveaux });
      setMessage('Filière créée avec succès !');
      setName('');
      setSecteurId('');
      setNiveaux([]);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.error || 'Erreur lors de la création de la filière');
    }
  };

  return (
    <div className="filiere-form">
      <h2>Ajouter une nouvelle filière</h2>
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
        <div className="form-group">
          <label>Secteur:</label>
          <select 
            value={secteurId} 
            onChange={(e) => setSecteurId(e.target.value)}
            required
            className="form-select"
          >
            <option value="">Sélectionner un secteur</option>
            {secteurs.map(secteur => (
              <option key={secteur._id} value={secteur._id}>
                {secteur.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Niveaux:</label>
          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={niveaux.includes('Qualification')}
                onChange={() => handleNiveauChange('Qualification')}
                className="checkbox-input"
              />
              <span className="checkbox-custom"></span>
              Qualification
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={niveaux.includes('Technicien')}
                onChange={() => handleNiveauChange('Technicien')}
                className="checkbox-input"
              />
              <span className="checkbox-custom"></span>
              Technicien
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={niveaux.includes('Technicien Spécialisé')}
                onChange={() => handleNiveauChange('Technicien Spécialisé')}
                className="checkbox-input"
              />
              <span className="checkbox-custom"></span>
              Technicien Spécialisé
            </label>
          </div>
        </div>
        <button type="submit" className="submit-button">Ajouter la filière</button>
      </form>
      {message && <div className={`message ${message.includes('succès') ? 'success' : 'error'}`}>{message}</div>}
    </div>
  );
};

export default FiliereForm;