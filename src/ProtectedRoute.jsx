// ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token'); // Check for the token

  // If there's no token, redirect to the login page
  if (!token) {
    return <Navigate to="/" />;
  }

  return children; // If token exists, render the child components
};

export default ProtectedRoute;
