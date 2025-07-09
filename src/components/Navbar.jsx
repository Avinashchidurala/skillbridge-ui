// 🔼 All imports must be at the top
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Navbar.css';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const token = localStorage.getItem('authToken');
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      axios.get('http://localhost:8080/api/user/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setUser(res.data))
      .catch(err => {
        console.error("Navbar user fetch failed", err);
        setUser(null);
      });
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">SkillBridge</div>
      <div className="nav-links">
        <Link to="/">Home</Link>
        {token && <Link to="/dashboard">Dashboard</Link>}

        {!token ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        ) : (
          <>
            {user && (
              <div className="nav-profile">
                {user.profileImageUrl ? (
                  <img
                    src={user.profileImageUrl}
                    alt="Profile"
                    className="nav-avatar"
                  />
                ) : (
                  <div className="nav-avatar-icon">
                    {/* SVG fallback icon */}
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="#007bff">
                      <circle cx="12" cy="8" r="4" />
                      <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
                    </svg>
                  </div>
                )}
                <Link to="/profile" className="nav-name">{user.name}</Link>
              </div>
            )}
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}
