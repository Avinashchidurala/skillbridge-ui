import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/FormLayout.css';
import './BatchCloser.css';

export default function BatchCloser() {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState('');

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    axios.get("http://localhost:8080/api/teacher/batches", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        setBatches(res.data);
        setLoading(false);
      })
      .catch(() => {
        setStatusMsg("❌ Failed to load batches.");
        setLoading(false);
      });
  }, []);

  const closeBatch = (id) => {
    axios.put(`http://localhost:8080/api/teacher/batch/${id}/close`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => {
        setBatches(prev =>
          prev.map(b => b.id === id ? { ...b, closed: true } : b)
        );
        setStatusMsg("✅ Batch closed successfully.");
      })
      .catch(() => setStatusMsg("❌ Failed to close batch."));
  };

  if (loading) return <div className="form-container"><p>Loading batches...</p></div>;

  return (
    <div className="form-container">
      <h2>🔐 Close Batches</h2>
      {statusMsg && <p>{statusMsg}</p>}
      {batches.length === 0 ? (
        <p>No batches available.</p>
      ) : (
        <table className="batch-table">
          <thead>
            <tr>
              <th>Batch Name</th><th>Course</th><th>Status</th><th>Action</th>
            </tr>
          </thead>
          <tbody>
            {batches.map(batch => (
              <tr key={batch.id}>
                <td>{batch.name}</td>
                <td>{batch.courseTitle}</td>
                <td>{batch.closed ? "✅ Closed" : "🟡 Open"}</td>
                <td>
                  {!batch.closed && (
                    <button onClick={() => closeBatch(batch.id)}>Close</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
