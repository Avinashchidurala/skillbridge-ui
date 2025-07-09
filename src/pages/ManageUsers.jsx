import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/FormLayout.css';
import './ManageUsers.css'; // Optional

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    axios.get("http://localhost:8080/api/admin/users", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch(() => {
        setMessage("⚠️ Failed to fetch users.");
        setLoading(false);
      });
  }, []);

  const toggleUserStatus = (id, currentStatus) => {
    const token = localStorage.getItem("authToken");
    axios.put(`http://localhost:8080/api/admin/users/${id}/activate?status=${!currentStatus}`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => {
        setUsers((prev) =>
          prev.map((user) =>
            user.id === id ? { ...user, active: !currentStatus } : user
          )
        );
      })
      .catch(() => setMessage("❌ Failed to update user status."));
  };

  if (loading) return <div className="form-container"><p>Loading users...</p></div>;
  if (message) return <div className="form-container"><p>{message}</p></div>;

  return (
    <div className="form-container">
      <h2>👥 Manage Users</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.active ? "✅ Active" : "🚫 Inactive"}</td>
              <td>
                <button onClick={() => toggleUserStatus(user.id, user.active)}>
                  {user.active ? "Deactivate" : "Activate"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
