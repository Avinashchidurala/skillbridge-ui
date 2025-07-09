import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/FormLayout.css';

export default function ResetPassword() {
  const navigate = useNavigate();
  const storedEmail = localStorage.getItem('resetEmail') || '';
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const isStrongPassword = newPassword =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(newPassword);

  const handleReset = async () => {
    if (!isStrongPassword(newPassword)) {
      setMessage('Password must be strong: 8+ characters with upper, lower, number, and symbol.');
      return;
    }

    try {
      const payload = { email: storedEmail, otp, newPassword };
      const res = await axios.post('http://localhost:8080/api/auth/reset-password', payload);
      localStorage.removeItem('resetEmail');
      setMessage(res.data.message || 'Password reset successful!');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Reset failed. Check OTP and email.');
    }
  };

  return (
    <div className="form-container">
      <h2>Reset Password</h2>
      <p>Email: <strong>{storedEmail}</strong></p>
      <input type="text" placeholder="Enter OTP" value={otp} onChange={e => setOtp(e.target.value)} />
      <input type="password" placeholder="New Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
      <button disabled={!otp || !newPassword} onClick={handleReset}>Reset Password</button>
      {message && <p className="message">{message}</p>}
    </div>
  );
}
