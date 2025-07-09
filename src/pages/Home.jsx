import React, { useEffect, useState } from 'react';
import './Home.css';
import axios from 'axios';

const images = [
  '/assets/1630853094851.jpeg',
  '/assets/download (1).jpeg',
  '/assets/download (2).jpeg',
  '/assets/download.jpeg',
];

export default function Home() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:8080/api/courses/public")
      .then(res => {
        setCourses(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="home-container">
      <section className="hero-section">
        <h1>Welcome to SkillBridge</h1>
        <p>
          Bridging skills with opportunity. SkillBridge is a modern IT training platform
          offering hands-on learning, real-world projects, and career-ready mentorship.
        </p>
      </section>

      <section className="slider-section">
        <div className="slider">
          <div className="slider-track">
            {images.map((src, index) => (
              <div className="slide" key={index}>
                <img src={src} alt={`Slide ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="info-section">
        <h2>Why SkillBridge?</h2>
        <ul>
          <li>✅ Real-world projects with job simulation</li>
          <li>✅ Career tracks in Full Stack, DevOps, QA, and more</li>
          <li>✅ ISO & AICTE accredited programs</li>
          <li>✅ Personalized mentorship and placement support</li>
        </ul>
      </section>

      <section className="course-section">
        <h2>🎓 Explore Our Courses</h2>
        {loading ? <p>Loading...</p> : (
          <div className="course-grid">
            {courses.map(course => (
              <div className="course-card" key={course.id}>
                <img src={course.imageUrl || "/assets/course-default.jpg"} alt="Course" />
                <h3>{course.title}</h3>
                <p>{course.description}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="footer-section">
        <p>📍 Hyderabad, India | 📧 chiduralaavinash@gmail.com</p>
        <p>© 2025 SkillBridge. Empowering your journey to skill mastery.</p>
      </section>
    </div>
  );
}
