import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/FormLayout.css';
import './CertificateDownloader.css';

export default function CertificateDownloader() {
  const [certificates, setCertificates] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    axios.get("http://localhost:8080/api/student/certificates", {
      headers: { Authorization: `Bearer ${token}` },
      responseType: 'json'
    })
      .then(res => {
        setCertificates(res.data);
        setLoading(false);
      })
      .catch(() => {
        setMessage("❌ Could not load certificates.");
        setLoading(false);
      });
  }, []);

  const downloadPDF = (certId) => {
    axios.get(`http://localhost:8080/api/student/certificates/${certId}/download`, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: 'blob',
    })
      .then(res => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `certificate-${certId}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch(() => setMessage("❌ Failed to download certificate."));
  };

  return (
    <div className="form-container">
      <h2>📄 Your Certificates</h2>
      {loading && <p>Loading certificates...</p>}
      {message && <p>{message}</p>}
      {certificates.length === 0 && !loading ? (
        <p>No certificates found yet. Complete more exams!</p>
      ) : (
        <div className="certificate-grid">
          {certificates.map(cert => (
            <div key={cert.id} className="cert-card">
              <h3>{cert.courseTitle}</h3>
              <p><strong>Exam:</strong> {cert.examTitle}</p>
              <p><strong>Status:</strong> ✅ Issued</p>
              <button onClick={() => downloadPDF(cert.id)}>Download PDF</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
