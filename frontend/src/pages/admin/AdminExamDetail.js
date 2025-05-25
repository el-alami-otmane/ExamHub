// src/pages/admin/AdminExamDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import authService from '../../services/auth';
import { saveAs } from 'file-saver';
import './AdminExamDetail.css'; // Create this CSS file


const AdminExamDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get user data from authService
  const currentUser = authService.getCurrentUser();
  // Extract role - matches how PrivateRoute does it
  const userRole = currentUser?.user?.role || currentUser?.role;

  useEffect(() => {
    const fetchExamData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/exams/${id}`,
          {
            headers: authService.getAuthHeader()
          }
        );
        setExam(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchExamData();
  }, [id]);

  const handleDownload = async (fileType) => {
    try {
      const endpoint = fileType === 'exam' 
        ? `download-exam` 
        : `download-solution`;
      
      const response = await axios.get(
        `http://localhost:5000/api/exams/${id}/${endpoint}`,
        {
          headers: authService.getAuthHeader(),
          responseType: 'blob'
        }
      );

      const filename = fileType === 'exam'
        ? `${exam.title}_exam.pdf`
        : `${exam.title}_solution.pdf`;

      saveAs(response.data, filename);
    } catch (err) {
      setError('Download failed');
      console.error(err);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:5000/api/exams/${id}`,
        {
          headers: authService.getAuthHeader()
        }
      );
      navigate(userRole === 'admin' ? '/admin/exams' : '/user');
    } catch (err) {
      setError('Delete failed');
      console.error(err);
    }
  };

  if (loading) return <div>Loading exam details...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!exam) return <div>Exam not found</div>;

 return (
    <div className="exam-detail-container">
      <div className="exam-detail-header">
        <div className="header-content">
          <h1 className="page-title">
            Exam Details 
            {userRole === 'admin' && <span className="admin-badge">Admin View</span>}
          </h1>
          <div className="header-actions">
            <Link 
              to={userRole === 'admin' ? '/admin/exams' : '/user'} 
              className="back-button"
            >
              <i className="fas fa-arrow-left"></i> Back to {userRole === 'admin' ? 'Exams' : 'Dashboard'}
            </Link>
            
          </div>
        </div>
      </div>

      <div className="exam-detail-card">
        <div className="exam-main-info">
          <h2 className="exam-title">{exam.title}</h2>
          <div className="exam-meta-grid">
            <div className="meta-item">
              <span className="meta-label">Type:</span>
              <span className="meta-value">{exam.type}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Level:</span>
              <span className="meta-value">{exam.niveau}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Downloads:</span>
              <span className="meta-value">{exam.downloads || 0}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Created:</span>
              <span className="meta-value">
                {new Date(exam.createdAt).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="exam-actions-container">
          <div className="download-actions">
            <button 
              onClick={() => handleDownload('exam')}
              className="download-button primary"
            >
              <i className="fas fa-file-download"></i> Download Exam
            </button>
            {exam.solutionFile && (
              <button 
                onClick={() => handleDownload('solution')}
                className="download-button secondary"
              >
                <i className="fas fa-file-download"></i> Download Solution
              </button>
            )}
          </div>

          {userRole === 'admin' && (
            <div className="admin-management-actions">
              <Link 
                to={`/admin/exams/edit/${exam._id}`} 
                className="action-button edit"
              >
                <i className="fas fa-pencil-alt"></i> Edit Exam
              </Link>
              <button 
                onClick={handleDelete}
                className="action-button delete"
              >
                <i className="fas fa-trash-alt"></i> Delete Exam
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminExamDetail;