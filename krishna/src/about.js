import React from "react";
import { Link, useNavigate } from "react-router-dom";

function About() {
  const navigate = useNavigate();

  return (
    <main style={{ background: "#f1f3f6", paddingTop: "108px", paddingBottom: "28px", fontFamily: "Inter, system-ui, sans-serif" }}>
      <div style={{ width: "100%", maxWidth: "1520px", margin: "0 auto", padding: "0 20px" }}>
        {/* ONLY CLEAN BACK BUTTON */}
        <div style={{ marginBottom: "14px" }}>
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
        </div>

        {/* MISSION BANNER */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: "4px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
            padding: "28px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "24px",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <div>
            <span style={{ background: "#2874f0", color: "#ffffff", fontSize: "11px", fontWeight: "800", padding: "4px 10px", borderRadius: "3px" }}>
              ESTABLISHED IN SURAT, GUJARAT
            </span>
            <h1 style={{ fontSize: "clamp(24px, 3.5vw, 34px)", fontWeight: "800", color: "#212121", margin: "12px 0 10px" }}>
              About Dog Canine Sanctuary
            </h1>
            <p style={{ color: "#475569", fontSize: "14.5px", lineHeight: "1.7", margin: "0 0 16px" }}>
              Dog Canine Sanctuary is a dedicated animal rescue, veterinary hospital, and zero-fee adoption center in Surat, Gujarat. Every injured, abandoned, or stray dog brought to our shelter receives 24/7 medical treatment, scientific stage-wise nutrition, and a safe forever home.
            </p>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <Link
                to="/adoption"
                style={{ background: "#fb641b", color: "#ffffff", padding: "11px 20px", borderRadius: "3px", fontWeight: "800", fontSize: "13.5px", textDecoration: "none" }}
              >
                ADOPT A DOG
              </Link>
              <Link
                to="/rescue"
                style={{ background: "#131921", color: "#febd69", padding: "11px 20px", borderRadius: "3px", fontWeight: "800", fontSize: "13.5px", textDecoration: "none" }}
              >
                24/7 RESCUE DESK
              </Link>
            </div>
          </div>

          <div>
            <img
              src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1000&q=85"
              alt="Dog Canine Sanctuary Shelter"
              style={{ width: "100%", height: "260px", objectFit: "cover", borderRadius: "4px", border: "1px solid #e2e8f0" }}
            />
          </div>
        </div>

        {/* 4 KEY METRICS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
          {[
            { num: "1,250+", label: "Stray & Injured Dogs Rescued" },
            { num: "840+", label: "Zero-Fee Verified Adoptions" },
            { num: "24 / 7", label: "Emergency Ambulance & Vet ICU" },
            { num: "100%", label: "Transparent Donation Utilization" },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{ background: "#ffffff", borderRadius: "4px", padding: "22px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", textAlign: "center" }}
            >
              <div style={{ fontSize: "28px", fontWeight: "800", color: "#2874f0" }}>{stat.num}</div>
              <div style={{ fontSize: "13.5px", fontWeight: "700", color: "#475569", marginTop: "4px" }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export default About;