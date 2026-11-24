import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

function Adoption() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedDog = searchParams.get("dog") || "";

  const [dogs, setDogs] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dog: preselectedDog,
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/api/dogs`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.dogs)) {
          const available = data.dogs.filter((d) => d.status === "Available");
          setDogs(available);
          if (!preselectedDog && available.length > 0) {
            setFormData((prev) => ({ ...prev, dog: available[0].name }));
          }
        }
      })
      .catch(() => {});
  }, [preselectedDog]);

  useEffect(() => {
    if (preselectedDog) {
      setFormData((prev) => ({ ...prev, dog: preselectedDog }));
    }
  }, [preselectedDog]);

  const selectedDogObj = dogs.find(
    (d) => d.name.toLowerCase() === formData.dog.toLowerCase()
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/adoption`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        setFormData({ name: "", email: "", phone: "", dog: dogs[0]?.name || "", message: "" });
      } else {
        setErrorMsg(data.message || "Failed to submit adoption request.");
      }
    } catch {
      setErrorMsg("Backend disconnected. Please ensure server is running on port 5000.");
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
            🛡️ 100% Verified Sanctuary Adoption • ₹0 Fee
          </span>
        </div>

        {/* 2-COLUMN CHECKOUT */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))", gap: "20px", alignItems: "start", marginBottom: "24px" }}>
          <div style={{ background: "#ffffff", borderRadius: "4px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", overflow: "hidden" }}>
            <div style={{ background: "#2874f0", color: "#ffffff", padding: "14px 20px", display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ background: "#ffffff", color: "#2874f0", fontWeight: "800", fontSize: "12px", padding: "2px 8px", borderRadius: "2px" }}>1</span>
              <strong style={{ fontSize: "15px" }}>ADOPTER & HOME VERIFICATION DETAILS</strong>
            </div>

            <div style={{ padding: "24px" }}>
              {submitted && (
                <div style={{ background: "#ecfdf5", border: "1px solid #10b981", color: "#065f46", padding: "14px", borderRadius: "4px", marginBottom: "16px", fontSize: "13.5px" }}>
                  <strong>✔ Adoption Request Placed!</strong> Our sanctuary team will call you within 24 hours for home verification.
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
                    <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#4b5563", marginBottom: "5px" }}>FULL NAME *</label>
                    <input
                      style={inputStyle}
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#4b5563", marginBottom: "5px" }}>MOBILE NUMBER *</label>
                    <input
                      type="tel"
                      style={inputStyle}
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#4b5563", marginBottom: "5px" }}>EMAIL ADDRESS *</label>
                    <input
                      type="email"
                      style={inputStyle}
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#4b5563", marginBottom: "5px" }}>SELECT COMPANION *</label>
                    <select
                      style={inputStyle}
                      value={formData.dog}
                      onChange={(e) => setFormData({ ...formData, dog: e.target.value })}
                      required
                    >
                      <option value="">-- Choose an Available Dog --</option>
                      {dogs.map((d) => (
                        <option key={d._id} value={d.name}>
                          {d.name} — {d.breed} ({d.age})
                        </option>
                      ))}
                      {preselectedDog && !dogs.some((d) => d.name === preselectedDog) && (
                        <option value={preselectedDog}>{preselectedDog}</option>
                      )}
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#4b5563", marginBottom: "5px" }}>
                    HOME ENVIRONMENT & FAMILY DETAILS
                  </label>
                  <textarea
                    rows="3"
                    style={inputStyle}
                    placeholder="Apartment or house, family members, previous pet experience..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
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
                  {loading ? "PROCESSING..." : "CONFIRM ZERO-FEE ADOPTION APPLICATION"}
                </button>
              </form>
            </div>
          </div>

          {/* RIGHT: COMPANION & FEE SUMMARY */}
          <div style={{ background: "#ffffff", borderRadius: "4px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", overflow: "hidden" }}>
            <div style={{ padding: "14px 20px", borderBottom: "1px solid #f0f0f0", fontSize: "14px", fontWeight: "800", color: "#878787" }}>
              COMPANION & MEDICAL SUMMARY
            </div>

            {selectedDogObj ? (
              <div style={{ padding: "20px" }}>
                <div style={{ display: "flex", gap: "16px", alignItems: "center", paddingBottom: "16px", borderBottom: "1px solid #f0f0f0" }}>
                  <img
                    src={selectedDogObj.image}
                    alt={selectedDogObj.name}
                    style={{ width: "110px", height: "110px", objectFit: "cover", borderRadius: "4px", border: "1px solid #e5e7eb" }}
                  />
                  <div>
                    <h3 style={{ margin: "0 0 4px", fontSize: "20px", fontWeight: "800", color: "#212121" }}>
                      {selectedDogObj.name}
                    </h3>
                    <div style={{ fontSize: "13.5px", color: "#64748b", marginBottom: "6px" }}>
                      {selectedDogObj.breed} • {selectedDogObj.age} • {selectedDogObj.gender || "Male"}
                    </div>
                    <span style={{ background: "#388e3c", color: "#ffffff", fontSize: "11px", fontWeight: "700", padding: "3px 8px", borderRadius: "2px" }}>
                      ✔ {selectedDogObj.medicalStatus || "Vaccinated"}
                    </span>
                  </div>
                </div>

                <div style={{ padding: "14px 0", borderBottom: "1px dashed #e0e0e0", fontSize: "14px", display: "grid", gap: "10px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Sanctuary Adoption Fee</span>
                    <span style={{ color: "#388e3c", fontWeight: "700" }}>FREE (₹0)</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Rabies & DHPPi Vaccination</span>
                    <span style={{ color: "#388e3c", fontWeight: "700" }}>INCLUDED</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Assigned Vet Doctor</span>
                    <strong>{selectedDogObj.assignedDoctor || "Dr. Aarav Sharma"}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Daily Diet Chart</span>
                    <strong style={{ maxWidth: "60%", textAlign: "right" }}>{selectedDogObj.dietPlan}</strong>
                  </div>
                </div>

                <div style={{ paddingTop: "14px", display: "flex", justifyContent: "space-between", fontSize: "18px", fontWeight: "800", color: "#212121" }}>
                  <span>Total Payable</span>
                  <span>₹0</span>
                </div>
              </div>
            ) : (
              <div style={{ padding: "28px", textAlign: "center", color: "#64748b", fontSize: "14px" }}>
                Select a dog from the form to view medical & fee breakdown.
              </div>
            )}
          </div>
        </div>

        {/* BOTTOM TRUST STRIP */}
        <div style={{ background: "#ffffff", borderRadius: "4px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", padding: "20px" }}>
          <h3 style={{ margin: "0 0 14px", fontSize: "16px", fontWeight: "800", color: "#212121" }}>
            🛡️ Why Adopt From Dog Canine Sanctuary?
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px", fontSize: "13.5px" }}>
            <div style={{ background: "#f8fafc", padding: "14px", borderRadius: "4px", border: "1px solid #e2e8f0" }}>
              <strong>1. Zero Adoption Charges</strong>
              <p style={{ margin: "4px 0 0", color: "#64748b" }}>We never sell animals. Adoption is 100% free for verified families.</p>
            </div>
            <div style={{ background: "#f8fafc", padding: "14px", borderRadius: "4px", border: "1px solid #e2e8f0" }}>
              <strong>2. Full Medical & Vaccination Record</strong>
              <p style={{ margin: "4px 0 0", color: "#64748b" }}>Every companion comes with a signed veterinary health card.</p>
            </div>
            <div style={{ background: "#f8fafc", padding: "14px", borderRadius: "4px", border: "1px solid #e2e8f0" }}>
              <strong>3. Free Post-Adoption Diet Support</strong>
              <p style={{ margin: "4px 0 0", color: "#64748b" }}>24/7 guidance from our Surat doctors on food and training.</p>
            </div>
            <div style={{ background: "#f8fafc", padding: "14px", borderRadius: "4px", border: "1px solid #e2e8f0" }}>
              <strong>4. 24/7 Helpline: +91 81401 89202</strong>
              <p style={{ margin: "4px 0 0", color: "#64748b" }}>Direct assistance from our sanctuary adoption desk.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Adoption;