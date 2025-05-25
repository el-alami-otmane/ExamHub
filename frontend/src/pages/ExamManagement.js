import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import authService from '../services/auth';
import './ExamManagement.css';

const ExamManagement = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [currentDeletingId, setCurrentDeletingId] = useState(null);
  const navigate = useNavigate();

  const fetchExams = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        'http://localhost:5000/api/exams',
        {
          headers: authService.getAuthHeader()
        }
      );
      setExams(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch exams');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const handleDelete = async (examId) => {
    if (!window.confirm('Are you sure you want to delete this exam?')) return;
    
    try {
      setCurrentDeletingId(examId);
      setDeleteLoading(true);
      await axios.delete(
        `http://localhost:5000/api/exams/${examId}`,
        {
          headers: authService.getAuthHeader()
        }
      );
      await fetchExams();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to delete exam');
    } finally {
      setDeleteLoading(false);
      setCurrentDeletingId(null);
    }
  };

  if (loading) return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Loading exams...</p>
    </div>
  );

  if (error) return (
    <div className="error-container">
      <div className="error-alert">
        <p>Error: {error}</p>
        <button onClick={fetchExams}>Retry</button>
      </div>
    </div>
  );

  return (
    <div className="exam-management-container">
      <div className="header-section">
        <h1 className="page-title">Exam Management</h1>
        <Link to="/admin/exams/create" className="create-button">
  + Create New Exam
</Link>
      </div>

      <div className="table-container">
        <table className="exams-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Type</th>
              <th>Secteur</th>
              <th>Filiere</th>
              <th>Level</th>
              <th>Downloads</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {exams.length > 0 ? (
              exams.map(exam => (
                <tr key={exam._id}>
                  <td>{exam.title}</td>
                  <td><span className={`type-badge ${exam.type.toLowerCase()}`}>{exam.type}</span></td>
                  <td>{exam.secteur?.name || '-'}</td>
                  <td>{exam.filiere?.name || '-'}</td>
                  <td><span className="level-badge">{exam.niveau}</span></td>
                  <td className="downloads-cell">
                    <span className="downloads-count">{exam.downloads || 0}</span>
                    <span className="downloads-icon">↓</span>
                  </td>
                  <td className="actions-cell">
                    <div className="actions-wrapper">
                       <Link 
                    to={`/admin/exams/${exam._id}`} 
                    className="action-link view"
                    title="Voir"
                  >
View                  </Link>
                      <Link to={`/admin/exams/edit/${exam._id}`} className="action-link edit">
                        Edit
                      </Link>
                      <button 
                        onClick={() => handleDelete(exam._id)}
                        disabled={deleteLoading && currentDeletingId === exam._id}
                        className={`action-button delete ${deleteLoading && currentDeletingId === exam._id ? 'deleting' : ''}`}
                      >
                        {deleteLoading && currentDeletingId === exam._id ? (
                          <span className="deleting-spinner"></span>
                        ) : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="no-data-row">
                <td colSpan="7">
                  <div className="no-exams-message">
                    No exams found. <Link to="/admin/exams/create">Create one now</Link>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExamManagement;