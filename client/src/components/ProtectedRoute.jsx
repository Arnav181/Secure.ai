import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import the authentication context

const ProtectedRoute = ({ element }) => {
  const { isAuthenticated } = useAuth(); // Get the authentication status
  
  console.log("ProtectedRoute: isAuthenticated state:", isAuthenticated);

  return isAuthenticated ? element : <Navigate to="/login" />;
};

export default ProtectedRoute;
