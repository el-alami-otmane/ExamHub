import React, { useState, useEffect } from 'react';
import { 
  fetchExams, 
  downloadExamFile, 
  fetchSecteurs, 
  fetchFilieresBySecteur,
  fetchNiveauxByFiliere
} from '../../api/api';
import { saveAs } from 'file-saver';
import { Link } from 'react-router-dom';
import './UserDashboard.css';

const UserDashboard = () => {
  const [exams, setExams] = useState([]);
  const [allExams, setAllExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [secteurs, setSecteurs] = useState([]);
  const [filieres, setFilieres] = useState([]);
  const [niveaux, setNiveaux] = useState([]);
  const [filters, setFilters] = useState({
    secteur: '',
    filiere: '',
    niveau: ''
  });

  // Calculate totals
  const totalDownloads = allExams.reduce((sum, exam) => sum + (exam.downloads || 0), 0);
  const totalExams = allExams.length;
  const filteredExamsCount = exams.length;

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        const [secteursRes, examsRes] = await Promise.all([
          fetchSecteurs(),
          fetchExams()
        ]);
        
        setSecteurs(secteursRes.data);
        setExams(examsRes.data);
        setAllExams(examsRes.data);
        setLoading(false);
      } catch (error) {
        console.error('Error loading initial data:', error);
        setLoading(false);
      }
    };
    loadInitialData();
  }, []);

  useEffect(() => {
    const loadFilieres = async () => {
      if (filters.secteur) {
        try {
          const res = await fetchFilieresBySecteur(filters.secteur);
          setFilieres(res.data);
          setFilters(prev => ({ ...prev, filiere: '', niveau: '' }));
        } catch (error) {
          console.error('Error loading filieres:', error);
        }
      } else {
        setFilieres([]);
        setNiveaux([]);
        setFilters(prev => ({ ...prev, filiere: '', niveau: '' }));
      }
    };
    loadFilieres();
  }, [filters.secteur]);

  useEffect(() => {
    const loadNiveaux = async () => {
      if (filters.filiere) {
        try {
          const res = await fetchNiveauxByFiliere(filters.filiere);
          setNiveaux(res.data);
          setFilters(prev => ({ ...prev, niveau: '' }));
        } catch (error) {
          console.error('Error loading niveaux:', error);
        }
      } else {
        setNiveaux([]);
        setFilters(prev => ({ ...prev, niveau: '' }));
      }
    };
    loadNiveaux();
  }, [filters.filiere]);

  useEffect(() => {
    const filterExams = () => {
      setLoading(true);
      let filtered = [...allExams];

      if (filters.secteur) {
        filtered = filtered.filter(exam => exam.secteur?._id === filters.secteur);
      }

      if (filters.filiere) {
        filtered = filtered.filter(exam => exam.filiere?._id === filters.filiere);
      }

      if (filters.niveau) {
        filtered = filtered.filter(exam => exam.niveau === filters.niveau);
      }

      setExams(filtered);
      setLoading(false);
    };

    filterExams();
  }, [filters.secteur, filters.filiere, filters.niveau, allExams]);

  const handleDownload = async (examId, filename) => {
    try {
      const response = await downloadExamFile(examId);
      saveAs(response.data, filename);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFilters({
      secteur: '',
      filiere: '',
      niveau: ''
    });
  };

  if (loading) return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Loading exams...</p>
    </div>
  );

  return (
    <div className="user-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>User Dashboard</h1>
          <p className="welcome-message">Welcome to your dashboard!</p>
          
          <div className="stats-container">
            <div className="stat-card">
              <span className="stat-number">{totalExams}</span>
              <span className="stat-label">Total Exams</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{filteredExamsCount}</span>
              <span className="stat-label">Filtered Exams</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{totalDownloads}</span>
              <span className="stat-label">Total Downloads</span>
            </div>
          </div>
          
          
        </div>
      </div>

      <div className="filter-section">
        <div className="filter-header">
          <h3>Filter Exams</h3>
          <button 
            onClick={resetFilters}
            className="reset-button"
            disabled={!filters.secteur && !filters.filiere && !filters.niveau}
          >
            Reset Filters
          </button>
        </div>
        
        <div className="filter-grid">
          <div className="filter-group">
            <label>Secteur</label>
            <select
              name="secteur"
              value={filters.secteur}
              onChange={handleFilterChange}
            >
              <option value="">All Secteurs</option>
              {secteurs.map(s => (
                <option key={s._id} value={s._id}>{s.name}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label>Filiere</label>
            <select
              name="filiere"
              value={filters.filiere}
              onChange={handleFilterChange}
              disabled={!filters.secteur}
            >
              <option value="">All Filieres</option>
              {filieres.map(f => (
                <option key={f._id} value={f._id}>{f.name}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label>Niveau</label>
            <select
              name="niveau"
              value={filters.niveau}
              onChange={handleFilterChange}
              disabled={!filters.filiere}
            >
              <option value="">All Niveaux</option>
              {niveaux.map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      <div className="exams-section">
        <h2>
          {filters.secteur || filters.filiere || filters.niveau 
            ? `Filtered Exams (${filteredExamsCount})` 
            : `All Available Exams (${totalExams})`}
        </h2>
        
        {exams.length === 0 ? (
          <div className="no-exams">
            <p>No exams match your current filters.</p>
            <button onClick={resetFilters} className="reset-button">
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="exams-grid">
            {exams.map((exam) => (
              <div key={exam._id} className="exam-card">
                <div className="exam-header">
                  <h3>
                    <Link 
  to={`/user/exams/${exam._id}`} 
  title="View"
>
  {exam.title}
</Link>

                  </h3>
                  <div className="exam-meta">
                    <span className="exam-type">
                      {exam.type}
                    </span>
                    <span className="download-count">
                      ↓ {exam.downloads || 0}
                    </span>
                  </div>
                </div>
                
                <div className="exam-details">
                  <div className="detail-item">
                    <span className="detail-label">Level:</span>
                    <span className="detail-value">{exam.niveau}</span>
                  </div>
                  {exam.secteur?.name && (
                    <div className="detail-item">
                      <span className="detail-label">Secteur:</span>
                      <span className="detail-value">{exam.secteur.name}</span>
                    </div>
                  )}
                  {exam.filiere?.name && (
                    <div className="detail-item">
                      <span className="detail-label">Filiere:</span>
                      <span className="detail-value">{exam.filiere.name}</span>
                    </div>
                  )}
                </div>
                
                <div className="exam-actions">
                  <button
                    onClick={() => handleDownload(exam._id, `${exam.title.replace(/\s+/g, '_')}.pdf`)}
                    className="download-button"
                  >
                    Download
                  </button>
               <Link
  to={`/user/exams/${exam._id}`}
  className="details-button"
>
  Details
</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;