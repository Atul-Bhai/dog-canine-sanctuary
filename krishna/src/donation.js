import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

function Donation() {
  const navigate = useNavigate();
  const [amount, setAmount] = useState(500);
  const [customAmount, setCustomAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("UPI / QR");
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [donorPhone, setDonorPhone] = useState("");

  const [loading, setLoading] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [copiedUpi, setCopiedUpi] = useState(false);

  const finalAmount = customAmount ? Number(customAmount) : Number(amount);
  const upiId = "8140189202@ybl";
  const upiDeepLink = `upi://pay?pa=${upiId}&pn=Dog%20Canine%20Sanctuary&am=${finalAmount}&cu=INR`;
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
    upiDeepLink
  )}`;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleConfirmDonation = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!finalAmount || finalAmount < 10) {
      setErrorMsg("Please select or enter a valid donation amount (minimum ₹10).");
      return;
    }
    if (!donorName.trim()) {
      setErrorMsg("Please enter your full name for the official receipt.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/donation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: donorName,
          email: donorEmail,
          phone: donorPhone,
          amount: finalAmount,
          paymentMethod,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setReceipt({
          id: data.donation?._id?.slice(-8).toUpperCase() || "DCS2026",
          name: donorName,
          amount: finalAmount,
          method: paymentMethod,
          date: new Date().toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
        });
      } else {
        setErrorMsg(data.message || "Unable to record donation.");
      }
    } catch {
      setErrorMsg("Server connection error. Please check backend.");
    } finally {
      setLoading(false);
    }
  };

  const slabs = [
    { val: 250, label: "1 Week Kibble" },
    { val: 500, label: "Vaccination" },
    { val: 1100, label: "Full Medical Care" },
    { val: 2500, label: "Rescue Surgery" },
  ];

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
            🔒 256-BIT SSL SECURE SPONSORSHIP CHECKOUT
          </span>
        </div>

        {/* OFFICIAL RECEIPT MODAL */}
        {receipt ? (
          <div style={{ maxWidth: "600px", margin: "0 auto", background: "#ffffff", borderRadius: "6px", padding: "28px", border: "1px solid #cbd5e1", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}>
            <div style={{ textAlign: "center", borderBottom: "1px dashed #cbd5e1", paddingBottom: "16px", marginBottom: "16px" }}>
              <span style={{ background: "#dcfce7", color: "#15803d", fontSize: "12px", fontWeight: "800", padding: "4px 12px", borderRadius: "4px" }}>
                ✔ OFFICIAL CONTRIBUTION RECEIPT
              </span>
              <h2 style={{ margin: "10px 0 4px", fontSize: "24px", color: "#0f172a" }}>Dog Canine Sanctuary</h2>
              <p style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>Surat, Gujarat • Helpline: +91 81401 89202</p>
            </div>

            <div style={{ display: "grid", gap: "10px", fontSize: "14px", marginBottom: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#64748b" }}>Receipt No:</span>
                <strong>#{receipt.id}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#64748b" }}>Donor Name:</span>
                <strong>{receipt.name}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#64748b" }}>Payment Mode:</span>
                <strong>{receipt.method}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#64748b" }}>Date:</span>
                <strong>{receipt.date}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "18px", borderTop: "1px solid #e2e8f0", paddingTop: "10px" }}>
                <strong>Amount Sponsored:</strong>
                <strong style={{ color: "#15803d" }}>₹{receipt.amount}</strong>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <button
                type="button"
                onClick={() => window.print()}
                style={{ padding: "12px", background: "#131921", color: "#febd69", border: "none", borderRadius: "4px", fontWeight: "800", cursor: "pointer" }}
              >
                🖨️ Print / Save PDF
              </button>
              <button
                type="button"
                onClick={() => setReceipt(null)}
                style={{ padding: "12px", background: "#fb641b", color: "#ffffff", border: "none", borderRadius: "4px", fontWeight: "800", cursor: "pointer" }}
              >
                Donate Again
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))", gap: "20px", alignItems: "start" }}>
            {/* LEFT: AMOUNT & BILLING DETAILS */}
            <div style={{ background: "#ffffff", borderRadius: "4px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", overflow: "hidden" }}>
              <div style={{ background: "#2874f0", color: "#ffffff", padding: "14px 20px", fontWeight: "800", fontSize: "15px" }}>
                ❤️ DOG CANINE SANCTUARY — OFFICIAL SPONSORSHIP CHECKOUT
              </div>

              <div style={{ padding: "24px" }}>
                {errorMsg && (
                  <div style={{ background: "#fee2e2", color: "#b91c1c", padding: "10px 12px", borderRadius: "4px", marginBottom: "14px", fontSize: "13px" }}>
                    ⚠️ {errorMsg}
                  </div>
                )}

                <strong style={{ display: "block", fontSize: "13px", color: "#374151", marginBottom: "10px" }}>
                  Step 1: Select Sponsorship Amount
                </strong>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "14px" }}>
                  {slabs.map((s) => {
                    const active = !customAmount && amount === s.val;
                    return (
                      <button
                        key={s.val}
                        type="button"
                        onClick={() => {
                          setAmount(s.val);
                          setCustomAmount("");
                        }}
                        style={{
                          padding: "12px",
                          borderRadius: "4px",
                          border: active ? "2px solid #fb641b" : "1px solid #d1d5db",
                          background: active ? "#fff7ed" : "#ffffff",
                          textAlign: "left",
                          cursor: "pointer",
                        }}
                      >
                        <div style={{ fontSize: "16px", fontWeight: "800", color: "#111827" }}>₹{s.val}</div>
                        <div style={{ fontSize: "12px", color: "#64748b" }}>{s.label}</div>
                      </button>
                    );
                  })}
                </div>

                <div style={{ marginBottom: "18px" }}>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#4b5563", marginBottom: "4px" }}>
                    Or Enter Custom Amount (₹ INR)
                  </label>
                  <input
                    type="number"
                    placeholder="Enter amount (e.g. 1500)"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    style={{ width: "100%", padding: "10px 12px", borderRadius: "4px", border: "1px solid #d1d5db", fontSize: "14px", boxSizing: "border-box" }}
                  />
                </div>

                <strong style={{ display: "block", fontSize: "13px", color: "#374151", marginBottom: "10px" }}>
                  Step 2: Billing & Receipt Details
                </strong>

                <div style={{ display: "grid", gap: "12px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#4b5563", marginBottom: "4px" }}>Full Name *</label>
                    <input
                      placeholder="Enter your full name"
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      style={{ width: "100%", padding: "10px 12px", borderRadius: "4px", border: "1px solid #d1d5db", fontSize: "14px", boxSizing: "border-box" }}
                    />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#4b5563", marginBottom: "4px" }}>Email (For Receipt)</label>
                      <input
                        type="email"
                        placeholder="you@example.com"
                        value={donorEmail}
                        onChange={(e) => setDonorEmail(e.target.value)}
                        style={{ width: "100%", padding: "10px 12px", borderRadius: "4px", border: "1px solid #d1d5db", fontSize: "14px", boxSizing: "border-box" }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#4b5563", marginBottom: "4px" }}>Mobile Number</label>
                      <input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={donorPhone}
                        onChange={(e) => setDonorPhone(e.target.value)}
                        style={{ width: "100%", padding: "10px 12px", borderRadius: "4px", border: "1px solid #d1d5db", fontSize: "14px", boxSizing: "border-box" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: UPI QR / CARD PAYMENT BOX */}
            <div style={{ background: "#ffffff", borderRadius: "4px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", overflow: "hidden" }}>
              <div style={{ background: "#131921", color: "#ffffff", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: "11px", color: "#cbd5e1", fontWeight: "700" }}>PAYABLE AMOUNT</div>
                  <div style={{ fontSize: "26px", fontWeight: "800", color: "#febd69" }}>₹{finalAmount || 0}</div>
                </div>
                <div style={{ textAlign: "right", fontSize: "12px", color: "#4ade80", fontWeight: "700" }}>
                  Zero Platform Fee<br />Instant Receipt
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", borderBottom: "1px solid #e5e7eb" }}>
                {["UPI / QR", "Debit/Credit Card", "Net Banking"].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setPaymentMethod(tab)}
                    style={{
                      padding: "11px 6px",
                      border: "none",
                      borderBottom: paymentMethod === tab ? "3px solid #2874f0" : "3px solid transparent",
                      background: paymentMethod === tab ? "#f8fafc" : "#ffffff",
                      fontWeight: "700",
                      fontSize: "12.5px",
                      cursor: "pointer",
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div style={{ padding: "22px", textAlign: "center" }}>
                {paymentMethod === "UPI / QR" ? (
                  <>
                    <div style={{ fontSize: "13px", color: "#475569", marginBottom: "12px" }}>
                      Scan QR using GPay, PhonePe, Paytm, or BHIM
                    </div>
                    <img
                      src={qrImageUrl}
                      alt="UPI QR Code"
                      style={{ width: "185px", height: "185px", margin: "0 auto 14px", border: "1px solid #e2e8f0", padding: "6px", borderRadius: "4px" }}
                    />
                    <div style={{ background: "#f8fafc", padding: "10px 14px", borderRadius: "4px", border: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                      <div style={{ textAlign: "left" }}>
                        <div style={{ fontSize: "10.5px", color: "#64748b", fontWeight: "700" }}>SANCTUARY UPI ID</div>
                        <strong style={{ fontSize: "13.5px" }}>{upiId}</strong>
                      </div>
                      <button
                        type="button"
                        onClick={handleCopyUpi}
                        style={{ background: "#131921", color: "#ffffff", border: "none", padding: "6px 12px", borderRadius: "4px", fontSize: "12px", fontWeight: "700", cursor: "pointer" }}
                      >
                        {copiedUpi ? "Copied ✔" : "Copy UPI ID"}
                      </button>
                    </div>
                  </>
                ) : (
                  <div style={{ padding: "24px 12px", background: "#f8fafc", borderRadius: "4px", border: "1px solid #e2e8f0", marginBottom: "16px", fontSize: "13.5px", color: "#475569" }}>
                    Enter your name on the left and click confirm below to complete your <strong>{paymentMethod}</strong> contribution of <strong>₹{finalAmount}</strong>.
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleConfirmDonation}
                  disabled={loading}
                  style={{
                    width: "100%",
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
                  {loading ? "GENERATING RECEIPT..." : `Confirm & Generate ₹${finalAmount || 0} Receipt →`}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default Donation;