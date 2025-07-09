import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/FormLayout.css';
import './ManageCertificates.css'; // Optional for styling

export default function ManageCertificates() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    axios.get('http://localhost:8080/api/admin/certificates', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setCertificates(res.data);
        setLoading(false);
      })
      .catch(() => {
        setMessage('❌ Failed to load certificates.');
        setLoading(false);
      });
  }, []);

  const regenerateCertificate = (certificateId) => {
    const token = localStorage.getItem('authToken');
    axios.post(`http://localhost:8080/api/admin/certificates/${certificateId}/regenerate`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => alert('✅ Certificate regenerated successfully'))
      .catch(() => alert('⚠️ Regeneration failed'));
  };

  if (loading) return <div className="form-container"><p>Loading certificates...</p></div>;
  if (message) return <div className="form-container"><p>{message}</p></div>;

  return (
    <div className="form-container">
      <h2>🎓 Manage Certificates</h2>
      <table>
        <thead>
          <tr>
            <th>User</th><th>Course</th><th>Issued</th><th>Action</th>
          </tr>
        </thead>
        <tbody>
          {certificates.map(cert => (
            <tr key={cert.id}>
              <td>{cert.userName}</td>
              <td>{cert.courseTitle}</td>
              <td>{cert.issuedDate}</td>
              <td>
                <button onClick={() => regenerateCertificate(cert.id)}>Regenerate</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
