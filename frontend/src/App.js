// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserDashboard from './pages/user/UserDashboard';
import SecteurManagement from './pages/SecteurManagement';
import FiliereManagement from './pages/FiliereManagement';
import ExamManagement from './pages/ExamManagement';
import Profile from './components/Profile';
import AdminExamDetail from './pages/admin/AdminExamDetail';
import ExamForm from './components/ExamForm';
import EditExam from './pages/admin/EditExam';
import Sidebar from './components/Sidebar';
import TopNav from './components/TopNav';
import CreateExamPage from './pages/CreateExamPage';

const Layout = ({ children, role }) => {
  return (
    <div className="app-container">
      <Sidebar role={role} />
      <div className="main-content">
        <TopNav />
        <div className="content-wrapper">
          {children}
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Admin routes group */}
          <Route element={<PrivateRoute requiredRole="admin" />}>
            <Route path="/admin" element={
              <Layout role="admin">
                <AdminDashboard />
              </Layout>
            } />
            <Route path="/admin/exams/create" element={
  <Layout role="admin">
    <CreateExamPage />
  </Layout>
} />
            <Route path="/admin/secteurs" element={
              <Layout role="admin">
                <SecteurManagement />
              </Layout>
            } />
            <Route path="/admin/filieres" element={
              <Layout role="admin">
                <FiliereManagement />
              </Layout>
            } />
            <Route path="/admin/exams" element={
              <Layout role="admin">
                <ExamManagement />
              </Layout>
            } />
            <Route path="/admin/exams/create" element={
              <Layout role="admin">
                <ExamForm />
              </Layout>
            } />
            <Route path="/admin/exams/:id" element={
              <Layout role="admin">
                <AdminExamDetail />
              </Layout>
            } />
            <Route path="/admin/exams/edit/:id" element={
              <Layout role="admin">
                <EditExam />
              </Layout>
            } />
            <Route path="/admin/profile" element={
              <Layout role="admin">
                <Profile adminView={true} />
              </Layout>
            } />
          </Route>
          
          {/* User routes group */}
          <Route element={<PrivateRoute requiredRole="user" />}>
            <Route path="/user" element={
              <Layout role="user">
                <UserDashboard />
              </Layout>
            } />
            <Route path="/user/exams/:id" element={
              <Layout role="user">
                <AdminExamDetail />
              </Layout>
            } />
            <Route path="/user/profile" element={
              <Layout role="user">
                <Profile />
              </Layout>
            } />
          </Route>

          
          {/* Default route */}
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;