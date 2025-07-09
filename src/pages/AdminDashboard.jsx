import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/FormLayout.css';

export default function AdminDashboard() {
  const [admin, setAdmin] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setMessage('🚫 Unauthorized — please login first.');
      setLoading(false);
      return;
    }

    axios.get('http://localhost:8080/api/user/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (res.data.role !== 'ADMIN') {
          setMessage('⛔ Access denied. Only admins can view this page.');
        } else {
          setAdmin(res.data);
        }
        setLoading(false);
      })
      .catch(() => {
        setMessage('⚠️ Failed to load admin info.');
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="form-container"><p>Loading admin dashboard...</p></div>;
  if (message) return <div className="form-container"><p>{message}</p></div>;

  return (
    <div className="form-container">
      <h2>👑 Admin Dashboard</h2>
      <p><strong>Name:</strong> {admin.name}</p>
      <p><strong>Email:</strong> {admin.email}</p>
      <p><strong>Role:</strong> {admin.role}</p>
      <p>🧠 You can now manage users, courses, certificates, and review analytics.</p>
    </div>
  );
}
