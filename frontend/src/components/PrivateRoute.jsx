import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, requireAdmin = false }) => {
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !user.is_admin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;
