import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./ForgotPassword.css";

const API_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000";

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match. Please re-enter.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          newPassword,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setError(result.message || "Unable to reset password.");
        return;
      }

      setMessage(
        result.message ||
          "Password reset successfully! Redirecting to login..."
      );
      setNewPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 2000);
    } catch (err) {
      console.error("Forgot password error:", err);
      setError("Unable to connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="forgot-page">
      <div className="forgot-decoration forgot-decoration-one" />
      <div className="forgot-decoration forgot-decoration-two" />

      <div className="forgot-wrapper">
        {/* LEFT BRAND PANEL */}
        <div className="forgot-brand">
          <Link to="/" className="forgot-logo-box">
            <img src="/logo.jpeg" alt="Dog Canine Sanctuary" />
          </Link>

          <div className="forgot-brand-name">DOG CANINE</div>
          <div className="forgot-brand-subtitle">SANCTUARY</div>
          <div className="forgot-line" />

          <h1>
            Don't worry.
            <br />
            We've got
            <span> you.</span>
          </h1>

          <p>
            Reset your password securely and get back to your Dog Canine
            Sanctuary account.
          </p>

          <div className="forgot-brand-points">
            <div>
              <span>🐾</span>
              <strong>Safe & Secure</strong>
            </div>

            <div>
              <span>🔐</span>
              <strong>Protected Account</strong>
            </div>

            <div>
              <span>❤️</span>
              <strong>Dog-Loving Community</strong>
            </div>
          </div>
        </div>

        {/* FORM PANEL */}
        <div className="forgot-card">
          {/* TOP BACK ARROW */}
          <button
            type="button"
            onClick={() => navigate("/login")}
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
            ← Back to Login
          </button>

          <div className="forgot-icon">🔑</div>

          <div className="forgot-eyebrow">ACCOUNT RECOVERY</div>

          <h2>
            Reset Your
            <span> Password</span>
          </h2>

          <p className="forgot-description">
            Enter your registered email address and choose a new password.
          </p>

          {error && (
            <div className="forgot-alert forgot-alert-error">
              <span>!</span>
              <div>
                <strong>Something went wrong</strong>
                <p>{error}</p>
              </div>
            </div>
          )}

          {message && (
            <div className="forgot-alert forgot-alert-success">
              <span>✓</span>
              <div>
                <strong>Success</strong>
                <p>{message}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <label htmlFor="forgot-email">Registered Email Address</label>
            <div className="forgot-input">
              <span>✉</span>
              <input
                id="forgot-email"
                type="email"
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <label htmlFor="forgot-new-pass" style={{ marginTop: "12px" }}>
              New Password
            </label>
            <div className="forgot-input">
              <span>🔒</span>
              <input
                id="forgot-new-pass"
                type="password"
                placeholder="Enter new password (min 6 chars)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                minLength={6}
                required
              />
            </div>

            <label htmlFor="forgot-confirm-pass" style={{ marginTop: "12px" }}>
              Confirm New Password
            </label>
            <div className="forgot-input">
              <span>🛡️</span>
              <input
                id="forgot-confirm-pass"
                type="password"
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                minLength={6}
                required
              />
            </div>

            <button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="forgot-spinner" />
                  Updating Password...
                </>
              ) : (
                <>
                  Reset Password
                  <span>→</span>
                </>
              )}
            </button>
          </form>

          <div className="forgot-back">
            Remember your password?
            <Link to="/login">Back to Login →</Link>
          </div>

          <div className="forgot-security">
            🔒 Your account information is protected
          </div>
        </div>
      </div>
    </section>
  );
}

export default ForgotPassword;