import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

function Rescue() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    reporterName: "",
    phone: "",
    location: "",
    condition: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/rescue`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setForm({ reporterName: "", phone: "", location: "", condition: "" });
      } else {
        setErrorMsg(data.message || "Unable to submit rescue alert.");
      }
    } catch {
      setErrorMsg("Backend connection error. Call +91 81401 89202 immediately.");
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

          <span style={{ fontSize: "12.5px", fontWeight: "800", color: "#dc2626" }}>
            🚑 ACTIVE AMBULANCE UNIT: SURAT & GUJARAT
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))", gap: "20px", alignItems: "start", marginBottom: "24px" }}>
          <div style={{ background: "#ffffff", borderRadius: "4px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", overflow: "hidden" }}>
            <div style={{ background: "#dc2626", color: "#ffffff", padding: "14px 20px", fontWeight: "800", fontSize: "15px" }}>
              🚑 DISPATCH EMERGENCY DOG AMBULANCE (SURAT & GUJARAT)
            </div>

            <div style={{ padding: "24px" }}>
              {success && (
                <div style={{ background: "#ecfdf5", border: "1px solid #10b981", color: "#065f46", padding: "14px", borderRadius: "4px", marginBottom: "16px", fontSize: "13.5px" }}>
                  ✅ Rescue Alert Sent! Our ambulance driver and Admin ERP have received your location.
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
                      placeholder="Enter your name"
                      value={form.reporterName}
                      onChange={(e) => setForm({ ...form, reporterName: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#4b5563", marginBottom: "5px" }}>CONTACT NUMBER *</label>
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
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#4b5563", marginBottom: "5px" }}>EXACT LANDMARK / STREET LOCATION *</label>
                  <input
                    style={inputStyle}
                    placeholder="e.g. Near Dindoli Bridge, Surat"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#4b5563", marginBottom: "5px" }}>INJURY / CONDITION DETAILS *</label>
                  <textarea
                    rows="3"
                    style={inputStyle}
                    placeholder="Describe injury, bleeding, accident, or trapped puppy..."
                    value={form.condition}
                    onChange={(e) => setForm({ ...form, condition: e.target.value })}
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
                    background: "#dc2626",
                    color: "#ffffff",
                    fontWeight: "800",
                    fontSize: "15px",
                    cursor: "pointer",
                  }}
                >
                  {loading ? "DISPATCHING..." : "SEND EMERGENCY RESCUE ALERT"}
                </button>
              </form>
            </div>
          </div>

          <div style={{ background: "#ffffff", borderRadius: "4px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", padding: "24px" }}>
            <div style={{ background: "#131921", color: "#ffffff", padding: "18px", borderRadius: "4px", marginBottom: "18px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
              <div>
                <div style={{ fontSize: "11px", color: "#febd69", fontWeight: "800" }}>24/7 EMERGENCY HELPLINE</div>
                <div style={{ fontSize: "26px", fontWeight: "800", margin: "4px 0" }}>+91 81401 89202</div>
                <div style={{ fontSize: "13px", color: "#cbd5e1" }}>Surat, Gujarat • Rapid Trauma Response</div>
              </div>
              <a
                href="tel:+918140189202"
                style={{ background: "#febd69", color: "#111827", padding: "10px 16px", borderRadius: "4px", fontWeight: "800", fontSize: "13px", textDecoration: "none" }}
              >
                📞 Call Now
              </a>
            </div>

            <h3 style={{ margin: "0 0 10px", fontSize: "16px", fontWeight: "800" }}>First-Aid Guidelines Before Ambulance Arrives:</h3>
            <ul style={{ paddingLeft: "18px", color: "#475569", fontSize: "14px", lineHeight: "1.8", margin: 0 }}>
              <li>Move the injured dog away from traffic if safe.</li>
              <li>Provide clean water in a shallow bowl.</li>
              <li>Do not give human medicines (Paracetamol/Ibuprofen are toxic).</li>
              <li>Keep your mobile phone reachable for driver coordination.</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Rescue;