import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

function Care() {
  const navigate = useNavigate();
  const [staff, setStaff] = useState([]);
  const [selectedStage, setSelectedStage] = useState("All");
  const [activeToxicFood, setActiveToxicFood] = useState(null);
  const [activeStaffMember, setActiveStaffMember] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/api/staff`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setStaff(data.staff || []);
      })
      .catch(() => {});
  }, []);

  const dietPlans = [
    {
      id: "Puppy",
      stage: "Puppies (0 – 12 Months)",
      frequency: "4 Small Meals / Day",
      waterNote: "Fresh lukewarm/room-temperature water 24/7",
      image:
        "https://images.unsplash.com/photo-1591160690555-5debfba289f0?auto=format&fit=crop&w=900&q=85",
      recommended:
        "Soft Puppy Starter Kibble, Boiled Rice, Fresh Curd (Dahi), Mashed Pumpkin & Vet Calcium Syrup.",
      avoid:
        "Excess cow milk, hard raw bones, spicy or sugary human food.",
      schedule: [
        "8:00 AM — Soaked Puppy Starter Kibble + Warm Water",
        "1:00 PM — Soft Boiled Rice + Fresh Curd (Dahi)",
        "5:30 PM — Mashed Pumpkin + Vet Calcium / Multivitamin Drops",
        "9:00 PM — Puppy Kibble + Boneless Boiled Chicken/Paneer",
      ],
    },
    {
      id: "Adult",
      stage: "Adult Sanctuary Dogs (1 – 7 Years)",
      frequency: "2 Balanced Meals / Day",
      waterNote: "2.5 – 3 Litres clean drinking water daily",
      image:
        "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=900&q=85",
      recommended:
        "Boiled Chicken / Eggs / Soyabean, Brown or White Rice, Carrots, Green Beans & Adult Kibble.",
      avoid:
        "Chocolate, Grapes, Raisins, Onion, Garlic, and oily/fried leftovers.",
      schedule: [
        "8:30 AM — Adult Dry Kibble + 2 Boiled Eggs / Curd",
        "4:00 PM — Light Dental Chew / Carrot Sticks",
        "7:30 PM — Boiled Chicken or Soyabean + Rice + Boiled Beans & Carrots",
      ],
    },
    {
      id: "Recovery",
      stage: "Senior & Injured Dogs (Recovery Ward)",
      frequency: "3 Soft Meals / Day",
      waterNote: "Electrolyte hydration + Vet-monitored intake",
      image:
        "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=900&q=85",
      recommended:
        "Warm Chicken/Veg Bone Broth, Soft Khichdi, Omega-3 Coat Supplements & Prescribed Medicines.",
      avoid:
        "Hard dry kibble, high-salt snacks, and unprescribed human painkillers.",
      schedule: [
        "8:00 AM — Soft Moong Dal & Rice Khichdi + Morning Antibiotic/Pain Meds",
        "2:00 PM — Warm Bone/Veg Broth + Omega-3 & Joint Supplement",
        "8:00 PM — Mashed Chicken/Paneer Rice + Night Recovery Medication",
      ],
    },
  ];

  const toxicFoods = [
    {
      name: "Chocolate & Caffeine",
      risk: "HIGHLY TOXIC • HEART",
      image:
        "https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=700&q=80",
      reason:
        "Contains theobromine which causes severe heart arrhythmia, tremors, and nervous system toxicity.",
      symptoms:
        "Restlessness, heavy panting, vomiting, fast heartbeat, and muscle tremors within 2–4 hours.",
      firstAid:
        "Do NOT wait for symptoms. Note how much chocolate was eaten and rush to our Vet Hospital or call +91 81401 89202 immediately.",
    },
    {
      name: "Onion, Garlic & Chives",
      risk: "BLOOD CELL DAMAGE",
      image:
        "https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=700&q=80",
      reason:
        "Destroys red blood cells in dogs, leading to life-threatening hemolytic anemia and weakness.",
      symptoms:
        "Pale gums, extreme weakness, dark/reddish urine, loss of appetite, and rapid breathing.",
      firstAid:
        "Stop all human gravy/sabzi immediately. Offer fresh water and bring the dog for a CBC blood checkup.",
    },
    {
      name: "Grapes & Raisins",
      risk: "KIDNEY FAILURE",
      image:
        "https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=700&q=80",
      reason:
        "Even a small handful can trigger sudden, irreversible acute kidney failure in dogs.",
      symptoms:
        "Repeated vomiting within a few hours, lethargy, abdominal pain, and reduced urination.",
      firstAid:
        "Immediate emergency IV fluid therapy by a veterinary doctor is critical within the first 6 hours.",
    },
    {
      name: "Cooked Chicken Bones",
      risk: "INTERNAL PUNCTURE",
      image:
        "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=700&q=80",
      reason:
        "Cooked bones become brittle, splinter into sharp needles, and can choke or puncture the stomach.",
      symptoms:
        "Gagging, pawing at mouth, bloody stool, whining when belly is touched, or straining.",
      firstAid:
        "Never pull a bone stuck deep in the throat. Keep the dog calm and visit our X-Ray & Trauma Unit right away.",
    },
    {
      name: "Sweets, Mithai & Xylitol",
      risk: "LIVER & SUGAR CRASH",
      image:
        "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=700&q=80",
      reason:
        "Causes a rapid insulin spike, dangerous blood sugar crash, seizures, and liver damage.",
      symptoms:
        "Sudden wobbling, loss of coordination, collapse, or seizures within 30–60 minutes.",
      firstAid:
        "Rub a tiny drop of honey/glucose water on the gums only if conscious, and transport to a vet immediately.",
    },
    {
      name: "Spicy & Oily Fried Food",
      risk: "PANCREATITIS",
      image:
        "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=700&q=80",
      reason:
        "Heavy masalas, salt, and deep-fried snacks cause painful pancreatitis, vomiting, and dehydration.",
      symptoms:
        "Hunched back posture, severe diarrhea, continuous vomiting, and fever.",
      firstAid:
        "Withhold food for 12 hours, give small sips of vet ORS/water, and consult our vet for anti-emetic meds.",
    },
  ];

  const visiblePlans =
    selectedStage === "All"
      ? dietPlans
      : dietPlans.filter((p) => p.id === selectedStage);

  const isSingleSelected = selectedStage !== "All";

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

        {/* HERO BANNER */}
        <div
          style={{
            background: "linear-gradient(125deg, #131921 0%, #232f3e 60%, #9a3412 100%)",
            borderRadius: "6px",
            padding: "28px 32px",
            color: "#ffffff",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
            alignItems: "center",
            gap: "24px",
            marginBottom: "24px",
          }}
        >
          <div>
            <span style={{ display: "inline-block", background: "#febd69", color: "#111827", fontWeight: "800", fontSize: "11.5px", padding: "4px 10px", borderRadius: "3px", marginBottom: "10px" }}>
              🩺 VETERINARY NUTRITION & MEDICAL STANDARDS
            </span>
            <h1 style={{ fontSize: "clamp(24px, 3.5vw, 36px)", fontWeight: "800", lineHeight: "1.15", margin: "0 0 12px" }}>
              Scientific Diet, Daily Care & 24/7 Vet Supervision
            </h1>
            <p style={{ color: "#cbd5e1", fontSize: "14.5px", lineHeight: "1.6", margin: "0 0 18px" }}>
              Every rescued dog at Dog Canine Sanctuary follows a vet-approved meal chart and medical schedule supervised by our doctors and kennel staff.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              <Link
                to="/rescue"
                style={{ padding: "10px 18px", borderRadius: "4px", background: "#ef4444", color: "#ffffff", fontWeight: "700", fontSize: "13.5px", textDecoration: "none" }}
              >
                🚑 Report Injured Dog
              </Link>
              <Link
                to="/donate"
                style={{ padding: "10px 18px", borderRadius: "4px", background: "#febd69", color: "#111827", fontWeight: "800", fontSize: "13.5px", textDecoration: "none" }}
              >
                ❤️ Sponsor Nutrition & Meds
              </Link>
            </div>
          </div>

          <div>
            <img
              src="https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?auto=format&fit=crop&w=1000&q=85"
              alt="Veterinary Dog Checkup"
              style={{ width: "100%", height: "240px", objectFit: "cover", objectPosition: "center 20%", borderRadius: "6px", border: "2px solid rgba(255,255,255,0.2)", display: "block" }}
            />
          </div>
        </div>

        {/* STAGE-WISE DIET CHART */}
        <div style={{ background: "#ffffff", borderRadius: "6px", padding: "22px", border: "1px solid #e0e0e0", marginBottom: "24px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "12px", borderBottom: "1px solid #f0f0f0", paddingBottom: "14px", marginBottom: "18px" }}>
            <div>
              <h2 style={{ fontSize: "21px", fontWeight: "800", color: "#0f172a", margin: "0 0 4px" }}>
                🍽️ Stage-Wise Dog Diet & Feeding Chart
              </h2>
              <p style={{ margin: 0, fontSize: "13.5px", color: "#64748b" }}>
                Click any stage tab below to inspect its complete daily meal timetable:
              </p>
            </div>

            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {[
                { id: "All", label: "All Stages" },
                { id: "Puppy", label: "🐶 Puppies" },
                { id: "Adult", label: "🐕 Adult Dogs" },
                { id: "Recovery", label: "🩺 Recovery Ward" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedStage(tab.id)}
                  style={{
                    padding: "8px 15px",
                    borderRadius: "4px",
                    border: selectedStage === tab.id ? "1px solid #fb641b" : "1px solid #cbd5e1",
                    background: selectedStage === tab.id ? "#fb641b" : "#ffffff",
                    color: selectedStage === tab.id ? "#ffffff" : "#334155",
                    fontWeight: "700",
                    fontSize: "13px",
                    cursor: "pointer",
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {isSingleSelected ? (
            visiblePlans.map((plan) => (
              <div
                key={plan.stage}
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                  gap: "24px",
                  alignItems: "start",
                  background: "#f8fafc",
                  borderRadius: "6px",
                  padding: "20px",
                  border: "1px solid #e2e8f0",
                }}
              >
                <div style={{ borderRadius: "6px", overflow: "hidden", border: "1px solid #cbd5e1", background: "#ffffff" }}>
                  <img
                    src={plan.image}
                    alt={plan.stage}
                    style={{
                      width: "100%",
                      height: "310px",
                      objectFit: "cover",
                      objectPosition: "center 20%",
                      display: "block",
                    }}
                  />
                  <div style={{ padding: "12px 14px", background: "#131921", color: "#ffffff", display: "flex", justifyContent: "space-between", fontSize: "12.5px", fontWeight: "700" }}>
                    <span>🕒 {plan.frequency}</span>
                    <span style={{ color: "#4ade80" }}>💧 {plan.waterNote}</span>
                  </div>
                </div>

                <div>
                  <h3 style={{ fontSize: "22px", fontWeight: "800", color: "#0f172a", margin: "0 0 12px" }}>
                    {plan.stage}
                  </h3>

                  <div style={{ background: "#ffffff", padding: "14px 16px", borderRadius: "6px", border: "1px solid #e2e8f0", marginBottom: "12px" }}>
                    <strong style={{ display: "block", fontSize: "13.5px", color: "#0f172a", marginBottom: "8px" }}>
                      📅 Daily Sanctuary Feeding Schedule:
                    </strong>
                    <ul style={{ margin: 0, paddingLeft: "18px", color: "#334155", fontSize: "13.5px", lineHeight: "1.8" }}>
                      {plan.schedule.map((slot) => (
                        <li key={slot}>{slot}</li>
                      ))}
                    </ul>
                  </div>

                  <div style={{ fontSize: "13.5px", color: "#065f46", background: "#ecfdf5", padding: "12px", borderRadius: "6px", border: "1px solid #a7f3d0", marginBottom: "10px" }}>
                    <strong>✅ Approved Diet:</strong> {plan.recommended}
                  </div>

                  <div style={{ fontSize: "13.5px", color: "#991b1b", background: "#fef2f2", padding: "12px", borderRadius: "6px", border: "1px solid #fecaca" }}>
                    <strong>🚫 Strictly Avoid:</strong> {plan.avoid}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(310px, 1fr))", gap: "18px" }}>
              {visiblePlans.map((plan) => (
                <div
                  key={plan.stage}
                  onClick={() => setSelectedStage(plan.id)}
                  style={{ background: "#ffffff", borderRadius: "6px", overflow: "hidden", border: "1px solid #e2e8f0", cursor: "pointer" }}
                >
                  <div style={{ position: "relative", height: "210px" }}>
                    <img
                      src={plan.image}
                      alt={plan.stage}
                      style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 20%", display: "block" }}
                    />
                    <span style={{ position: "absolute", top: "10px", right: "10px", background: "#131921", color: "#febd69", fontSize: "11px", fontWeight: "800", padding: "4px 9px", borderRadius: "3px" }}>
                      🕒 {plan.frequency}
                    </span>
                  </div>

                  <div style={{ padding: "16px" }}>
                    <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#0f172a", margin: "0 0 10px" }}>{plan.stage}</h3>
                    <div style={{ fontSize: "13px", color: "#065f46", background: "#ecfdf5", padding: "10px", borderRadius: "4px", border: "1px solid #a7f3d0", marginBottom: "8px" }}>
                      <strong>✅ Approved Diet:</strong> {plan.recommended}
                    </div>
                    <div style={{ fontSize: "13px", color: "#991b1b", background: "#fef2f2", padding: "10px", borderRadius: "4px", border: "1px solid #fecaca" }}>
                      <strong>🚫 Strictly Avoid:</strong> {plan.avoid}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CLICKABLE STRICTLY PROHIBITED FOODS GALLERY */}
        <div
          style={{
            background: "#ffffff",
            border: "2px solid #fca5a5",
            borderRadius: "6px",
            padding: "24px",
            marginBottom: "24px",
          }}
        >
          <div style={{ borderBottom: "1px solid #fee2e2", paddingBottom: "14px", marginBottom: "18px", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "10px" }}>
            <div>
              <h2 style={{ margin: "0 0 4px", fontSize: "22px", fontWeight: "800", color: "#b91c1c" }}>
                ⚠️ Strictly Prohibited Foods (Toxic for Dogs)
              </h2>
              <p style={{ color: "#7f1d1d", fontSize: "13.5px", margin: 0 }}>
                Click any food card below to view poisoning symptoms & emergency vet first-aid:
              </p>
            </div>
            <span style={{ background: "#dc2626", color: "#ffffff", fontWeight: "800", fontSize: "12px", padding: "5px 12px", borderRadius: "4px" }}>
              🚨 CLICK CARD FOR FIRST-AID
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: "16px" }}>
            {toxicFoods.map((item) => (
              <div
                key={item.name}
                onClick={() => setActiveToxicFood(item)}
                style={{
                  background: "#fff5f5",
                  borderRadius: "6px",
                  overflow: "hidden",
                  border: "1px solid #fecaca",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  cursor: "pointer",
                }}
              >
                <div>
                  <div style={{ position: "relative", height: "165px", background: "#fee2e2" }}>
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    />
                    <span
                      style={{
                        position: "absolute",
                        top: "8px",
                        left: "8px",
                        background: "#dc2626",
                        color: "#ffffff",
                        fontSize: "10.5px",
                        fontWeight: "800",
                        padding: "3px 8px",
                        borderRadius: "3px",
                      }}
                    >
                      ⛔ {item.risk}
                    </span>
                  </div>

                  <div style={{ padding: "14px" }}>
                    <h3 style={{ margin: "0 0 6px", fontSize: "16.5px", fontWeight: "800", color: "#991b1b" }}>
                      🚫 {item.name}
                    </h3>
                    <p style={{ margin: 0, fontSize: "13px", color: "#475569", lineHeight: "1.5" }}>
                      {item.reason}
                    </p>
                  </div>
                </div>

                <div style={{ padding: "10px 14px", background: "#fee2e2", color: "#991b1b", fontSize: "12px", fontWeight: "800", display: "flex", justifyContent: "space-between" }}>
                  <span>🩺 View Symptoms & First-Aid</span>
                  <span>→</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* LIVE SANCTUARY DOCTORS & CARETAKERS */}
        {staff.length > 0 && (
          <div style={{ background: "#ffffff", borderRadius: "6px", padding: "22px", border: "1px solid #e0e0e0" }}>
            <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#0f172a", margin: "0 0 4px" }}>
              👨‍⚕️ Our Sanctuary Veterinary Doctors & Caretakers
            </h2>
            <p style={{ color: "#64748b", fontSize: "13.5px", margin: "0 0 18px" }}>
              Click any doctor or caretaker card to view duty details & helpline access:
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "14px" }}>
              {staff.map((member) => (
                <div
                  key={member._id}
                  onClick={() => setActiveStaffMember(member)}
                  style={{
                    background: "#f8fafc",
                    borderRadius: "6px",
                    padding: "16px",
                    border: "1px solid #e2e8f0",
                    cursor: "pointer",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: "800",
                        padding: "3px 8px",
                        borderRadius: "3px",
                        background: member.role === "Vet Doctor" ? "#dbeafe" : "#fef3c7",
                        color: member.role === "Vet Doctor" ? "#1e40af" : "#92400e",
                      }}
                    >
                      {member.role}
                    </span>
                    <span style={{ fontSize: "11px", fontWeight: "700", color: member.status === "On Duty" ? "#15803d" : "#b91c1c" }}>
                      ● {member.status}
                    </span>
                  </div>
                  <h3 style={{ margin: "0 0 4px", fontSize: "16px", color: "#0f172a" }}>{member.name}</h3>
                  <p style={{ margin: "0 0 6px", fontSize: "13px", color: "#475569" }}>{member.specialization}</p>
                  <div style={{ fontSize: "12px", color: "#2563eb", fontWeight: "700" }}>
                    🕒 {member.shift} • Click Details →
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* TOXIC FOOD MODAL */}
      {activeToxicFood && (
        <div
          onClick={() => setActiveToxicFood(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.68)",
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
              borderRadius: "8px",
              maxWidth: "620px",
              width: "100%",
              overflow: "hidden",
              boxShadow: "0 20px 50px rgba(0,0,0,0.35)",
            }}
          >
            <div style={{ background: "#b91c1c", color: "#ffffff", padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <strong>🚨 TOXICITY & EMERGENCY VET PROTOCOL</strong>
              <button
                type="button"
                onClick={() => setActiveToxicFood(null)}
                style={{ background: "transparent", border: "none", color: "#ffffff", fontSize: "22px", cursor: "pointer" }}
              >
                ×
              </button>
            </div>

            <div style={{ padding: "22px" }}>
              <div style={{ display: "flex", gap: "16px", alignItems: "center", marginBottom: "16px" }}>
                <img
                  src={activeToxicFood.image}
                  alt={activeToxicFood.name}
                  style={{ width: "90px", height: "90px", objectFit: "cover", borderRadius: "6px", border: "1px solid #fecaca" }}
                />
                <div>
                  <span style={{ background: "#fee2e2", color: "#b91c1c", fontSize: "11px", fontWeight: "800", padding: "3px 8px", borderRadius: "3px" }}>
                    {activeToxicFood.risk}
                  </span>
                  <h3 style={{ margin: "6px 0 4px", fontSize: "21px", color: "#0f172a" }}>
                    {activeToxicFood.name}
                  </h3>
                  <p style={{ margin: 0, fontSize: "13px", color: "#475569" }}>{activeToxicFood.reason}</p>
                </div>
              </div>

              <div style={{ background: "#fffbeb", border: "1px solid #fde68a", padding: "12px 14px", borderRadius: "6px", marginBottom: "12px" }}>
                <strong style={{ display: "block", color: "#92400e", fontSize: "13.5px", marginBottom: "4px" }}>
                  ⚠️ Warning Symptoms to Watch For:
                </strong>
                <span style={{ fontSize: "13.5px", color: "#78350f" }}>{activeToxicFood.symptoms}</span>
              </div>

              <div style={{ background: "#ecfdf5", border: "1px solid #a7f3d0", padding: "12px 14px", borderRadius: "6px", marginBottom: "18px" }}>
                <strong style={{ display: "block", color: "#065f46", fontSize: "13.5px", marginBottom: "4px" }}>
                  🩺 Immediate Veterinary First-Aid:
                </strong>
                <span style={{ fontSize: "13.5px", color: "#064e3b" }}>{activeToxicFood.firstAid}</span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <Link
                  to="/rescue"
                  style={{
                    textAlign: "center",
                    padding: "11px",
                    background: "#dc2626",
                    color: "#ffffff",
                    fontWeight: "800",
                    fontSize: "13.5px",
                    borderRadius: "4px",
                    textDecoration: "none",
                  }}
                >
                  🚑 Dispatch Vet Ambulance
                </Link>
                <a
                  href="tel:+918140189202"
                  style={{
                    textAlign: "center",
                    padding: "11px",
                    background: "#131921",
                    color: "#febd69",
                    fontWeight: "800",
                    fontSize: "13.5px",
                    borderRadius: "4px",
                    textDecoration: "none",
                  }}
                >
                  📞 Call +91 81401 89202
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STAFF MODAL */}
      {activeStaffMember && (
        <div
          onClick={() => setActiveStaffMember(null)}
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
              borderRadius: "8px",
              maxWidth: "460px",
              width: "100%",
              overflow: "hidden",
              boxShadow: "0 20px 50px rgba(0,0,0,0.35)",
            }}
          >
            <div style={{ background: "#131921", color: "#ffffff", padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <strong>Sanctuary Duty Roster Profile</strong>
              <button
                type="button"
                onClick={() => setActiveStaffMember(null)}
                style={{ background: "transparent", border: "none", color: "#ffffff", fontSize: "22px", cursor: "pointer" }}
              >
                ×
              </button>
            </div>
            <div style={{ padding: "22px" }}>
              <span style={{ background: "#dbeafe", color: "#1e40af", fontSize: "11.5px", fontWeight: "800", padding: "4px 10px", borderRadius: "4px" }}>
                {activeStaffMember.role} • {activeStaffMember.status}
              </span>
              <h3 style={{ margin: "10px 0 6px", fontSize: "22px", color: "#0f172a" }}>{activeStaffMember.name}</h3>
              <p style={{ margin: "0 0 12px", fontSize: "14px", color: "#475569" }}>
                <strong>Department:</strong> {activeStaffMember.specialization}
              </p>
              <div style={{ background: "#f8fafc", padding: "12px", borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "13.5px", marginBottom: "16px" }}>
                <div><strong>🕒 Duty Shift:</strong> {activeStaffMember.shift}</div>
                <div style={{ marginTop: "4px" }}><strong>📍 Ward:</strong> Dog Canine Sanctuary, Surat</div>
              </div>
              <Link
                to="/contact"
                style={{
                  display: "block",
                  textAlign: "center",
                  padding: "11px",
                  background: "#fb641b",
                  color: "#ffffff",
                  fontWeight: "800",
                  fontSize: "13.5px",
                  borderRadius: "4px",
                  textDecoration: "none",
                }}
              >
                📅 Request Vet Consultation / Visit
              </Link>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default Care;