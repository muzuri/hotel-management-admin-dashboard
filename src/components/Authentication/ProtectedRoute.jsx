import React, { useState, createContext, useContext, useEffect } from 'react';
import { AlertCircle, LogIn, LogOut, User, Shield } from 'lucide-react';
import LoginPage from '../../pages/LoginPage';
import { AuthContext } from '../../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading, token } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!token) {
    return <LoginPage />;
  }

  return children;
};

export default ProtectedRoute;