import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/FormLayout.css';
import './StudentResults.css'; // Optional styles

export default function StudentResults() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    axios.get("http://localhost:8080/api/student/results", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        setResults(res.data);
        setLoading(false);
      })
      .catch(() => {
        setMessage("❌ Failed to load results.");
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="form-container"><p>Loading your results...</p></div>;
  if (message) return <div className="form-container"><p>{message}</p></div>;

  return (
    <div className="form-container">
      <h2>📊 Your Results</h2>
      {results.length === 0 ? (
        <p>🔒 Results are not yet released. Check back later.</p>
      ) : (
        <div className="result-grid">
          {results.map((res) => (
            <div key={res.examId} className="result-card">
              <h3>{res.examTitle}</h3>
              <p><strong>Batch:</strong> {res.batchName}</p>
              <p><strong>Course:</strong> {res.courseTitle}</p>
              <p><strong>Your Score:</strong> {res.marksObtained} / {res.totalMarks}</p>
              <p><strong>Status:</strong> {res.passed ? "✅ Passed" : "❌ Failed"}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
