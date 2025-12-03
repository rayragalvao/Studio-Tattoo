import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

const UserRoute = ({ children, allowGuests = false }) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        Carregando...
      </div>
    );
  }

  // Se admin tentar acessar, redireciona para dashboard
  if (isAuthenticated && user?.isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  // Se não autenticado e não permitir visitantes, redireciona para home
  if (!isAuthenticated && !allowGuests) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default UserRoute;