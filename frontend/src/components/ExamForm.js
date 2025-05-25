import React, { useState, useEffect } from 'react';
import axios from 'axios';
import authService from '../services/auth';
import './ExamForm.css';

const ExamForm = ({ initialData = null, isEditMode = false, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    secteurId: '',
    filiereId: '',
    niveau: '',
    examFile: null,
    solutionFile: null
  });
  const [secteurs, setSecteurs] = useState([]);
  const [filieres, setFilieres] = useState([]);
  const [niveaux, setNiveaux] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fileNames, setFileNames] = useState({
    examFile: null,
    solutionFile: null
  });

  // Initialize form with initialData
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        type: initialData.type || '',
        secteurId: initialData.secteur?._id || '',
        filiereId: initialData.filiere?._id || '',
        niveau: initialData.niveau || '',
        examFile: null,
        solutionFile: null
      });
      setFileNames({
        examFile: initialData.examFileUrl ? 'Current file' : null,
        solutionFile: initialData.solutionFileUrl ? 'Current file' : null
      });
    }
  }, [initialData]);

  // Load secteurs
  useEffect(() => {
    const fetchSecteurs = async () => {
      try {
        const response = await axios.get(
          'http://localhost:5000/api/secteurs',
          { headers: authService.getAuthHeader() }
        );
        setSecteurs(response.data);
      } catch (err) {
        setError('Failed to load secteurs');
      }
    };
    fetchSecteurs();
  }, []);

  // Load filieres when secteur changes
  useEffect(() => {
    const fetchFilieres = async () => {
      if (formData.secteurId) {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/filieres/secteur/${formData.secteurId}`,
            { headers: authService.getAuthHeader() }
          );
          setFilieres(response.data);
        } catch (err) {
          setError('Failed to load filieres');
        }
      } else {
        setFilieres([]);
      }
    };
    fetchFilieres();
  }, [formData.secteurId]);

  // Load niveaux when filiere changes
  useEffect(() => {
    const fetchNiveaux = async () => {
      if (formData.filiereId) {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/filieres/${formData.filiereId}/niveaux`,
            { headers: authService.getAuthHeader() }
          );
          setNiveaux(response.data);
        } catch (err) {
          setError('Failed to load niveaux');
        }
      } else {
        setNiveaux([]);
      }
    };
    fetchNiveaux();
  }, [formData.filiereId]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      [e.target.name]: file
    });
    setFileNames({
      ...fileNames,
      [e.target.name]: file ? file.name : null
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const data = new FormData();
    data.append('title', formData.title);
    data.append('type', formData.type);
    data.append('secteurId', formData.secteurId);
    data.append('filiereId', formData.filiereId);
    data.append('niveau', formData.niveau);
    if (formData.examFile) data.append('examFile', formData.examFile);
    if (formData.solutionFile) data.append('solutionFile', formData.solutionFile);

    onSubmit(data)
      .catch(err => {
        setError(err.response?.data?.message || err.message || 'Submission failed');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="exam-form-container">
      <h2 className="form-title">{isEditMode ? 'Edit Exam' : 'Create New Exam'}</h2>
      
      <form onSubmit={handleSubmit} className="exam-form">
        {/* Title */}
        <div className="form-group">
          <label className="form-label">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="form-input"
            required
            placeholder="Enter exam title"
          />
        </div>

        {/* Type */}
        <div className="form-group">
          <label className="form-label">Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="form-select"
            required
          >
            <option value="">Select Exam Type</option>
            <option value="Final Exam">Final Exam</option>
            <option value="Midterm Exam">Midterm Exam</option>
            <option value="Quiz">Quiz</option>
            <option value="Assignment">Assignment</option>
          </select>
        </div>

        {/* Secteur */}
        <div className="form-group">
          <label className="form-label">Secteur</label>
          <select
            name="secteurId"
            value={formData.secteurId}
            onChange={handleChange}
            className="form-select"
            required
          >
            <option value="">Select Secteur</option>
            {secteurs.map(s => (
              <option key={s._id} value={s._id}>{s.name}</option>
            ))}
          </select>
        </div>

        {/* Filiere */}
        <div className="form-group">
          <label className="form-label">Filiere</label>
          <select
            name="filiereId"
            value={formData.filiereId}
            onChange={handleChange}
            className="form-select"
            required
            disabled={!formData.secteurId}
          >
            <option value="">{formData.secteurId ? 'Select Filiere' : 'First select a secteur'}</option>
            {filieres.map(f => (
              <option key={f._id} value={f._id}>{f.name}</option>
            ))}
          </select>
        </div>

        {/* Niveau */}
        <div className="form-group">
          <label className="form-label">Niveau</label>
          <select
            name="niveau"
            value={formData.niveau}
            onChange={handleChange}
            className="form-select"
            required
            disabled={!formData.filiereId}
          >
            <option value="">{formData.filiereId ? 'Select Niveau' : 'First select a filiere'}</option>
            {niveaux.map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>

        {/* Exam File */}
        <div className="form-group">
          <label className="form-label">Exam File {!isEditMode && <span className="required">*</span>}</label>
          <div className="file-input-container">
            <label className="file-input-label">
              <input
                type="file"
                name="examFile"
                accept=".pdf"
                onChange={handleFileChange}
                className="file-input"
                required={!isEditMode}
              />
              <span className="file-input-button">Choose File</span>
              <span className="file-input-name">
                {fileNames.examFile || 'No file chosen'}
              </span>
            </label>
          </div>
          {isEditMode && (
            <div className="file-note">Leave empty to keep current file</div>
          )}
        </div>

        {/* Solution File */}
        <div className="form-group">
          <label className="form-label">Solution File (optional)</label>
          <div className="file-input-container">
            <label className="file-input-label">
              <input
                type="file"
                name="solutionFile"
                accept=".pdf"
                onChange={handleFileChange}
                className="file-input"
              />
              <span className="file-input-button">Choose File</span>
              <span className="file-input-name">
                {fileNames.solutionFile || 'No file chosen'}
              </span>
            </label>
          </div>
          {isEditMode && (
            <div className="file-note">Leave empty to keep current file</div>
          )}
        </div>

        {error && <div className="form-error">{error}</div>}

        <button 
          type="submit" 
          className="submit-button"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner"></span>
              Saving...
            </>
          ) : (
            'Save Exam'
          )}
        </button>
      </form>
    </div>
  );
};

export default ExamForm;