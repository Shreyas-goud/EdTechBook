// src/components/Footer.jsx
import React from "react";
import "./Footer.css";
import {
  FaTwitter,
  FaLinkedin,
  FaGithub,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Left Section */}
        <div className="footer-left">
          <h2>EdTechBook</h2>
          <p className="footer-description">
            Your go-to platform for tech courses.
          </p>
          <p className="footer-year">© 2025 . Hyd, India.</p>
        </div>

        {/* Center Section */}
        <div className="footer-center">
          <div className="footer-icons">
            <a href="https://x.com">
              <FaTwitter />
            </a>
            <a href="https://linkedin.com">
              <FaLinkedin />
            </a>
            <a href="github.com">
              <FaGithub />
            </a>
          </div>
          <p className="footer-msg">All services are online</p>
        </div>

        {/* Right Section */}
        <div className="footer-right">
          <h3>Contact Us</h3>
          <p className="footer-phone">
            <FaPhoneAlt className="icon" /> +91 12345 67890
          </p>
          <p className="footer-email">
            <FaEnvelope className="icon" /> edtechbook.in
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
