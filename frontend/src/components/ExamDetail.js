import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { saveAs } from 'file-saver';
import authService from '../services/auth';
import { FiDownload, FiArrowLeft, FiCalendar, FiBook, FiAward, FiBookmark } from 'react-icons/fi';
import './ExamDetail.css';

const ExamDetail = () => {
  const { id } = useParams();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState({
    exam: false,
    solution: false
  });

  useEffect(() => {
    const fetchExam = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:5000/api/exams/${id}`,
          {
            headers: authService.getAuthHeader()
          }
        );
        setExam(response.data);
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to load exam details');
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchExam();
  }, [id]);

  const handleDownload = async (type) => {
    try {
      setDownloading(prev => ({ ...prev, [type]: true }));
      
      const endpoint = type === 'exam' 
        ? `http://localhost:5000/api/exams/${id}/download` 
        : `http://localhost:5000/api/exams/${id}/download-solution`;

      const response = await axios.get(endpoint, {
        headers: authService.getAuthHeader(),
        responseType: 'blob'
      });
      
      const filename = type === 'exam'
        ? `${exam.title.replace(/\s+/g, '_')}.pdf`
        : `${exam.title.replace(/\s+/g, '_')}_SOLUTION.pdf`;

      saveAs(response.data, filename);
      
      // Update downloads count in UI immediately
      if (type === 'exam') {
        setExam(prev => ({
          ...prev,
          downloads: (prev.downloads || 0) + 1
        }));
      }
    } catch (error) {
      console.error('Download error:', error);
      setError(`Failed to download ${type} file`);
    } finally {
      setDownloading(prev => ({ ...prev, [type]: false }));
    }
  };

  if (loading) return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Loading exam details...</p>
    </div>
  );

  if (error) return (
    <div className="error-container">
      <div className="error-message">
        <p>{error}</p>
        <Link to="/exams" className="back-link">
          <FiArrowLeft /> Back to Exams
        </Link>
      </div>
    </div>
  );

  return (
    <div className="exam-detail-container">
      <div className="exam-detail-header">
        <Link to="/exams" className="back-button">
          <FiArrowLeft /> Back to Exams
        </Link>
        <h1>Exam Details</h1>
      </div>

      {exam && (
        <div className="exam-detail-content">
          <div className="exam-card">
            <div className="exam-card-header">
              <span className={`exam-type ${exam.type.toLowerCase().replace(/\s+/g, '-')}`}>
                {exam.type}
              </span>
              <h2>{exam.title}</h2>
              <div className="download-count">
                <FiDownload /> {exam.downloads || 0} downloads
              </div>
            </div>

            <div className="exam-card-body">
              <div className="exam-info">
                <div className="info-item">
                  <FiAward className="info-icon" />
                  <div>
                    <span className="info-label">Level</span>
                    <span className="info-value">{exam.niveau}</span>
                  </div>
                </div>

                {exam.secteur?.name && (
                  <div className="info-item">
                    <FiBookmark className="info-icon" />
                    <div>
                      <span className="info-label">Secteur</span>
                      <span className="info-value">{exam.secteur.name}</span>
                    </div>
                  </div>
                )}

                {exam.filiere?.name && (
                  <div className="info-item">
                    <FiBook className="info-icon" />
                    <div>
                      <span className="info-label">Filiere</span>
                      <span className="info-value">{exam.filiere.name}</span>
                    </div>
                  </div>
                )}

                <div className="info-item">
                  <FiCalendar className="info-icon" />
                  <div>
                    <span className="info-label">Uploaded</span>
                    <span className="info-value">
                      {new Date(exam.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="download-section">
                <h3>Download Files</h3>
                <div className="download-buttons">
                  <button
                    onClick={() => handleDownload('exam')}
                    className="download-button exam-file"
                    disabled={downloading.exam}
                  >
                    {downloading.exam ? (
                      <span className="download-spinner"></span>
                    ) : (
                      <FiDownload />
                    )}
                    {downloading.exam ? 'Downloading...' : 'Download Exam'}
                  </button>

                  {exam.solutionFileUrl && (
                    <button
                      onClick={() => handleDownload('solution')}
                      className="download-button solution-file"
                      disabled={downloading.solution}
                    >
                      {downloading.solution ? (
                        <span className="download-spinner"></span>
                      ) : (
                        <FiDownload />
                      )}
                      {downloading.solution ? 'Downloading...' : 'Download Solution'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamDetail;