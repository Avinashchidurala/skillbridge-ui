import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './UserProfile.css';

export default function UserProfile() {
  const [user, setUser] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    axios.get('http://localhost:8080/api/user/me', {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => setUser(res.data));
  }, []);

  const handleUpdate = async () => {
    const token = localStorage.getItem('authToken');
    try {
      await axios.put('http://localhost:8080/api/user/me/update', {
        name: user.name,
        email: user.email,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (newPassword.length >= 8) {
        await axios.put('http://localhost:8080/api/user/me/change-password', {
          newPassword,
        }, { headers: { Authorization: `Bearer ${token}` } });
      }

      if (profileImageFile) {
        const data = new FormData();
        data.append('image', profileImageFile);
        await axios.put('http://localhost:8080/api/user/me/upload-profile-image', data, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      if (resumeFile && user.role === 'STUDENT') {
        const data = new FormData();
        data.append('resume', resumeFile);
        await axios.put('http://localhost:8080/api/user/me/upload-resume', data, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      setMessage('Profile updated successfully!');
      setEditMode(false);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Update failed.');
    }
  };

  return (
    <div className="profile-container">
      <h2>My Profile</h2>
      <img src={user.profileImageUrl} alt="Profile" className="profile-image" />
      {!editMode ? (
        <>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
          {user.resumeUrl && user.role === 'STUDENT' && (
            <p>
              <strong>Resume:</strong>{' '}
              <a href={user.resumeUrl} target="_blank" rel="noopener noreferrer">Download</a>
            </p>
          )}
          <button onClick={() => setEditMode(true)}>Edit Profile</button>
        </>
      ) : (
        <>
          <input type="text" value={user.name} onChange={e => setUser({ ...user, name: e.target.value })} />
          <input type="email" value={user.email} onChange={e => setUser({ ...user, email: e.target.value })} />
          <input type="password" placeholder="New Password" onChange={e => setNewPassword(e.target.value)} />
          <div>
            <label>Upload Profile Image:</label>
            <input type="file" onChange={e => setProfileImageFile(e.target.files[0])} />
          </div>
          {user.role === 'STUDENT' && (
            <div>
              <label>Upload Resume:</label>
              <input type="file" onChange={e => setResumeFile(e.target.files[0])} />
            </div>
          )}
          <button onClick={handleUpdate}>Save</button>
          <button onClick={() => setEditMode(false)}>Cancel</button>
        </>
      )}
      {message && <p className="message">{message}</p>}
    </div>
  );
}
