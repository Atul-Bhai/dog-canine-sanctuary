import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./navbar.css";

function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  const isLoggedIn = !!user && localStorage.getItem("isLoggedIn") === "true";
  const isAdmin =
    user?.role === "admin" || localStorage.getItem("userRole") === "admin";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  const navLinks = [
    { name: "All Dogs (Home)", path: "/" },
    { name: "Free Adoption", path: "/adoption" },
    { name: "Diet & Vet Care", path: "/care" },
    { name: "24/7 Rescue", path: "/rescue" },
    { name: "Sponsor & Donate", path: "/donate" },
    { name: "Volunteer", path: "/volunteer" },
    { name: "About Sanctuary", path: "/about" },
    { name: "Contact Desk", path: "/contact" },
  ];

  return (
    <header className="amz-header">
      {/* TOP BAR */}
      <div className="amz-top-bar">
        <div className="amz-left-cluster">
          {/* DIRECT BUILT-IN BACK BUTTON ON ALL INNER PAGES */}
          {location.pathname !== "/" && (
            <button
              type="button"
              onClick={handleBack}
              className="amz-back-btn"
              title="Go Back"
            >
              ← Back
            </button>
          )}

          <Link to="/" className="amz-logo">
            <img src="/logo.jpeg" alt="Dog Canine Sanctuary" />
            <div>
              <div className="amz-logo-title">DogCanine</div>
              <div className="amz-logo-sub">.SANCTUARY</div>
            </div>
          </Link>
        </div>

        <div className="amz-location">
          <span>📍 Rescue & Adoption Hub</span>
          <strong>Surat, Gujarat 394210</strong>
        </div>

        <form className="amz-search-form" onSubmit={handleSearchSubmit}>
          <span className="amz-search-tag">All Breeds</span>
          <input
            type="text"
            className="amz-search-input"
            placeholder="Search Labrador, Indie, Golden Retriever, Puppies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="amz-search-btn" title="Search">
            🔍
          </button>
        </form>

        <div className="amz-right-actions">
          {isLoggedIn ? (
            <>
              <div className="amz-action-box">
                <span>Hello, {user?.name?.split(" ")[0] || "Member"}</span>
                <strong>{isAdmin ? "Admin Account" : "Supporter"}</strong>
              </div>

              {isAdmin && (
                <Link to="/admin" className="amz-admin-pill">
                  ♛ Admin ERP
                </Link>
              )}

              <button
                type="button"
                onClick={handleLogout}
                className="amz-logout-btn"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="amz-action-box">
                <span>Hello, Sign in</span>
                <strong>Account & Adoption</strong>
              </Link>
              <Link to="/signup" className="amz-admin-pill">
                Sign Up
              </Link>
            </>
          )}

          <Link to="/donate" className="amz-action-box">
            <span>❤️ Support</span>
            <strong>₹500 Meal</strong>
          </Link>
        </div>
      </div>

      {/* BOTTOM NAVIGATION BAR */}
      <div className="amz-sub-bar">
        <div className="amz-sub-links">
          {navLinks.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`amz-sub-link ${
                location.pathname === item.path ? "active" : ""
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="amz-helpline-badge">
          🚑 24/7 Rescue: +91 81401 89202
        </div>
      </div>
    </header>
  );
}

export default Navbar;