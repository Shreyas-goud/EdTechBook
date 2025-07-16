import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar({ onAuthOpen }) {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/");
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-title" onClick={() => navigate("/")}>
          EdTechBook
        </div>
        <div
          className="navbar-center-1"
          onClick={() => navigate("/courses")}
          style={{ cursor: "pointer" }}
        >
          Courses
        </div>

        <div
          className="navbar-menu"
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          ☰
        </div>
        {isMenuOpen && (
          <div className="dropdown">
            {!isAuthenticated ? (
              <>
                <div onClick={() => onAuthOpen("signup")}>Sign Up</div>
                <div onClick={() => onAuthOpen("signin")}>Sign In</div>
              </>
            ) : (
              <div onClick={handleLogout}>Logout</div>
            )}
          </div>
        )}
      </nav>
    </>
  );
}

export default Navbar;
