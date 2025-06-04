// src/components/AdminRoute.js
import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ component: Component, ...rest }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return <div className="text-center text-xl mt-8 text-gray-600">Loading authentication...</div>;
  }

  return (
    <Route
      {...rest}
      render={props =>
        isAuthenticated && isAdmin ? (
          <Component {...props} />
        ) : isAuthenticated ? (
          <Redirect to="/dashboard" /> // Redirect user biasa ke dashboard mereka
        ) : (
          <Redirect to="/login" /> // Redirect jika belum login
        )
      }
    />
  );
};

export default AdminRoute;