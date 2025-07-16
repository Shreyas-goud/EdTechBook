// src/pages/Landing.jsx
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "../components/Navbar";
import AuthModal from "../components/AuthModal";
import "./Landing.css";
import LandingPreviewCourses from "../components/LandingPreviewCourses";
import LandingPreviewLessons from "../components/LandingPreviewLessons";
import Footer from "../components/Footer";

function Landing() {
  const [authType, setAuthType] = useState(null);
  const navigate = useNavigate();

  const handleStartLearning = () => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/courses");
    } else {
      setAuthType("signin");
    }
  };

  return (
    <div className="landing-page">
      <Navbar onAuthOpen={setAuthType} />
      <div className="hero-section">
        <h1>Welcome to EdTechBook</h1>
        <p>Upgrade your skills with world-class courses.</p>
        <button onClick={handleStartLearning}>Start Learning Today</button>
      </div>

      {authType && (
        <AuthModal
          type={authType}
          onClose={() => setAuthType(null)}
          onSwitch={(newType) => setAuthType(newType)}
        />
      )}
      <LandingPreviewCourses />
      <LandingPreviewLessons />
      <Footer />
    </div>
  );
}

export default Landing;
