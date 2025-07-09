import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export default function PrivateRoute({ role }) {
  const token = localStorage.getItem("authToken");
  const userRole = token ? JSON.parse(atob(token.split('.')[1])).role : null;

  return userRole === role ? <Outlet /> : <Navigate to="/login" />;
}
