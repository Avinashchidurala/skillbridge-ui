import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CourseShowcase.css'; // Optional styles

export default function CourseShowcase() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get("http://localhost:8080/api/courses/public")
      .then(res => {
        setCourses(res.data);
        setLoading(false);
      })
      .catch(() => {
        setMessage("⚠️ Failed to load course details.");
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="form-container"><p>Loading courses...</p></div>;
  if (message) return <div className="form-container"><p>{message}</p></div>;

  return (
    <div className="form-container">
      <h2>🎓 Explore Our Courses</h2>
      <div className="course-grid">
        {courses.map(course => (
          <div key={course.id} className="course-card">
            <img src={course.imageUrl || "/assets/course-default.jpg"} alt="Course" />
            <h3>{course.title}</h3>
            <p>{course.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
