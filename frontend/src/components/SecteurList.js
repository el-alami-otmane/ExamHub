import React, { useState, useEffect } from 'react';
import { fetchSecteurs, deleteSecteur } from '../api/api';

const SecteurList = () => {
  const [secteurs, setSecteurs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSecteurs = async () => {
      try {
        const { data } = await fetchSecteurs();
        setSecteurs(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    loadSecteurs();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce secteur ?')) {
      try {
        await deleteSecteur(id);
        setSecteurs(secteurs.filter(secteur => secteur._id !== id));
      } catch (error) {
        console.error(error);
      }
    }
  };

  if (loading) return <div className="loading">Chargement...</div>;

  return (
    <div className="secteur-list">
      <h2>Liste des Secteurs</h2>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {secteurs.map(secteur => (
              <tr key={secteur._id}>
                <td>{secteur.name}</td>
                <td>
                  <button 
                    onClick={() => handleDelete(secteur._id)} 
                    className="delete-btn"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SecteurList;