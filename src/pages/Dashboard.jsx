import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/FormLayout.css';

export default function Dashboard() {
  const [user, setUser] = useState(null);
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
        setUser(res.data);
        setLoading(false);
      })
      .catch(err => {
        setMessage('⚠️ Failed to load user info');
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="form-container"><p>Loading dashboard...</p></div>;
  if (message) return <div className="form-container"><p>{message}</p></div>;

  return (
    <div className="form-container">
      <h2>Welcome to SkillBridge 🎓</h2>
      {user && (
        <>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
          <p>
            ✨ You can now explore{' '}
            {user.role === 'STUDENT' && 'your batches and exams!'}
            {user.role === 'ADMIN' && 'admin insights and course reports!'}
            {user.role === 'TEACHER' && 'assigned classes and student submissions!'}
          </p>
        </>
      )}
    </div>
  );
}
