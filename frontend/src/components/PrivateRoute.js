// src/components/PrivateRoute.js
import { Navigate, Outlet } from 'react-router-dom';
import authService from '../services/auth';

const PrivateRoute = ({ requiredRole }) => {
  const currentUser = authService.getCurrentUser();
  
  // If no user is logged in, redirect to login
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Extract role from the decoded token
  const userRole = currentUser.user?.role || currentUser.role;

  // If a specific role is required and user doesn't have it, redirect
  if (requiredRole && userRole !== requiredRole) {
    return userRole === 'admin' 
      ? <Navigate to="/admin" replace /> 
      : <Navigate to="/user" replace />;
  }

  // If all checks pass, render the child routes
  return <Outlet />;
};

export default PrivateRoute;