// src/components/CoursesNavbar.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CoursesNavbar.css";

function CoursesNavbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;
  const [message, setMessage] = useState("");

  useEffect(() => {
    const handler = (e) => {
      if (e.detail?.type === "signin") {
        window.dispatchEvent(
          new CustomEvent("open-auth-modal", { detail: { type: "signin" } })
        );
      }
    };
    window.addEventListener("open-auth-modal", handler);
    return () => window.removeEventListener("open-auth-modal", handler);
  }, []);

  const handleIconClick = () => {
    if (isLoggedIn) {
      localStorage.removeItem("token");
      navigate("/"); // Redirect to landing
      setTimeout(() => window.location.reload(), 100);
    } else {
      window.dispatchEvent(
        new CustomEvent("open-auth-modal", { detail: { type: "signin" } })
      );
    }
  };

  const handleCoursesClick = () => {
    if (isLoggedIn) {
      navigate("/my-courses");
    } else {
      setMessage("Please login and purchase a course first.");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <nav className="courses-navbar">
      <div className="navbar-title" onClick={() => navigate("/")}>
        EdTechBook
      </div>

      <div className="navbar-center" onClick={handleCoursesClick}>
        Courses
      </div>

      <div className="navbar-user-icon" onClick={handleIconClick}>
        👤 {isLoggedIn ? "Logout" : "Login"}
      </div>

      {message && <div className="inline-message">{message}</div>}
    </nav>
  );
}

export default CoursesNavbar;
