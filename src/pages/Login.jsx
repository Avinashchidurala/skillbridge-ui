import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Signup.css'; // Reusing styles
import '../styles/FormLayout.css';
export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); // Optional for UI consistency
  const [message, setMessage] = useState('');

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        `http://localhost:8080/api/auth/login?email=${email}`
      );
          const token = res.data.token;

    // ✅ Store token in localStorage
    localStorage.setItem('authToken', token);

    // ✅ Decode role from token to redirect
    const payload = JSON.parse(atob(token.split('.')[1]));
    const role = payload.role;

    if (role === 'ADMIN') {
      navigate('/admin/dashboard');
    } else if (role === 'STUDENT') {
      navigate('/dashboard');
    } else {
      navigate('/unauthorized');
    }

    setMessage('Login successful!');
  } catch (err) {
    setMessage(err.response?.data?.message || 'Login failed');
  }
  };

  return (
        <div className="form-container">
      <h2>Login</h2>
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password (optional)" value={password} onChange={e => setPassword(e.target.value)} />
      <p style={{ marginTop: '10px', textAlign: 'center' }}>
       <a href="/forgot-password" style={{ color: '#007bff', textDecoration: 'none' }}>
    Forgot your password?
  </a>
</p>
      <button onClick={handleLogin}>Login</button>
      {message && <p className="message">{message}</p>}
    </div>
  );
}
