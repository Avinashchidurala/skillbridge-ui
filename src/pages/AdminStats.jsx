import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/FormLayout.css';
import './AdminStats.css'; // Optional: for card styles

export default function AdminStats() {
  const [stats, setStats] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setMessage('🚫 Unauthorized — please login first.');
      setLoading(false);
      return;
    }

    axios.get('http://localhost:8080/api/admin/stats/user-counts', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setStats(res.data);
        setLoading(false);
      })
      .catch(() => {
        setMessage('⚠️ Failed to load user stats.');
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="form-container"><p>Loading admin stats...</p></div>;
  if (message) return <div className="form-container"><p>{message}</p></div>;

  return (
    <div className="form-container">
      <h2>📊 User Role Stats</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p>{stats.totalUsers}</p>
        </div>
        <div className="stat-card">
          <h3>Students</h3>
          <p>{stats.students}</p>
        </div>
        <div className="stat-card">
          <h3>Teachers</h3>
          <p>{stats.teachers}</p>
        </div>
        <div className="stat-card">
          <h3>Admins</h3>
          <p>{stats.admins}</p>
        </div>
      </div>
    </div>
  );
}
