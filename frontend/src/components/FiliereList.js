import React, { useState, useEffect } from 'react';
import { fetchFilieres, deleteFiliere } from '../api/api';

const FiliereList = () => {
  const [filieres, setFilieres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFilieres = async () => {
      try {
        const { data } = await fetchFilieres();
        setFilieres(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    loadFilieres();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette filière ?')) {
      try {
        await deleteFiliere(id);
        setFilieres(filieres.filter(filiere => filiere._id !== id));
      } catch (error) {
        console.error(error);
      }
    }
  };

  if (loading) return <div className="loading">Chargement...</div>;

  return (
    <div className="filiere-list">
      <h2>Liste des Filières</h2>
      {filieres.length === 0 ? (
        <p className="no-data">Aucune filière disponible</p>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Secteur</th>
                <th>Niveaux</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filieres.map(filiere => (
                <tr key={filiere._id}>
                  <td>{filiere.name}</td>
                  <td>{filiere.secteur?.name}</td>
                  <td>
                    <div className="niveaux-container">
                      {filiere.niveaux.map((niveau, index) => (
                        <span key={index} className="niveau-tag">{niveau}</span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <button 
                      onClick={() => handleDelete(filiere._id)}
                      className="delete-button"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FiliereList;