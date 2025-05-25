// auth.js
import { jwtDecode } from 'jwt-decode';  // Changed from default import to named import
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

// Register user
const register = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

// Login user
const login = async (userData) => {
  const response = await axios.post(`${API_URL}/login`, userData);
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

// Logout user
const logout = () => {
  localStorage.removeItem('token');
};

// Get current user
const getCurrentUser = () => {
  const token = localStorage.getItem('token');
  if (token) {
    return jwtDecode(token);  // Now using the named import
  }
  return null;
};

// Get auth header
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  if (token) {
    return { 'x-auth-token': token };
  }
  return {};
};

const authService = {
  register,
  login,
  logout,
  getCurrentUser,
  getAuthHeader,
};

export default authService;