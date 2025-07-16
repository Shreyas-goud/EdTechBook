// src/App.jsx
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login"; // fallback
import Signup from "./pages/Signup"; // fallback
import Courses from "./pages/Courses";
import MyCourses from "./pages/MyCourses";
import LessonPlayer from "./pages/LessonPlayer";
import AdminDashboard from "./admin/AdminDashboard";
import AdminCourseForm from "./admin/AdminCourseForm";
import AuthModal from "./components/AuthModal";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [authType, setAuthType] = useState(null); // "signin" or "signup"

  // Listen to login modal event
  useEffect(() => {
    const handleOpenModal = (e) => {
      const { type } = e.detail || {};
      setAuthType(type);
    };

    window.addEventListener("open-auth-modal", handleOpenModal);
    return () => window.removeEventListener("open-auth-modal", handleOpenModal);
  }, []);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Landing openAuthModal={setAuthType} />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/my-courses" element={<MyCourses />} />
          <Route path="/course/:courseId" element={<LessonPlayer />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/course" element={<AdminCourseForm />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </Router>

      {authType && (
        <AuthModal
          type={authType}
          onClose={() => setAuthType(null)}
          onSwitch={(newType) => setAuthType(newType)}
        />
      )}
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
