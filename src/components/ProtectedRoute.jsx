import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute({ allowedRoles }) {
  const token = localStorage.getItem('authToken');

  if (!token) return <Navigate to="/login" />;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (!allowedRoles.includes(payload.role)) {
      return <Navigate to="/unauthorized" />;
    }
  } catch (err) {
    console.error("Invalid token:", err);
    return <Navigate to="/login" />;
  }

  return <Outlet />;
}
