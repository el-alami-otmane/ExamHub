// src/components/ExamFilters.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import authService from '../services/auth';

const ExamFilters = ({ onFilterChange, initialFilters = {} }) => {
  const [secteurs, setSecteurs] = useState([]);
  const [filieres, setFilieres] = useState([]);
  const [niveaux, setNiveaux] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    secteur: initialFilters.secteur || '',
    filiere: initialFilters.filiere || '',
    niveau: initialFilters.niveau || ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [secteursRes, filieresRes] = await Promise.all([
          axios.get('http://localhost:5000/api/secteurs', {
            headers: authService.getAuthHeader()
          }),
          axios.get('http://localhost:5000/api/filieres', {
            headers: authService.getAuthHeader()
          })
        ]);
        
        setSecteurs(secteursRes.data);
        setFilieres(filieresRes.data);
        
        // Extract unique niveaux from filieres
        const uniqueNiveaux = [...new Set(filieresRes.data.map(f => f.niveau))];
        setNiveaux(uniqueNiveaux);
        
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFilters = {
      ...filters,
      [name]: value
    };
    
    // Reset dependent filters
    if (name === 'secteur') {
      newFilters.filiere = '';
      newFilters.niveau = '';
    } else if (name === 'filiere') {
      newFilters.niveau = '';
    }
    
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const getFilteredFilieres = () => {
    if (!filters.secteur) return filieres;
    return filieres.filter(f => f.secteur === filters.secteur);
  };

  const getFilteredNiveaux = () => {
    const filteredFilieres = getFilteredFilieres();
    return [...new Set(filteredFilieres.map(f => f.niveau))];
  };

  if (loading) return <div>Loading filters...</div>;

  return (
    <div className="exam-filters bg-white p-4 rounded-lg shadow mb-6">
      <h3 className="text-lg font-medium mb-4">Filter Exams</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Secteur</label>
          <select
            name="secteur"
            value={filters.secteur}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">All Secteurs</option>
            {secteurs.map(s => (
              <option key={s._id} value={s._id}>{s.name}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Filiere</label>
          <select
            name="filiere"
            value={filters.filiere}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            disabled={!filters.secteur}
          >
            <option value="">All Filieres</option>
            {getFilteredFilieres().map(f => (
              <option key={f._id} value={f._id}>{f.name}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Niveau</label>
          <select
            name="niveau"
            value={filters.niveau}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            disabled={!filters.secteur}
          >
            <option value="">All Niveaux</option>
            {getFilteredNiveaux().map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default ExamFilters;