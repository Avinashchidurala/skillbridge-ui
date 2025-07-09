import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/FormLayout.css';
import './ExamAccessGate.css';

export default function ExamAccessGate() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    axios.get("http://localhost:8080/api/student/exams", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        setExams(res.data);
        setLoading(false);
      })
      .catch(() => {
        setMessage("❌ Failed to fetch exam access data.");
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="form-container"><p>Loading exams...</p></div>;
  if (message) return <div className="form-container"><p>{message}</p></div>;

  return (
    <div className="form-container">
      <h2>🧪 Your Accessible Exams</h2>
      {exams.length === 0 ? (
        <p>No exams available right now. Check again later.</p>
      ) : (
        <div className="exam-grid">
          {exams.map(exam => (
            <div key={exam.id} className="exam-card">
              <h3>{exam.title}</h3>
              <p><strong>Course:</strong> {exam.courseTitle}</p>
              <p><strong>Batch:</strong> {exam.batchName}</p>
              <p><strong>Date:</strong> {exam.scheduledDate}</p>
              <p><strong>Status:</strong> {exam.active ? "✅ Active" : "🚫 Inactive"}</p>
              <p><strong>Batch Closed:</strong> {exam.batchClosed ? "✅ Yes" : "❌ No"}</p>
              {exam.accessAllowed ? (
                <button className="btn-access">Take Exam</button>
              ) : (
                <p className="locked-msg">🔒 You can't take this exam yet.</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
