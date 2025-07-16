// src/components/AuthModal.jsx

import { useState } from "react";
import "./AuthModal.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AuthModal({ type, onClose, onSwitch }) {
  const [form, setForm] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [mode, setMode] = useState(type); // track internal mode: 'signin' | 'signup'

  const isSignup = mode === "signup";

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/user/${
          isSignup ? "signup" : "signin"
        }`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        const message = data.message || "An error occurred.";

        // Show toast
        message.split(",").forEach((msg) => {
          toast.error(msg.trim());
        });

        // Also keep showing error text inline (optional)
        setError(message);
        return;
      }

      if (isSignup) {
        // Auto-switch to login with success message
        setMode("signin");
        setSuccess("Successfully signed up! Please log in.");
        setForm({ ...form, password: "", firstName: "", lastName: "" }); // reset signup-specific fields
        return;
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
        window.location.href = "/courses";
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="auth-modal-overlay">
      <div className="auth-modal">
        <button className="close-button" onClick={onClose}>
          ✕
        </button>
        <h2>{isSignup ? "Sign Up" : "Sign In"}</h2>

        {success && <p className="auth-success">{success}</p>}
        {error && <p className="auth-error">{error}</p>}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />

        {isSignup && (
          <>
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={form.firstName}
              onChange={handleChange}
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={form.lastName}
              onChange={handleChange}
            />
          </>
        )}

        {!isSignup && (
          <div className="forgot-password">
            <button type="button" className="link-style">
              Forgot Password?
            </button>
          </div>
        )}

        <button className="submit-button" onClick={handleSubmit}>
          {isSignup ? "Register" : "Login"}
        </button>

        <div className="switch-auth">
          <button
            className="link-style"
            onClick={() => {
              setMode(isSignup ? "signin" : "signup");
              setError("");
              setSuccess("");
              onSwitch(isSignup ? "signin" : "signup");
            }}
          >
            {isSignup ? "Switch to Sign In" : "Switch to Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuthModal;
