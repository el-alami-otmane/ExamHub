// api.js
import axios from 'axios';
import authService from '../services/auth';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['x-auth-token'] = token;
  }
  return config;
});

// Secteurs
export const fetchSecteurs = () => API.get('/secteurs');
export const createSecteur = (newSecteur) => API.post('/secteurs', newSecteur);
export const deleteSecteur = (id) => API.delete(`/secteurs/${id}`);

// Filieres
export const fetchFilieres = () => API.get('/filieres');
export const createFiliere = (newFiliere) => API.post('/filieres', newFiliere);
export const fetchFilieresBySecteur = (secteurId) => API.get(`/filieres/secteur/${secteurId}`);
export const fetchNiveauxByFiliere = (filiereId) => API.get(`/filieres/${filiereId}/niveaux`);
export const deleteFiliere = (id) => API.delete(`/filieres/${id}`);

// Exams
export const fetchExams = () => API.get('/exams');
export const fetchExamById = (id) => API.get(`/exams/${id}`); // Add this line
export const createExam = (formData) => API.post('/exams', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const updateExam = (id, formData) => API.put(`/exams/${id}`, formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const downloadExamFile = (id) => API.get(`/exams/${id}/download-exam`, { responseType: 'blob' });
export const downloadSolutionFile = (id) => API.get(`/exams/${id}/download-solution`, { responseType: 'blob' });
export const deleteExam = (id) => API.delete(`/exams/${id}`);
export const incrementDownloads = (id) => API.patch(`/exams/${id}/downloads`);
export const getFilteredExams = (filters) => API.get('/exams/filtered', { params: filters });