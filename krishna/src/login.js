import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./login.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

function Login() {
  const navigate = useNavigate();

  const [loginMode, setLoginMode] = useState("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleModeSwitch = (mode) => {
    setLoginMode(mode);
    setError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    const endpoint =
      loginMode === "admin"
        ? `${API_URL}/api/auth/admin-login`
        : `${API_URL}/api/auth/login`;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: cleanEmail,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "Invalid email or password.");
        setLoading(false);
        return;
      }

      const token = data.token;
      const user = data.user;

      if (!token || !user) {
        setError("Login successful but authentication data is missing.");
        setLoading(false);
        return;
      }

      const isAdmin = String(user.role).toLowerCase() === "admin";

      if (loginMode === "admin" && !isAdmin) {
        setError("Access Denied: Only authorized Admins can login here.");
        setLoading(false);
        return;
      }

      localStorage.clear();

      localStorage.setItem("token", token);
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userEmail", user.email);
      localStorage.setItem("userRole", isAdmin ? "admin" : "user");
      localStorage.setItem("isAdmin", isAdmin ? "true" : "false");
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: user.id,
          name: user.name,
          email: user.email,
          role: isAdmin ? "admin" : "user",
          isAdmin,
        })
      );

      // Enterprise Auto-Redirect: Admin goes straight to /admin workspace
      if (isAdmin) {
        navigate("/admin", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (err) {
      console.error("Login request error:", err);
      setError("Unable to connect to server. Please make sure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-image-side">
        <div className="auth-image-overlay">
          <Link to="/" className="auth-logo">
            <img
              src="/logo.jpeg"
              alt="Dog Canine Sanctuary"
              style={{
                width: "80px",
                height: "80px",
                objectFit: "contain",
                borderRadius: "50%",
              }}
            />
            <div>
              <strong>Dog Canine</strong>
              <span>Sanctuary</span>
            </div>
          </Link>

          <div className="auth-message">
            <span>
              {loginMode === "admin"
                ? "🛡️ Restricted Admin Portal"
                : "🐾 Welcome Back"}
            </span>

            <h1>
              {loginMode === "admin" ? (
                <>
                  Sanctuary Control
                  <strong>Admin Access Only.</strong>
                </>
              ) : (
                <>
                  Give Every Dog
                  <strong>A Second Chance.</strong>
                </>
              )}
            </h1>

            <p>
              {loginMode === "admin"
                ? "Authorized staff & administrators only. Manage veterinary doctors, diet charts, adoptions, rescue reports, and sanctuary operations."
                : "Together, we can rescue, care for and find loving forever homes for dogs who need them most."}
            </p>
          </div>
        </div>
      </div>

      <div className="auth-form-side">
        <div className="auth-card">
          <button
            type="button"
            onClick={() => navigate(-1)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: "transparent",
              border: "none",
              color: "#6b7280",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              padding: "0 0 12px 0",
            }}
          >
            ← Back
          </button>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "8px",
              background: "#f3f4f6",
              padding: "5px",
              borderRadius: "12px",
              marginBottom: "18px",
            }}
          >
            <button
              type="button"
              onClick={() => handleModeSwitch("user")}
              style={{
                padding: "10px",
                borderRadius: "9px",
                border: "none",
                fontWeight: "600",
                fontSize: "13px",
                cursor: "pointer",
                background: loginMode === "user" ? "#ffffff" : "transparent",
                color: loginMode === "user" ? "#111827" : "#6b7280",
                boxShadow:
                  loginMode === "user" ? "0 2px 6px rgba(0,0,0,0.08)" : "none",
              }}
            >
              👤 User Login
            </button>

            <button
              type="button"
              onClick={() => handleModeSwitch("admin")}
              style={{
                padding: "10px",
                borderRadius: "9px",
                border: "none",
                fontWeight: "600",
                fontSize: "13px",
                cursor: "pointer",
                background: loginMode === "admin" ? "#d97706" : "transparent",
                color: loginMode === "admin" ? "#ffffff" : "#6b7280",
                boxShadow:
                  loginMode === "admin" ? "0 2px 8px rgba(217,119,6,0.3)" : "none",
              }}
            >
              🛡️ Admin Only
            </button>
          </div>

          <div className="auth-card-header">
            <span className="auth-small-title">
              {loginMode === "admin" ? "ADMINISTRATION" : "WELCOME BACK"}
            </span>

            <h2>
              {loginMode === "admin"
                ? "Admin Portal Login"
                : "Login to your account"}
            </h2>

            <p>
              {loginMode === "admin"
                ? "Only authorized admin emails can sign in here."
                : "Continue your journey with Dog Canine Sanctuary."}
            </p>
          </div>

          {error && (
            <div className="auth-error">
              <strong>Login failed</strong>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>
                {loginMode === "admin" ? "Admin Email Address" : "Email Address"}
              </label>

              <div className="input-wrapper">
                <span>✉️</span>
                <input
                  type="email"
                  placeholder={
                    loginMode === "admin"
                      ? "Enter authorized admin email"
                      : "Enter your email"
                  }
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group">
              <div className="password-label-row">
                <label>Password</label>
                <Link to="/forgot-password">Forgot Password?</Link>
              </div>

              <div className="input-wrapper">
                <span>🔒</span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="show-password"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <label className="remember-row">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
            >
              {loading
                ? "Verifying..."
                : loginMode === "admin"
                ? "Login as Admin"
                : "Login to Account"}
              <span>→</span>
            </button>
          </form>

          {loginMode === "user" && (
            <div className="auth-bottom">
              <span>Don't have an account?</span>
              <Link to="/signup">Create Account</Link>
            </div>
          )}

          <Link to="/" className="back-home">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;