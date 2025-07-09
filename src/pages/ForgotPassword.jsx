import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/FormLayout.css';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSendOtp = async () => {
    try {
      const res = await axios.post(`http://localhost:8080/api/auth/forgot-password?email=${email}`);
      localStorage.setItem('resetEmail', email);
      setMessage(res.data.message || 'OTP sent to your email.');
      setTimeout(() => navigate('/reset-password'), 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to send OTP.');
    }
  };

  return (
    <div className="form-container">
      <h2>Forgot Password</h2>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <button disabled={!email} onClick={handleSendOtp}>Send OTP</button>
      {message && <p className="message">{message}</p>}
    </div>
  );
}
