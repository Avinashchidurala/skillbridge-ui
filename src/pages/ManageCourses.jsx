import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/FormLayout.css';
import './ManageCourses.css'; // Optional for styling

export default function ManageCourses() {
  const [courses, setCourses] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    axios.get("http://localhost:8080/api/admin/courses", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        setCourses(res.data);
        setLoading(false);
      })
      .catch(() => {
        setMessage("⚠️ Failed to load courses.");
        setLoading(false);
      });
  }, []);

  const toggleCourseStatus = (id, currentStatus) => {
    const token = localStorage.getItem("authToken");
    axios.put(`http://localhost:8080/api/admin/courses/${id}/activate?status=${!currentStatus}`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => {
        setCourses(prev =>
          prev.map(course =>
            course.id === id ? { ...course, active: !currentStatus } : course
          )
        );
      })
      .catch(() => setMessage("❌ Failed to update course status."));
  };

  if (loading) return <div className="form-container"><p>Loading courses...</p></div>;
  if (message) return <div className="form-container"><p>{message}</p></div>;

  return (
    <div className="form-container">
      <h2>📚 Manage Courses</h2>
      <table>
        <thead>
          <tr>
            <th>Title</th><th>Description</th><th>Status</th><th>Action</th>
          </tr>
        </thead>
        <tbody>
          {courses.map(course => (
            <tr key={course.id}>
              <td>{course.title}</td>
              <td>{course.description}</td>
              <td>{course.active ? "✅ Active" : "🚫 Inactive"}</td>
              <td>
                <button onClick={() => toggleCourseStatus(course.id, course.active)}>
                  {course.active ? "Deactivate" : "Activate"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
