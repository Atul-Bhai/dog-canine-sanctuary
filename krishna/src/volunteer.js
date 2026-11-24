import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

function Volunteer() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    activity: "Feeding & Kennel Care",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/volunteer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setForm({ name: "", email: "", phone: "", activity: "Feeding & Kennel Care" });
      } else {
        setErrorMsg(data.message || "Failed to register.");
      }
    } catch {
      setErrorMsg("Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "11px 13px",
    borderRadius: "4px",
    border: "1px solid #d1d5db",
    fontSize: "14px",
    boxSizing: "border-box",
    background: "#ffffff",
  };

  return (
    <main style={{ background: "#f1f3f6", paddingTop: "108px", paddingBottom: "28px", fontFamily: "Inter, system-ui, sans-serif" }}>
      <div style={{ width: "100%", maxWidth: "1520px", margin: "0 auto", padding: "0 20px" }}>
        {/* ONLY CLEAN BACK BUTTON */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
          <button
            type="button"
            onClick={() => navigate(-1)}
            style={{
              background: "#ffffff",
              border: "1px solid #cbd5e1",
              color: "#111827",
              padding: "6px 14px",
              borderRadius: "4px",
              fontSize: "13px",
              fontWeight: "700",
              cursor: "pointer",
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
            }}
          >
            ← Back
          </button>

          <span style={{ fontSize: "12.5px", fontWeight: "700", color: "#2874f0" }}>
            🤝 100+ Active Volunteers in Surat
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))", gap: "20px", alignItems: "start" }}>
          <div style={{ background: "#ffffff", borderRadius: "4px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", overflow: "hidden" }}>
            <div style={{ background: "#2874f0", color: "#ffffff", padding: "14px 20px", fontWeight: "800", fontSize: "15px" }}>
              🤝 SANCTUARY VOLUNTEER ENROLLMENT FORM
            </div>

            <div style={{ padding: "24px" }}>
              {success && (
                <div style={{ background: "#ecfdf5", border: "1px solid #10b981", color: "#065f46", padding: "14px", borderRadius: "4px", marginBottom: "16px", fontSize: "13.5px" }}>
                  🎉 Registration Submitted! Our team will review your profile and assign a shift soon.
                </div>
              )}

              {errorMsg && (
                <div style={{ background: "#fee2e2", color: "#b91c1c", padding: "10px 12px", borderRadius: "4px", marginBottom: "14px", fontSize: "13px" }}>
                  ⚠️ {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: "grid", gap: "14px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#4b5563", marginBottom: "5px" }}>FULL NAME *</label>
                  <input
                    style={inputStyle}
                    placeholder="Enter your full name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#4b5563", marginBottom: "5px" }}>EMAIL ADDRESS *</label>
                    <input
                      type="email"
                      style={inputStyle}
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#4b5563", marginBottom: "5px" }}>MOBILE NUMBER *</label>
                    <input
                      type="tel"
                      style={inputStyle}
                      placeholder="+91 98765 43210"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#4b5563", marginBottom: "5px" }}>SELECT VOLUNTEER ROLE *</label>
                  <select
                    style={inputStyle}
                    value={form.activity}
                    onChange={(e) => setForm({ ...form, activity: e.target.value })}
                  >
                    <option value="Feeding & Kennel Care">🍽️ Feeding & Kennel Care</option>
                    <option value="Dog Walking & Socialization">🐕 Dog Walking & Socialization</option>
                    <option value="Medical & Vet Assistance">🩺 Medical & Vet Assistance</option>
                    <option value="Emergency Rescue Transport">🚑 Emergency Rescue Transport</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: "14px",
                    borderRadius: "3px",
                    border: "none",
                    background: "#fb641b",
                    color: "#ffffff",
                    fontWeight: "800",
                    fontSize: "15px",
                    cursor: "pointer",
                  }}
                >
                  {loading ? "SUBMITTING..." : "REGISTER AS VOLUNTEER"}
                </button>
              </form>
            </div>
          </div>

          <div style={{ background: "#ffffff", borderRadius: "4px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", padding: "24px" }}>
            <h2 style={{ margin: "0 0 12px", fontSize: "18px", fontWeight: "800", color: "#212121" }}>
              Available Sanctuary Volunteer Shifts
            </h2>
            <div style={{ display: "grid", gap: "12px" }}>
              <div style={{ background: "#f8fafc", padding: "14px", borderRadius: "4px", border: "1px solid #e2e8f0" }}>
                <strong style={{ color: "#2874f0" }}>🍽️ Morning Feeding Shift (7:30 AM – 10:30 AM)</strong>
                <p style={{ margin: "4px 0 0", fontSize: "13.5px", color: "#475569" }}>Assist kennel boys in preparing puppy starter kibble, boiled rice, and clean water bowls.</p>
              </div>
              <div style={{ background: "#f8fafc", padding: "14px", borderRadius: "4px", border: "1px solid #e2e8f0" }}>
                <strong style={{ color: "#388e3c" }}>🐕 Evening Walk & Socialization (4:30 PM – 6:30 PM)</strong>
                <p style={{ margin: "4px 0 0", fontSize: "13.5px", color: "#475569" }}>Help shy rescued dogs build confidence and trust with humans before adoption.</p>
              </div>
              <div style={{ background: "#f8fafc", padding: "14px", borderRadius: "4px", border: "1px solid #e2e8f0" }}>
                <strong style={{ color: "#d97706" }}>🩺 Weekend Vet Camp & Grooming (Sundays)</strong>
                <p style={{ margin: "4px 0 0", fontSize: "13.5px", color: "#475569" }}>Support Dr. Aarav Sharma and Dr. Priya Nair during anti-tick baths and vaccination drives.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Volunteer;