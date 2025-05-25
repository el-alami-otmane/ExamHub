import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import authService from '../../services/auth';
import { 
  FiEdit2, 
  FiTrash2, 
  FiEye, 
  FiDownload, 
  FiUser
} from 'react-icons/fi';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [exams, setExams] = useState([]);
  const [secteurs, setSecteurs] = useState([]);
  const [filieres, setFilieres] = useState([]);
  const [niveaux, setNiveaux] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    secteur: '',
    filiere: '',
    niveau: ''
  });
  const [user, setUser] = useState(null);

  // Format date function
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
        
        const [examsRes, secteursRes] = await Promise.all([
          axios.get('http://localhost:5000/api/exams', {
            headers: authService.getAuthHeader()
          }),
          axios.get('http://localhost:5000/api/secteurs', {
            headers: authService.getAuthHeader()
          })
        ]);
        
        setExams(examsRes.data);
        setSecteurs(secteursRes.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchFilieres = async () => {
      if (filters.secteur) {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/filieres/secteur/${filters.secteur}`,
            { headers: authService.getAuthHeader() }
          );
          setFilieres(response.data);
          setFilters(prev => ({ ...prev, filiere: '', niveau: '' }));
        } catch (error) {
          console.error('Error fetching filieres:', error);
        }
      } else {
        setFilieres([]);
        setFilters(prev => ({ ...prev, filiere: '', niveau: '' }));
      }
    };
    fetchFilieres();
  }, [filters.secteur]);

  useEffect(() => {
    const fetchNiveaux = async () => {
      if (filters.filiere) {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/filieres/${filters.filiere}/niveaux`,
            { headers: authService.getAuthHeader() }
          );
          setNiveaux(response.data);
          setFilters(prev => ({ ...prev, niveau: '' }));
        } catch (error) {
          console.error('Error fetching niveaux:', error);
        }
      } else {
        setNiveaux([]);
        setFilters(prev => ({ ...prev, niveau: '' }));
      }
    };
    fetchNiveaux();
  }, [filters.filiere]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const filteredExams = exams.filter(exam => {
    if (filters.secteur && exam.secteur._id !== filters.secteur) return false;
    if (filters.filiere && exam.filiere._id !== filters.filiere) return false;
    if (filters.niveau && exam.niveau !== filters.niveau) return false;
    return true;
  });
  

  const handleDelete = async (examId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet examen?')) {
      try {
        await axios.delete(`http://localhost:5000/api/exams/${examId}`, {
          headers: authService.getAuthHeader()
        });
        setExams(exams.filter(exam => exam._id !== examId));
      } catch (error) {
        console.error('Error deleting exam:', error);
        alert('Erreur lors de la suppression de l\'examen');
      }
    }
  };

  return (
    <div className="dashboard-container">
      <div className="top-nav">
        <div className="user-info">
          <span>Bonjour, {user?.firstName || 'Admin'}</span>
          <div className="user-avatar">
            <FiUser />
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="stats-summary">
          <div className="stat-card">
            <h3>Total Examens</h3>
            <p>{exams.length}</p>
          </div>
          <div className="stat-card">
            <h3>Téléchargements</h3>
            <p>{exams.reduce((sum, exam) => sum + (exam.downloads || 0), 0)}</p>
          </div>
          <div className="stat-card">
            <h3>Utilisateurs</h3>
            <p>24</p>
          </div>
        </div>

        <div className="filter-section">
          <h3>Filtrer les Examens</h3>
          <div className="filter-grid">
            <div className="filter-group">
              <label>Secteur</label>
              <select
                name="secteur"
                value={filters.secteur}
                onChange={handleFilterChange}
              >
                <option value="">Tous les secteurs</option>
                {secteurs.map(s => (
                  <option key={s._id} value={s._id}>{s.name}</option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <label>Filière</label>
              <select
                name="filiere"
                value={filters.filiere}
                onChange={handleFilterChange}
                disabled={!filters.secteur}
              >
                <option value="">Toutes les filières</option>
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
                <option value="">Tous les niveaux</option>
                {niveaux.map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

         <div className="exams-grid">
          {loading ? (
            <div className="loading">Chargement des examens...</div>
          ) : filteredExams.length === 0 ? (
            <div className="empty">Aucun examen trouvé</div>
          ) : (
            filteredExams.map(exam => (
              <div key={exam._id} className="exam-card">
                {/* Exam type circle in top-right corner */}
                 <div className="exam-type-circle">
      {exam.type}  {/* Changed from just first letter to full type */}
    </div>

                <div className="card-header">
                  <h3>{exam.title}</h3>
                  <div className="exam-meta">
                    <span className="exam-date">
                      {formatDate(exam.createdAt)}
                    </span>
                  </div>
                </div>

                <div className="card-body">
                  <p><strong>Secteur:</strong> {exam.secteur?.name}</p>
                  <p><strong>Filière:</strong> {exam.filiere?.name}</p>
                  <p><strong>Niveau:</strong> {exam.niveau}</p>
                  <div className="download-count">
                    <FiDownload /> {exam.downloads || 0} téléchargements
                  </div>
                </div>

                <div className="card-actions">
                  <Link 
                    to={`/admin/exams/edit/${exam._id}`} 
                    className="action-btn edit"
                    title="Modifier"
                  >
                    <FiEdit2 />
                  </Link>
                  <Link 
                    to={`/admin/exams/${exam._id}`} 
                    className="action-btn view"
                    title="Voir"
                  >
                    <FiEye />
                  </Link>
                  <button 
                    onClick={() => handleDelete(exam._id)} 
                    className="action-btn delete"
                    title="Supprimer"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;