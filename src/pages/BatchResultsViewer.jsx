import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/FormLayout.css';
import './BatchResultsViewer.css'; // Optional styles

export default function BatchResultsViewer() {
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    axios.get("http://localhost:8080/api/teacher/batches", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => setBatches(res.data))
      .catch(() => setMessage("❌ Failed to load batches."));
  }, []);

  const fetchResults = () => {
    if (!selectedBatch) return;
    setLoading(true);
    const token = localStorage.getItem("authToken");
    axios.get(`http://localhost:8080/api/teacher/results/${selectedBatch}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        setResults(res.data);
        setLoading(false);
      })
      .catch(() => {
        setMessage("❌ Failed to load results.");
        setLoading(false);
      });
  };

  return (
    <div className="form-container">
      <h2>📋 Batch Results Viewer</h2>
      <div className="batch-select">
        <label>Select a batch:</label>
        <select value={selectedBatch} onChange={(e) => setSelectedBatch(e.target.value)}>
          <option value="">-- Choose Batch --</option>
          {batches.map(batch => (
            <option key={batch.id} value={batch.id}>{batch.name}</option>
          ))}
        </select>
        <button onClick={fetchResults}>Load Results</button>
      </div>

      {loading ? <p>Loading...</p> : null}
      {message && <p>{message}</p>}

      {results.length > 0 && (
        <table className="results-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Exam</th>
              <th>Course</th>
              <th>Score</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {results.map(res => (
              <tr key={res.studentId + res.examId}>
                <td>{res.studentName}</td>
                <td>{res.examTitle}</td>
                <td>{res.courseTitle}</td>
                <td>{res.marksObtained} / {res.totalMarks}</td>
                <td>{res.passed ? "✅ Passed" : "❌ Failed"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
