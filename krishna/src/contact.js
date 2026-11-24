import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

function Contact() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setForm({ name: "", email: "", message: "" });
      } else {
        setErrorMsg(data.message || "Failed to send message.");
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

          <span style={{ fontSize: "12.5px", fontWeight: "700", color: "#388e3c" }}>
            📞 Direct Help Desk: +91 81401 89202
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))", gap: "20px", alignItems: "start" }}>
          <div style={{ background: "#ffffff", borderRadius: "4px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", padding: "24px", display: "grid", gap: "16px" }}>
            <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "800", color: "#212121" }}>Sanctuary Help Desk</h2>

            <div style={{ borderBottom: "1px solid #f0f0f0", paddingBottom: "12px" }}>
              <div style={{ fontSize: "11px", fontWeight: "800", color: "#878787" }}>HEADQUARTERS</div>
              <strong style={{ fontSize: "15px", color: "#212121" }}>Surat, Gujarat, India</strong>
            </div>

            <div style={{ borderBottom: "1px solid #f0f0f0", paddingBottom: "12px" }}>
              <div style={{ fontSize: "11px", fontWeight: "800", color: "#878787" }}>24/7 EMERGENCY & ADOPTION HELPLINE</div>
              <strong style={{ fontSize: "18px", color: "#2874f0" }}>+91 81401 89202</strong>
            </div>

            <div style={{ borderBottom: "1px solid #f0f0f0", paddingBottom: "12px" }}>
              <div style={{ fontSize: "11px", fontWeight: "800", color: "#878787" }}>SUPPORT EMAIL</div>
              <strong style={{ fontSize: "15px", color: "#212121" }}>atul7179@gmail.com</strong>
            </div>

            <div>
              <div style={{ fontSize: "11px", fontWeight: "800", color: "#878787" }}>OPERATING HOURS</div>
              <strong style={{ fontSize: "14.5px", color: "#388e3c" }}>Rescue: 24 Hours | Shelter Visits: 9 AM – 6 PM</strong>
            </div>
          </div>

          <div style={{ background: "#ffffff", borderRadius: "4px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", overflow: "hidden" }}>
            <div style={{ background: "#2874f0", color: "#ffffff", padding: "14px 20px", fontWeight: "800", fontSize: "15px" }}>
              ✉️ SEND AN INQUIRY TO SANCTUARY DESK
            </div>

            <div style={{ padding: "24px" }}>
              {success && (
                <div style={{ background: "#ecfdf5", border: "1px solid #10b981", color: "#065f46", padding: "14px", borderRadius: "4px", marginBottom: "16px", fontSize: "13.5px" }}>
                  ✅ Message sent! Our support team will reply shortly.
                </div>
              )}

              {errorMsg && (
                <div style={{ background: "#fee2e2", color: "#b91c1c", padding: "10px 12px", borderRadius: "4px", marginBottom: "14px", fontSize: "13px" }}>
                  ⚠️ {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: "grid", gap: "14px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#4b5563", marginBottom: "5px" }}>YOUR NAME *</label>
                    <input
                      style={inputStyle}
                      placeholder="Enter your full name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#4b5563", marginBottom: "5px" }}>YOUR EMAIL *</label>
                    <input
                      type="email"
                      style={inputStyle}
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#4b5563", marginBottom: "5px" }}>MESSAGE *</label>
                  <textarea
                    rows="4"
                    style={inputStyle}
                    placeholder="Write your query here..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    required
                  />
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
                  {loading ? "SENDING..." : "SUBMIT MESSAGE"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Contact;