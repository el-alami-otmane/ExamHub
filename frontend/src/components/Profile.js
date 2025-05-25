import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import authService from '../services/auth';
import './Profile.css';

const Profile = ({ adminView = false }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:5000/api/auth/me`,
          {
            headers: authService.getAuthHeader()
          }
        );
        setUser(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load profile');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  if (loading) return (
    <div className="profile-loading">
      <div className="loading-spinner"></div>
      <p>Loading profile...</p>
    </div>
  );

  if (error) return (
    <div className="profile-error">
      <div className="error-message">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    </div>
  );

  if (!user) return (
    <div className="profile-error">
      <div className="error-message">
        <p>User data not available</p>
        <Link to="/login">Login Again</Link>
      </div>
    </div>
  );

  return (
    <div className={`profile-container ${adminView ? 'admin-view' : ''}`}>
      <div className="profile-header">
        <div className="header-content">
          <h1 className="profile-title">
            {adminView ? 'Admin Profile' : 'My Profile'}
          </h1>
          <Link 
            to={adminView ? '/admin' : '/'} 
            className="back-button"
          >
            <span className="arrow">←</span> Back to {adminView ? 'Dashboard' : 'Home'}
          </Link>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-avatar">
            <div className="avatar-circle">
              {user.firstName.charAt(0).toUpperCase()}
              {user.lastName.charAt(0).toUpperCase()}
            </div>
          </div>

          <div className="profile-details">
            <div className="detail-row">
              <span className="detail-label">First Name:</span>
              <span className="detail-value">{user.firstName}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Last Name:</span>
              <span className="detail-value">{user.lastName}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Email:</span>
              <span className="detail-value">{user.email}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Role:</span>
              <span className={`detail-value role-badge ${user.role.toLowerCase()}`}>
                {user.role}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Member Since:</span>
              <span className="detail-value">
                {new Date(user.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
          </div>
        </div>

       
      </div>
    </div>
  );
};

export default Profile;