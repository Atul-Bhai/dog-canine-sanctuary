import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./signup.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

function Signup() {
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const signup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(e.target);

    const payload = {
      name: form.get("name"),
      email: form.get("email"),
      password: form.get("password"),
    };

    try {
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setError(result.message || "Unable to create your account.");
        return;
      }

      const { token, user } = result;
      if (token && user) {
        const isAdmin = String(user.role).toLowerCase() === "admin";
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

        navigate(isAdmin ? "/admin" : "/", { replace: true });
      } else {
        navigate("/login", { replace: true });
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError("Unable to connect to server. Please make sure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="signup-page">
      <div className="signup-orb signup-orb-one"></div>
      <div className="signup-orb signup-orb-two"></div>

      <div className="signup-wrapper">
        <div className="signup-brand-panel">
          <Link to="/" className="signup-brand-logo">
            <img src="/logo.jpeg" alt="Dog Canine Sanctuary" />
          </Link>

          <div className="signup-brand-name">DOG CANINE</div>
          <div className="signup-brand-subtitle">SANCTUARY</div>
          <div className="signup-divider"></div>

          <h1>
            Give a Dog
            <br />
            <span>A Second Chance.</span>
          </h1>

          <p>
            Become part of a caring community helping rescued dogs find safety,
            love and forever families.
          </p>

          <div className="signup-stats">
            <div>
              <strong>350+</strong>
              <span>Dogs Rescued</span>
            </div>

            <div>
              <strong>120+</strong>
              <span>Happy Adoptions</span>
            </div>

            <div>
              <strong>24/7</strong>
              <span>Care & Support</span>
            </div>
          </div>
        </div>

        <div className="signup-form-panel">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
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
                padding: 0,
              }}
            >
              ← Back
            </button>

            <Link
              to="/"
              style={{
                fontSize: "13px",
                color: "#d97706",
                fontWeight: "600",
                textDecoration: "none",
              }}
            >
              Home
            </Link>
          </div>

          <div className="signup-top-icon">🐾</div>
          <div className="signup-eyebrow">JOIN OUR COMMUNITY</div>

          <h2>
            Create Your
            <span> Account</span>
          </h2>

          <p className="signup-description">
            Start your journey with Dog Canine Sanctuary.
          </p>

          {error && (
            <div className="signup-error">
              <div className="signup-error-icon">!</div>
              <div>
                <strong>Signup failed</strong>
                <p>{error}</p>
              </div>
            </div>
          )}

          <form className="signup-form" onSubmit={signup}>
            <div className="signup-field">
              <label htmlFor="signup-name">Full Name</label>
              <div className="signup-input">
                <span>👤</span>
                <input
                  id="signup-name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  autoComplete="name"
                  required
                />
              </div>
            </div>

            <div className="signup-field">
              <label htmlFor="signup-email">Email Address</label>
              <div className="signup-input">
                <span>✉️</span>
                <input
                  id="signup-email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="signup-field">
              <label htmlFor="signup-password">Password</label>
              <div className="signup-input">
                <span>🔒</span>
                <input
                  id="signup-password"
                  name="password"
                  type="password"
                  placeholder="Create a password (min 6 chars)"
                  autoComplete="new-password"
                  minLength={6}
                  required
                />
              </div>
            </div>

            <label className="signup-terms">
              <input type="checkbox" required />
              <span>I agree to join the Dog Canine Sanctuary community.</span>
            </label>

            <button
              type="submit"
              className="signup-submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="signup-spinner"></span>
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <span>→</span>
                </>
              )}
            </button>
          </form>

          <div className="signup-login-link">
            <span>Already have an account?</span>
            <Link to="/login">Login →</Link>
          </div>

          <div className="signup-security">
            🔐 Your information is securely protected
          </div>
        </div>
      </div>
    </section>
  );
}

export default Signup;