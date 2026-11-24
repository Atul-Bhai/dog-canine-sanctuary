import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const FALLBACK_DOGS = [
  {
    _id: "1",
    name: "Bruno",
    breed: "Labrador",
    age: "2 Years",
    gender: "Male",
    image:
      "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1000&q=90",
    description: "Friendly, playful, house-trained and great with kids.",
    medicalStatus: "Healthy & Vaccinated",
    assignedDoctor: "Dr. Aarav Sharma (Chief Vet)",
    caretaker: "Ramesh Kumar (Block A)",
    dietPlan: "Morning: Boiled Eggs & Kibble | Evening: Boiled Chicken, Rice & Pumpkin",
    status: "Available",
  },
  {
    _id: "2",
    name: "Bella",
    breed: "Golden Retriever",
    age: "3 Years",
    gender: "Female",
    image:
      "https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=1000&q=90",
    description: "Calm, gentle temperament and fully vaccinated.",
    medicalStatus: "Healthy & Vaccinated",
    assignedDoctor: "Dr. Priya Nair (Senior Vet)",
    caretaker: "Suresh Patel (Block B)",
    dietPlan: "Morning: Curd Rice & Kibble | Evening: Soyabean, Carrots & Rice",
    status: "Available",
  },
  {
    _id: "3",
    name: "Rocky",
    breed: "Indie",
    age: "1 Year",
    gender: "Male",
    image:
      "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=1000&q=90",
    description: "Smart, loyal, energetic and alert guard companion.",
    medicalStatus: "Healthy & Vaccinated",
    assignedDoctor: "Dr. Aarav Sharma (Chief Vet)",
    caretaker: "Ramesh Kumar (Block A)",
    dietPlan: "Morning: Puppy/Adult Starter | Evening: Chicken Broth, Rice & Beans",
    status: "Available",
  },
  {
    _id: "4",
    name: "Milo",
    breed: "Beagle Mix",
    age: "8 Months",
    gender: "Male",
    image:
      "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=1000&q=90",
    description: "Active puppy, loves walks and interactive toys.",
    medicalStatus: "Vaccinated & Dewormed",
    assignedDoctor: "Dr. Priya Nair (Senior Vet)",
    caretaker: "Suresh Patel (Block B)",
    dietPlan: "3 Small Meals: Soft Kibble, Curd Rice & Mashed Pumpkin",
    status: "Available",
  },
];

