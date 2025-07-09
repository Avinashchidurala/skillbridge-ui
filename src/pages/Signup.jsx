import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Signup.css';
import '../styles/FormLayout.css';

export default function Signup() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('STUDENT');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('signupUser'));
    if (stored) {
      setEmail(stored.email);
      setName(stored.name);
      setRole(stored.role);
      setPassword(stored.password);
    }
  }, []);

  const handleSignup = async () => {
    // Password strength check
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!regex.test(password)) {
      setPasswordError(
        'Password must be 8+ characters with uppercase, lowercase, number, and special character.'
      );
      return;
    }

    setPasswordError('');

    const payload = { email, name, role, password };

    try {
      const res = await axios.post('http://localhost:8080/api/auth/signup', payload);
      localStorage.setItem('signupUser', JSON.stringify(payload));
      setMessage(res.data.message);
      navigate('/verify');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} />
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      {passwordError && <p className="error">{passwordError}</p>}
      <select value={role} onChange={e => setRole(e.target.value)}>
        <option value="STUDENT">Student</option>
        <option value="TEACHER">Teacher</option>
      </select>
      <button onClick={handleSignup}>Send OTP</button>
      {message && <p className="message">{message}</p>}
    </div>
  );
}
