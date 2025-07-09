import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './pages/Signup';
import Verify from './pages/Verify';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import UserProfile from './pages/UserProfile';

// Student modules
import StudentResults from './pages/StudentResults';
import ExamAccessGate from './pages/ExamAccessGate';
import CertificateDownloader from './pages/CertificateDownloader';

// Teacher modules
import BatchEnrollment from './pages/BatchEnrollment';
import BatchResultsViewer from './pages/BatchResultsViewer';
import BatchCloser from './pages/BatchCloser';
import ResultReleaser from './pages/ResultReleaser';

// Admin modules
import AdminDashboard from './pages/AdminDashboard';
import ManageUsers from './pages/ManageUsers';
import ManageCourses from './pages/ManageCourses';
import ManageCertificates from './pages/ManageCertificates';
import AdminStats from './pages/AdminStats';

import Unauthorized from './pages/Unauthorized';
import Home from './pages/Home'; // ✅ This includes course cards now
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected Student Routes */}
        <Route element={<ProtectedRoute allowedRoles={['STUDENT']} />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/certificates" element={<CertificateDownloader />} />
          <Route path="/results" element={<StudentResults />} />
          <Route path="/exams" element={<ExamAccessGate />} />
        </Route>

        {/* Protected Teacher Routes */}
        <Route element={<ProtectedRoute allowedRoles={['TEACHER']} />}>
          <Route path="/teacher/enroll" element={<BatchEnrollment />} />
          <Route path="/teacher/results" element={<BatchResultsViewer />} />
          <Route path="/teacher/close-batch" element={<BatchCloser />} />
          <Route path="/teacher/release-results" element={<ResultReleaser />} />
        </Route>

        {/* Protected Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<ManageUsers />} />
          <Route path="/admin/courses" element={<ManageCourses />} />
          <Route path="/admin/certificates" element={<ManageCertificates />} />
          <Route path="/admin/stats" element={<AdminStats />} />
        </Route>

        {/* Common Protected Route */}
        <Route element={<ProtectedRoute allowedRoles={['STUDENT', 'TEACHER', 'ADMIN']} />}>
          <Route path="/profile" element={<UserProfile />} />
        </Route>

        {/* Unauthorized Fallback */}
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
