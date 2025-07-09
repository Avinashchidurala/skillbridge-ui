import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CertificateDisplay.css';

export default function CertificateDisplay() {
  const [certificates, setCertificates] = useState([]);
  const [role, setRole] = useState(null);
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setRole(payload.role);
    }
  }, [token]);

  useEffect(() => {
    if (role !== 'STUDENT' || !token) return;
    axios.get('http://localhost:8080/api/user/me/certificates', {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => setCertificates(res.data));
  }, [role, token]);

  if (role !== 'STUDENT') return null;

  return (
    <div className="cert-display">
      <h2>Your Certificates</h2>
      <div className="cert-grid">
        {certificates.map(cert => (
          <div className="cert-card" key={cert.certificateId}>
            <h3>{cert.courseTitle}</h3>
            <p><strong>ID:</strong> {cert.certificateId}</p>
            <p><strong>Issued:</strong> {cert.issueDate}</p>
            <a
              href={cert.certificateUrl}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="cert-download"
            >
              Download PDF 📥
            </a>
          </div>
        ))}
        {certificates.length === 0 && <p>No certificates issued yet.</p>}
      </div>
    </div>
  );
}
