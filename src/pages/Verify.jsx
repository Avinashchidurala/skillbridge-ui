import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Signup.css';

export default function Verify() {
  const navigate = useNavigate();
  const saved = JSON.parse(localStorage.getItem('signupUser'));
  const email = saved?.email || '';

  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [timeLeft, setTimeLeft] = useState(240); // 4 minutes in seconds

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      localStorage.removeItem('signupUser');
      navigate('/');
    }
  }, [timeLeft, navigate]); // ✅ navigate added to dependency array

  const handleVerify = async () => {
    try {
      const res = await axios.post(
        `http://localhost:8080/api/auth/verify?email=${email}&otp=${otp}`
      );
      setMessage(res.data.message);
      localStorage.removeItem('signupUser');
      navigate('/login');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Verification failed');
    }
  };

  return (
    <div className="signup-container">
      <h2>Verify OTP</h2>
      <p>Email: <strong>{email}</strong></p>
      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={e => setOtp(e.target.value)}
      />
      <button onClick={handleVerify}>Verify OTP</button>
      <p>⏳ OTP expires in {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</p>
      {message && <p className="message">{message}</p>}
    </div>
  );
}
