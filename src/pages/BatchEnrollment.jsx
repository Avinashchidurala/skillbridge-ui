import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/FormLayout.css';
import './BatchEnrollment.css';

export default function BatchEnrollment() {
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [students, setStudents] = useState([]);
  const [enrolledIds, setEnrolledIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    axios.get("http://localhost:8080/api/teacher/batches", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => setBatches(res.data))
      .catch(() => setMessage("❌ Failed to load batches."));
  }, []);

  const fetchBatchStudents = () => {
    if (!selectedBatch) return;
    setLoading(true);
    axios.get(`http://localhost:8080/api/teacher/batch/${selectedBatch}/students`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        setStudents(res.data.allUsers);
        setEnrolledIds(res.data.enrolledIds);
        setLoading(false);
      })
      .catch(() => {
        setMessage("❌ Failed to load student list.");
        setLoading(false);
      });
  };

  const toggleStudent = (id) => {
    const isEnrolled = enrolledIds.includes(id);
    const method = isEnrolled ? 'remove' : 'add';

    axios.post(`http://localhost:8080/api/teacher/batch/${selectedBatch}/${method}/${id}`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => {
        setEnrolledIds(prev =>
          isEnrolled ? prev.filter(uid => uid !== id) : [...prev, id]
        );
      })
      .catch(() => setMessage(`❌ Failed to ${method} student.`));
  };

  return (
    <div className="form-container">
      <h2>👨‍🏫 Manage Batch Enrollment</h2>
      <div className="batch-select">
        <label>Select a Batch:</label>
        <select value={selectedBatch} onChange={e => setSelectedBatch(e.target.value)}>
          <option value="">-- Choose Batch --</option>
          {batches.map(batch => (
            <option key={batch.id} value={batch.id}>{batch.name}</option>
          ))}
        </select>
        <button onClick={fetchBatchStudents}>Load Students</button>
      </div>

      {loading ? <p>Loading...</p> : null}
      {message && <p>{message}</p>}

      {students.length > 0 && (
        <table className="enroll-table">
          <thead>
            <tr>
              <th>Name</th><th>Email</th><th>Status</th><th>Action</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => {
              const enrolled = enrolledIds.includes(student.id);
              return (
                <tr key={student.id}>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>{enrolled ? "✅ Enrolled" : "🚫 Not Enrolled"}</td>
                  <td>
                    <button onClick={() => toggleStudent(student.id)}>
                      {enrolled ? "Remove" : "Add"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