function Home() {
  const [searchParams] = useSearchParams();
  const urlQuery = searchParams.get("q") || "";

  const [dogs, setDogs] = useState(FALLBACK_DOGS);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [quickViewDog, setQuickViewDog] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/api/dogs`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.dogs) && data.dogs.length > 0) {
          const available = data.dogs.filter((d) => d.status === "Available");
          if (available.length > 0) {
            setDogs(available);
          }
        }
      })
      .catch(() => {});
  }, []);

  const categoryCards = [
    { id: "All", label: "All Dogs", icon: "🐾" },
    { id: "Indie", label: "Indian Pariah", icon: "🐕" },
    { id: "Labrador", label: "Labradors", icon: "🦮" },
    { id: "Golden Retriever", label: "Retrievers", icon: "🐕‍🦺" },
    { id: "Puppy", label: "Puppies (<1 Yr)", icon: "🐶" },
    { id: "Vaccinated", label: "Vet Certified", icon: "🩺" },
  ];

  const filteredDogs = dogs.filter((dog) => {
    const matchesSearch =
      !urlQuery ||
      dog.name?.toLowerCase().includes(urlQuery.toLowerCase()) ||
      dog.breed?.toLowerCase().includes(urlQuery.toLowerCase()) ||
      dog.description?.toLowerCase().includes(urlQuery.toLowerCase());

    const matchesCat =
      selectedCategory === "All" ||
      (selectedCategory === "Puppy" &&
        dog.age?.toLowerCase().includes("month")) ||
      (selectedCategory === "Vaccinated" &&
        dog.medicalStatus?.toLowerCase().includes("vaccinated")) ||
      dog.breed?.toLowerCase().includes(selectedCategory.toLowerCase());

    return matchesSearch && matchesCat;
  });

  return (
    <div style={{ background: "#f1f3f6", minHeight: "100vh", paddingTop: "104px", fontFamily: "Inter, system-ui, sans-serif" }}>
      {/* =====================================================
          1. FLIPKART STYLE TOP CATEGORY ICON STRIP
      ===================================================== */}
      <div style={{ background: "#ffffff", borderBottom: "1px solid #e0e0e0", padding: "12px 16px" }}>
        <div style={{ maxWidth: "1360px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "10px" }}>
          {categoryCards.map((cat) => {
            const active = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  background: active ? "#fff7ed" : "#ffffff",
                  border: active ? "1.5px solid #fb641b" : "1px solid transparent",
                  borderRadius: "6px",
                  padding: "8px 6px",
                  cursor: "pointer",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "24px", marginBottom: "4px" }}>{cat.icon}</div>
                <div style={{ fontSize: "13px", fontWeight: "700", color: active ? "#fb641b" : "#212121" }}>
                  {cat.label}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* =====================================================
          2. EDGE-TO-EDGE PROMOTIONAL CAROUSEL BANNER
      ===================================================== */}
      <div style={{ maxWidth: "1360px", margin: "14px auto", padding: "0 14px" }}>
        <div
          style={{
            background: "linear-gradient(95deg, #172337 0%, #2874f0 55%, #1e40af 100%)",
            borderRadius: "4px",
            padding: "28px 32px",
            color: "#ffffff",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            alignItems: "center",
            gap: "24px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
          }}
        >
          <div>
            <span style={{ background: "#ffe500", color: "#111827", fontSize: "11px", fontWeight: "800", padding: "3px 8px", borderRadius: "2px" }}>
              SANCTUARY ADOPTION DRIVE 2026
            </span>
            <h1 style={{ fontSize: "clamp(24px, 3.5vw, 36px)", fontWeight: "800", margin: "10px 0 8px", lineHeight: "1.15" }}>
              Adopt a Vaccinated Dog at ₹0 Adoption Fee
            </h1>
            <p style={{ color: "#e0f2fe", fontSize: "14.5px", margin: "0 0 18px" }}>
              100% Health Checked • Dewormed • Vet Diet Certified • Free Post-Adoption Consultation in Surat
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              <Link
                to="/adoption"
                style={{
                  background: "#fb641b",
                  color: "#ffffff",
                  padding: "11px 22px",
                  borderRadius: "3px",
                  fontWeight: "800",
                  fontSize: "14px",
                  textDecoration: "none",
                }}
              >
                APPLY FOR ADOPTION
              </Link>
              <Link
                to="/care"
                style={{
                  background: "#ffffff",
                  color: "#2874f0",
                  padding: "11px 20px",
                  borderRadius: "3px",
                  fontWeight: "800",
                  fontSize: "14px",
                  textDecoration: "none",
                }}
              >
                VIEW VET DIET & TOXIC FOOD GUIDE
              </Link>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <img
              src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=900&q=85"
              alt="Sanctuary Dogs"
              style={{ width: "100%", maxWidth: "440px", height: "210px", objectFit: "cover", borderRadius: "4px", border: "2px solid rgba(255,255,255,0.25)" }}
            />
          </div>
        </div>
      </div>

      {/* =====================================================
          3. FLIPKART / AMAZON 4-COLUMN PRODUCT CATALOG GRID
      ===================================================== */}
      <div style={{ maxWidth: "1360px", margin: "0 auto", padding: "0 14px 60px" }}>
        <div style={{ background: "#ffffff", borderRadius: "4px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f0f0f0", paddingBottom: "14px", marginBottom: "18px" }}>
            <div>
              <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "800", color: "#212121" }}>
                {urlQuery ? `Search Results for "${urlQuery}"` : "Verified Dogs Available for Adoption"} ({filteredDogs.length})
              </h2>
              <span style={{ fontSize: "12.5px", color: "#878787" }}>
                Click any dog card for full medical specs, diet chart & instant adoption
              </span>
            </div>

            <Link
              to="/adoption"
              style={{
                background: "#2874f0",
                color: "#ffffff",
                padding: "9px 16px",
                borderRadius: "3px",
                fontSize: "13px",
                fontWeight: "700",
                textDecoration: "none",
              }}
            >
              VIEW ALL →
            </Link>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(265px, 1fr))", gap: "16px" }}>
            {filteredDogs.map((dog) => (
              <div
                key={dog._id || dog.name}
                style={{
                  border: "1px solid #e0e0e0",
                  borderRadius: "4px",
                  background: "#ffffff",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  overflow: "hidden",
                }}
              >
                <div>
                  {/* PRODUCT IMAGE */}
                  <div
                    onClick={() => setQuickViewDog(dog)}
                    style={{ position: "relative", height: "210px", cursor: "pointer", background: "#f8fafc" }}
                  >
                    <img
                      src={dog.image}
                      alt={dog.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    />
                    <span
                      style={{
                        position: "absolute",
                        top: "8px",
                        left: "8px",
                        background: "#388e3c",
                        color: "#ffffff",
                        fontSize: "11px",
                        fontWeight: "700",
                        padding: "2px 7px",
                        borderRadius: "2px",
                      }}
                    >
                      4.9 ★ Vet Verified
                    </span>
                  </div>

                  {/* PRODUCT SPECS */}
                  <div style={{ padding: "14px" }}>
                    <div
                      onClick={() => setQuickViewDog(dog)}
                      style={{ fontSize: "16px", fontWeight: "700", color: "#212121", cursor: "pointer", marginBottom: "4px" }}
                    >
                      {dog.name} — {dog.breed}
                    </div>

                    <div style={{ fontSize: "12.5px", color: "#878787", marginBottom: "8px" }}>
                      Age: <strong>{dog.age}</strong> • Gender: <strong>{dog.gender || "Male"}</strong>
                    </div>

                    <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "8px" }}>
                      <span style={{ fontSize: "18px", fontWeight: "800", color: "#212121" }}>₹0</span>
                      <span style={{ fontSize: "12.5px", color: "#878787", textDecoration: "line-through" }}>₹15,000</span>
                      <span style={{ fontSize: "12.5px", fontWeight: "700", color: "#388e3c" }}>100% Free Adoption</span>
                    </div>

                    <div style={{ fontSize: "12px", color: "#334155", background: "#f8fafc", padding: "8px", borderRadius: "3px", border: "1px solid #f1f5f9" }}>
                      <div><strong>🩺 Doctor:</strong> {dog.assignedDoctor || "Dr. Aarav Sharma"}</div>
                      <div style={{ marginTop: "2px" }}><strong>🍽️ Diet:</strong> {dog.dietPlan || "Balanced Vet Kibble"}</div>
                    </div>
                  </div>
                </div>

                {/* FLIPKART DUAL ACTION BUTTONS */}
                <div style={{ padding: "0 14px 14px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                  <button
                    type="button"
                    onClick={() => setQuickViewDog(dog)}
                    style={{
                      padding: "9px 6px",
                      borderRadius: "3px",
                      border: "1px solid #d1d5db",
                      background: "#ffffff",
                      color: "#212121",
                      fontWeight: "700",
                      fontSize: "12.5px",
                      cursor: "pointer",
                    }}
                  >
                    👁️ Quick View
                  </button>

                  <Link
                    to={`/adoption?dog=${encodeURIComponent(dog.name)}`}
                    style={{
                      textAlign: "center",
                      padding: "9px 6px",
                      borderRadius: "3px",
                      background: "#fb641b",
                      color: "#ffffff",
                      fontWeight: "800",
                      fontSize: "12.5px",
                      textDecoration: "none",
                    }}
                  >
                    ⚡ ADOPT NOW
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* =====================================================
          4. AMAZON / FLIPKART PRODUCT DETAIL QUICK-VIEW MODAL
      ===================================================== */}
      {quickViewDog && (
        <div
          onClick={() => setQuickViewDog(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.65)",
            zIndex: 2000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#ffffff",
              borderRadius: "6px",
              maxWidth: "820px",
              width: "100%",
              overflow: "hidden",
              boxShadow: "0 20px 50px rgba(0,0,0,0.35)",
            }}
          >
            <div style={{ background: "#131921", color: "#ffffff", padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <strong>DogCanine Verified Companion Profile</strong>
              <button
                type="button"
                onClick={() => setQuickViewDog(null)}
                style={{ background: "transparent", border: "none", color: "#ffffff", fontSize: "20px", cursor: "pointer" }}
              >
                ×
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px", padding: "24px" }}>
              <div>
                <img
                  src={quickViewDog.image}
                  alt={quickViewDog.name}
                  style={{ width: "100%", height: "280px", objectFit: "cover", borderRadius: "4px", border: "1px solid #e5e7eb" }}
                />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "12px" }}>
                  <Link
                    to={`/adoption?dog=${encodeURIComponent(quickViewDog.name)}`}
                    style={{
                      textAlign: "center",
                      padding: "12px",
                      background: "#fb641b",
                      color: "#ffffff",
                      fontWeight: "800",
                      fontSize: "13.5px",
                      borderRadius: "3px",
                      textDecoration: "none",
                    }}
                  >
                    ⚡ ADOPT {quickViewDog.name.toUpperCase()}
                  </Link>
                  <Link
                    to="/donate"
                    style={{
                      textAlign: "center",
                      padding: "12px",
                      background: "#ff9f00",
                      color: "#111827",
                      fontWeight: "800",
                      fontSize: "13.5px",
                      borderRadius: "3px",
                      textDecoration: "none",
                    }}
                  >
                    ❤️ SPONSOR MEAL
                  </Link>
                </div>
              </div>

              <div>
                <span style={{ background: "#388e3c", color: "#ffffff", fontSize: "11.5px", fontWeight: "700", padding: "3px 8px", borderRadius: "2px" }}>
                  ✔ {quickViewDog.medicalStatus || "Healthy & Vaccinated"}
                </span>
                <h2 style={{ margin: "10px 0 4px", fontSize: "24px", fontWeight: "800" }}>
                  {quickViewDog.name} ({quickViewDog.breed})
                </h2>
                <p style={{ color: "#475569", fontSize: "14px", margin: "0 0 14px" }}>
                  {quickViewDog.description}
                </p>

                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13.5px" }}>
                  <tbody>
                    <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <td style={{ padding: "8px 0", color: "#64748b", width: "38%" }}>Age & Gender</td>
                      <td style={{ padding: "8px 0", fontWeight: "700" }}>{quickViewDog.age} • {quickViewDog.gender || "Male"}</td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <td style={{ padding: "8px 0", color: "#64748b" }}>Assigned Vet</td>
                      <td style={{ padding: "8px 0", fontWeight: "700" }}>{quickViewDog.assignedDoctor || "Dr. Aarav Sharma"}</td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <td style={{ padding: "8px 0", color: "#64748b" }}>Caretaker</td>
                      <td style={{ padding: "8px 0", fontWeight: "700" }}>{quickViewDog.caretaker || "Ramesh Kumar"}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: "8px 0", color: "#64748b" }}>Daily Diet Chart</td>
                      <td style={{ padding: "8px 0", fontWeight: "700", color: "#065f46" }}>{quickViewDog.dietPlan}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;