// src/components/TopNav.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './TopNav.css';

const TopNav = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Add your logout logic here
    navigate('/login');
  };

  return (
    <nav className="top-nav">
      <div className="nav-left">
        <button className="menu-toggle">
          ☰
        </button>
      </div>
      <div className="nav-right">
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default TopNav;