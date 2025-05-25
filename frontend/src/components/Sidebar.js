// src/components/Sidebar.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ role }) => {
  const adminLinks = [
    { path: "/admin", icon: "📊", text: "Dashboard" },
    { path: "/admin/secteurs", icon: "🏛️", text: "Secteurs" },
    { path: "/admin/filieres", icon: "📚", text: "Filieres" },
    { path: "/admin/exams", icon: "📝", text: "Exams" },
    { path: "/admin/profile", icon: "👤", text: "Profile" }
  ];

  const userLinks = [
    { path: "/user", icon: "📊", text: "Dashboard" },
    { path: "/user/profile", icon: "👤", text: "Profile" }
  ];

  const links = role === 'admin' ? adminLinks : userLinks;

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Exam Management</h2>
      </div>
      <nav className="sidebar-nav">
        <ul>
          {links.map((link, index) => (
            <li key={index}>
              <NavLink 
                to={link.path} 
                className={({ isActive }) => isActive ? "active" : ""}
              >
                <span className="icon">{link.icon}</span>
                <span className="text">{link.text}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;