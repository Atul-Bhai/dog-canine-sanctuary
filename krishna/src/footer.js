import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer style={{ width: "100%", marginTop: "auto", fontFamily: "Inter, system-ui, sans-serif" }}>
      {/* AMAZON / FLIPKART "BACK TO TOP" STRIP */}
      <button
        type="button"
        onClick={scrollToTop}
        style={{
          width: "100%",
          background: "#37475a",
          color: "#ffffff",
          border: "none",
          padding: "13px 16px",
          fontSize: "13px",
          fontWeight: "700",
          cursor: "pointer",
          display: "block",
          textAlign: "center",
        }}
      >
        ▲ Back to top
      </button>

      {/* MAIN 4-COLUMN E-COMMERCE FOOTER */}
      <div style={{ background: "#232f3e", color: "#dddddd", padding: "38px 24px" }}>
        <div
          style={{
            maxWidth: "1480px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "28px",
          }}
        >
          {/* COLUMN 1 */}
          <div>
            <h4 style={{ color: "#ffffff", fontSize: "15px", fontWeight: "800", margin: "0 0 12px" }}>
              Get to Know Us
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "8px", fontSize: "13.5px" }}>
              <li><Link to="/about" style={{ color: "#dddddd", textDecoration: "none" }}>About Dog Canine Sanctuary</Link></li>
              <li><Link to="/care" style={{ color: "#dddddd", textDecoration: "none" }}>Veterinary & Nutrition Standards</Link></li>
              <li><Link to="/volunteer" style={{ color: "#dddddd", textDecoration: "none" }}>Community Volunteer Program</Link></li>
              <li><Link to="/contact" style={{ color: "#dddddd", textDecoration: "none" }}>Surat Shelter & Visit Timings</Link></li>
            </ul>
          </div>

          {/* COLUMN 2 */}
          <div>
            <h4 style={{ color: "#ffffff", fontSize: "15px", fontWeight: "800", margin: "0 0 12px" }}>
              Adopt & Save a Life
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "8px", fontSize: "13.5px" }}>
              <li><Link to="/" style={{ color: "#dddddd", textDecoration: "none" }}>Browse Vaccinated Dogs</Link></li>
              <li><Link to="/adoption" style={{ color: "#dddddd", textDecoration: "none" }}>Zero-Fee Adoption Application</Link></li>
              <li><Link to="/rescue" style={{ color: "#dddddd", textDecoration: "none" }}>24/7 Emergency Dog Ambulance</Link></li>
              <li><Link to="/care" style={{ color: "#dddddd", textDecoration: "none" }}>Toxic Foods & First-Aid Guide</Link></li>
            </ul>
          </div>

          {/* COLUMN 3 */}
          <div>
            <h4 style={{ color: "#ffffff", fontSize: "15px", fontWeight: "800", margin: "0 0 12px" }}>
              Sponsor & Transparency
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "8px", fontSize: "13.5px" }}>
              <li><Link to="/donate" style={{ color: "#dddddd", textDecoration: "none" }}>Sponsor ₹250 Weekly Kibble</Link></li>
              <li><Link to="/donate" style={{ color: "#dddddd", textDecoration: "none" }}>Sponsor ₹500 Vaccination</Link></li>
              <li><Link to="/donate" style={{ color: "#dddddd", textDecoration: "none" }}>Direct UPI: 8140189202@ybl</Link></li>
              <li><Link to="/admin" style={{ color: "#febd69", textDecoration: "none", fontWeight: "700" }}>Sanctuary Admin ERP Portal</Link></li>
            </ul>
          </div>

          {/* COLUMN 4: 24/7 HELPLINE BOX */}
          <div style={{ background: "#131921", padding: "18px", borderRadius: "6px", border: "1px solid #37475a" }}>
            <span style={{ color: "#febd69", fontSize: "11px", fontWeight: "800", letterSpacing: "0.5px" }}>
              🚑 24/7 EMERGENCY RESCUE DESK
            </span>
            <div style={{ color: "#ffffff", fontSize: "20px", fontWeight: "800", margin: "6px 0" }}>
              +91 81401 89202
            </div>
            <div style={{ fontSize: "12.5px", color: "#cbd5e1", marginBottom: "8px" }}>
              📍 Surat, Gujarat, India • Open 24 Hours
            </div>
            <div style={{ fontSize: "12px", color: "#94a3b8" }}>
              ✉️ atul7179@gmail.com
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM COPYRIGHT BAR */}
      <div style={{ background: "#131921", color: "#94a3b8", padding: "16px 20px", textAlign: "center", fontSize: "12.5px", borderTop: "1px solid #37475a" }}>
        © 2026 <strong>DogCanine.Sanctuary</strong> — Verified Animal Rescue, Veterinary Care & Zero-Fee Adoption Portal (Surat, Gujarat). All Rights Reserved.
      </div>
    </footer>
  );
}

export default Footer;