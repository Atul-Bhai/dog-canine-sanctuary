import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

function Login() {
  const navigate = useNavigate();

  const [loginMode, setLoginMode] = useState("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title =
      loginMode === "admin"
        ? "Admin Portal | Dog Canine Sanctuary"
        : "Login | Dog Canine Sanctuary";
  }, [loginMode]);

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
      localStorage.setItem("rememberMe", rememberMe ? "true" : "false");
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
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
        background: "#f8fafc",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Left Brand / Hero Section */}
      <div
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #92400e 100%)",
          color: "#ffffff",
          padding: "40px 32px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div>
          <Link
            to="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "12px",
              textDecoration: "none",
              color: "#ffffff",
              marginBottom: "36px",
            }}
          >
            <img
              src="/logo.jpeg"
              alt="Dog Canine Sanctuary Logo"
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid #f59e0b",
                background: "#ffffff",
              }}
            />
            <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.15 }}>
              <strong style={{ fontSize: "18px", fontWeight: 700 }}>
                Dog Canine
              </strong>
              <span style={{ fontSize: "13px", color: "#fbbf24", fontWeight: 500 }}>
                Sanctuary • Care & Rescue
              </span>
            </div>
          </Link>

          <div
            style={{
              display: "inline-block",
              padding: "6px 12px",
              borderRadius: "999px",
              background: "rgba(255, 255, 255, 0.12)",
              fontSize: "13px",
              marginBottom: "18px",
            }}
          >
            {loginMode === "admin"
              ? "🛡️ Restricted Admin Portal"
              : "🐾 Welcome Back"}
          </div>

          <h1
            style={{
              fontSize: "clamp(28px, 4vw, 42px)",
              lineHeight: 1.2,
              margin: "0 0 16px 0",
              fontWeight: 800,
            }}
          >
            {loginMode === "admin" ? (
              <>
                Sanctuary Control{" "}
                <span style={{ color: "#fbbf24" }}>Admin Access Only.</span>
              </>
            ) : (
              <>
                Give Every Dog{" "}
                <span style={{ color: "#fbbf24" }}>A Second Chance.</span>
              </>
            )}
          </h1>

          <p
            style={{
              fontSize: "15px",
              lineHeight: 1.65,
              color: "#e2e8f0",
              maxWidth: "460px",
              margin: 0,
            }}
          >
            {loginMode === "admin"
              ? "Authorized staff & administrators only. Manage veterinary doctors, diet charts, adoptions, rescue reports, and sanctuary operations."
              : "Together, we can rescue, care for and find loving forever homes for dogs who need them most."}
          </p>
        </div>

        <div
          style={{
            marginTop: "32px",
            paddingTop: "16px",
            borderTop: "1px solid rgba(255,255,255,0.15)",
            fontSize: "13px",
            color: "#cbd5e1",
          }}
        >
          Dog Canine Sanctuary • ASK Team
        </div>
      </div>

      {/* Right Login Form Section */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "32px 20px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "430px",
            background: "#ffffff",
            borderRadius: "16px",
            padding: "28px",
            boxShadow: "0 12px 32px rgba(15, 23, 42, 0.08)",
            border: "1px solid #e2e8f0",
          }}
        >
          <button
            type="button"
            onClick={() => navigate(-1)}
            style={{
              background: "transparent",
              border: "none",
              color: "#64748b",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
              padding: "0 0 14px 0",
            }}
          >
            ← Back
          </button>

          {/* Role Switcher */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "8px",
              background: "#f1f5f9",
              padding: "5px",
              borderRadius: "12px",
              marginBottom: "20px",
            }}
          >
            <button
              type="button"
              onClick={() => handleModeSwitch("user")}
              style={{
                padding: "10px",
                borderRadius: "9px",
                border: "none",
                fontWeight: 600,
                fontSize: "13px",
                cursor: "pointer",
                background: loginMode === "user" ? "#ffffff" : "transparent",
                color: loginMode === "user" ? "#0f172a" : "#64748b",
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
                fontWeight: 600,
                fontSize: "13px",
                cursor: "pointer",
                background: loginMode === "admin" ? "#d97706" : "transparent",
                color: loginMode === "admin" ? "#ffffff" : "#64748b",
                boxShadow:
                  loginMode === "admin"
                    ? "0 4px 10px rgba(217, 119, 6, 0.25)"
                    : "none",
              }}
            >
              🛡️ Admin Only
            </button>
          </div>

          {/* Card Header */}
          <div style={{ marginBottom: "20px" }}>
            <div
              style={{
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.08em",
                color: "#d97706",
                marginBottom: "6px",
              }}
            >
              {loginMode === "admin" ? "ADMINISTRATION" : "WELCOME BACK"}
            </div>
            <h2
              style={{
                margin: "0 0 6px 0",
                fontSize: "24px",
                color: "#0f172a",
              }}
            >
              {loginMode === "admin"
                ? "Admin Portal Login"
                : "Login to your account"}
            </h2>
            <p style={{ margin: 0, fontSize: "14px", color: "#64748b" }}>
              {loginMode === "admin"
                ? "Only authorized admin emails can sign in here."
                : "Continue your journey with Dog Canine Sanctuary."}
            </p>
          </div>

          {/* Error Box */}
          {error && (
            <div
              style={{
                background: "#fef2f2",
                border: "1px solid #fecaca",
                color: "#b91c1c",
                padding: "12px",
                borderRadius: "10px",
                marginBottom: "16px",
                fontSize: "13px",
              }}
            >
              <strong>Login failed: </strong>
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: "14px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#334155",
                  marginBottom: "6px",
                }}
              >
                {loginMode === "admin" ? "Admin Email Address" : "Email Address"}
              </label>
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
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "11px 14px",
                  borderRadius: "10px",
                  border: "1px solid #cbd5e1",
                  fontSize: "14px",
                  outline: "none",
                }}
              />
            </div>

            <div style={{ marginBottom: "14px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "6px",
                }}
              >
                <label
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#334155",
                  }}
                >
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  style={{
                    fontSize: "12px",
                    color: "#d97706",
                    textDecoration: "none",
                    fontWeight: 600,
                  }}
                >
                  Forgot Password?
                </Link>
              </div>

              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  disabled={loading}
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "11px 42px 11px 14px",
                    borderRadius: "10px",
                    border: "1px solid #cbd5e1",
                    fontSize: "14px",
                    outline: "none",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "16px",
                  }}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "13px",
                color: "#475569",
                marginBottom: "18px",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Remember me</span>
            </label>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: "10px",
                border: "none",
                background: "#0f172a",
                color: "#ffffff",
                fontSize: "14px",
                fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading
                ? "Verifying..."
                : loginMode === "admin"
                ? "Login as Admin →"
                : "Login to Account →"}
            </button>
          </form>

          {loginMode === "user" && (
            <div
              style={{
                marginTop: "18px",
                textAlign: "center",
                fontSize: "13px",
                color: "#64748b",
              }}
            >
              <span>Don't have an account? </span>
              <Link
                to="/signup"
                style={{
                  color: "#d97706",
                  fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                Create Account
              </Link>
            </div>
          )}

          <div style={{ marginTop: "14px", textAlign: "center" }}>
            <Link
              to="/"
              style={{
                fontSize: "13px",
                color: "#475569",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;