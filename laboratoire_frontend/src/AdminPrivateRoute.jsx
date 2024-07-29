// AdminPrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

function useAuth() {
  const token = localStorage.getItem('currentToken');
  console.log("Auth token:", token); // Log pour vérifier la présence du token
  return token !== null;
}

const AdminPrivateRoute = ({ children }) => {
  const isAuthenticated = useAuth();
  console.log("isAuthenticated:", isAuthenticated); // Log pour vérifier l'état d'authentification
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default AdminPrivateRoute;
