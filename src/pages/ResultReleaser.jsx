import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/FormLayout.css';
import './ResultReleaser.css';

export default function ResultReleaser() {
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    axios.get("http://localhost:8080/api/teacher/batches", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => setBatches(res.data))
      .catch(() => setStatusMessage("❌ Failed to fetch batches."));
  }, []);

  const fetchExams = () => {
    if (!selectedBatch) return;
    axios.get(`http://localhost:8080/api/teacher/batch/${selectedBatch}/exams`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => setExams(res.data))
      .catch(() => setStatusMessage("❌ Failed to fetch exams."));
  };

  const releaseResults = () => {
    if (!selectedExam || !selectedBatch) return;
    axios.post(`http://localhost:8080/api/teacher/results/${selectedExam}/release?batchId=${selectedBatch}`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => setStatusMessage("✅ Results released successfully."))
      .catch(() => setStatusMessage("❌ Failed to release results."));
  };

  return (
    <div className="form-container">
      <h2>🔓 Release Results</h2>

      <div className="release-select">
        <label>Batch:</label>
        <select value={selectedBatch} onChange={e => setSelectedBatch(e.target.value)}>
          <option value="">-- Select Batch --</option>
          {batches.map(batch => (
            <option key={batch.id} value={batch.id}>{batch.name}</option>
          ))}
        </select>

        <button onClick={fetchExams}>Load Exams</button>
      </div>

      {exams.length > 0 && (
        <div className="release-select">
          <label>Exam:</label>
          <select value={selectedExam} onChange={e => setSelectedExam(e.target.value)}>
            <option value="">-- Select Exam --</option>
            {exams.map(exam => (
              <option key={exam.id} value={exam.id}>{exam.title}</option>
            ))}
          </select>
          <button onClick={releaseResults}>Release Results</button>
        </div>
      )}

      {statusMessage && <p>{statusMessage}</p>}
    </div>
  );
}
