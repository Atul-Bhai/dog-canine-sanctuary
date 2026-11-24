import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

function AdminDashboard() {
  const navigate = useNavigate();
  const [tabHistory, setTabHistory] = useState(["overview"]);
  const activeTab = tabHistory[tabHistory.length - 1];
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const goToTab = (nextTab) => {
    setTabHistory((prev) =>
      prev[prev.length - 1] === nextTab ? prev : [...prev, nextTab]
    );
  };

  const handleStepBack = () => {
    if (tabHistory.length > 1) {
      setTabHistory((prev) => prev.slice(0, -1));
    } else {
      navigate(-1);
    }
  };

  // Live Database States
  const [dogs, setDogs] = useState([]);
  const [staff, setStaff] = useState([]);
  const [adoptions, setAdoptions] = useState([]);
  const [rescues, setRescues] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [donations, setDonations] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [users, setUsers] = useState([]);

  // New Dog Form State (Matches server.js Dog Schema)
  const [newDog, setNewDog] = useState({
    name: "",
    breed: "",
    age: "",
    gender: "Male",
    description: "Healthy, friendly, and vaccinated sanctuary dog ready for a loving home.",
    assignedDoctor: "Dr. Aarav Sharma (Chief Vet)",
    assignedCaretaker: "Ramesh Kumar (Kennel Boy)",
    dietPlan: "Morning: Boiled Eggs & Kibble | Evening: Boiled Chicken, Rice & Pumpkin",
    status: "Available",
    image: "",
  });

  // New Staff Form State (Matches server.js Staff Schema)
  const [newStaff, setNewStaff] = useState({
    name: "",
    role: "Vet Doctor",
    specialization: "",
    phone: "",
    shift: "Morning (7 AM - 3 PM)",
    status: "On Duty",
  });

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token") || localStorage.getItem("adminToken") || "";
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  const fetchAllData = async () => {
    setLoading(true);
    const headers = getAuthHeaders();
    try {
      const [
        dogsRes,
        staffRes,
        adoptRes,
        rescueRes,
        volRes,
        donRes,
        contactRes,
        usersRes,
      ] = await Promise.all([
        fetch(`${API_URL}/api/dogs`).then((r) => r.json()).catch(() => ({})),
        fetch(`${API_URL}/api/staff`).then((r) => r.json()).catch(() => ({})),
        fetch(`${API_URL}/api/adoption`, { headers }).then((r) => r.json()).catch(() => ({})),
        fetch(`${API_URL}/api/rescue`, { headers }).then((r) => r.json()).catch(() => ({})),
        fetch(`${API_URL}/api/volunteer`, { headers }).then((r) => r.json()).catch(() => ({})),
        fetch(`${API_URL}/api/donation`, { headers }).then((r) => r.json()).catch(() => ({})),
        fetch(`${API_URL}/api/contact`, { headers }).then((r) => r.json()).catch(() => ({})),
        fetch(`${API_URL}/api/admin/users`, { headers }).then((r) => r.json()).catch(() => ({})),
      ]);

      if (dogsRes.dogs) setDogs(dogsRes.dogs);
      if (staffRes.staff) setStaff(staffRes.staff);
      if (adoptRes.applications) setAdoptions(adoptRes.applications);
      if (rescueRes.rescues) setRescues(rescueRes.rescues);
      if (volRes.applications) setVolunteers(volRes.applications);
      if (donRes.donations) setDonations(donRes.donations);
      if (contactRes.messages) setContacts(contactRes.messages);
      if (usersRes.users) setUsers(usersRes.users);
    } catch (err) {
      console.error("Admin fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  // Add New Dog
  const handleAddDog = async (e) => {
    e.preventDefault();
    if (!newDog.name || !newDog.breed || !newDog.age) return;
    try {
      const res = await fetch(`${API_URL}/api/dogs`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          ...newDog,
          image:
            newDog.image ||
            "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setNewDog({
          name: "",
          breed: "",
          age: "",
          gender: "Male",
          description: "Healthy, friendly, and vaccinated sanctuary dog ready for a loving home.",
          assignedDoctor: "Dr. Aarav Sharma (Chief Vet)",
          assignedCaretaker: "Ramesh Kumar (Kennel Boy)",
          dietPlan: "Morning: Boiled Eggs & Kibble | Evening: Boiled Chicken, Rice & Pumpkin",
          status: "Available",
          image: "",
        });
        fetchAllData();
      }
    } catch {}
  };

  // Delete Dog
  const handleDeleteDog = async (id) => {
    try {
      await fetch(`${API_URL}/api/dogs/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      fetchAllData();
    } catch {}
  };

  // Add New Staff
  const handleAddStaff = async (e) => {
    e.preventDefault();
    if (!newStaff.name || !newStaff.specialization || !newStaff.phone) return;
    try {
      const res = await fetch(`${API_URL}/api/staff`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(newStaff),
      });
      const data = await res.json();
      if (data.success) {
        setNewStaff({
          name: "",
          role: "Vet Doctor",
          specialization: "",
          phone: "",
          shift: "Morning (7 AM - 3 PM)",
          status: "On Duty",
        });
        fetchAllData();
      }
    } catch {}
  };

  // Delete Staff
  const handleDeleteStaff = async (id) => {
    try {
      await fetch(`${API_URL}/api/staff/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      fetchAllData();
    } catch {}
  };

  // Update Adoption Status (PATCH /api/adoption/:id/status)
  const handleAdoptionStatus = async (id, status) => {
    try {
      await fetch(`${API_URL}/api/adoption/${id}/status`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
      });
      fetchAllData();
    } catch {}
  };

  // Update Rescue Status (PATCH /api/rescue/:id/status)
  const handleRescueStatus = async (id, status) => {
    try {
      await fetch(`${API_URL}/api/rescue/${id}/status`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
      });
      fetchAllData();
    } catch {}
  };

  // Delete Contact Message (DELETE /api/contact/:id)
  const handleDeleteMessage = async (id) => {
    try {
      await fetch(`${API_URL}/api/contact/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      fetchAllData();
    } catch {}
  };

  const totalDonations = donations.reduce(
    (sum, item) => sum + (Number(item.amount) || 0),
    0
  );
  const onDutyStaff = staff.filter((s) => s.status === "On Duty").length;
  const activeAlerts =
    rescues.filter((r) => r.status !== "Rescued").length +
    adoptions.filter((a) => a.status === "Pending").length;

  const sidebarItems = [
    { id: "overview", label: "Executive Overview", icon: "📊" },
    { id: "diet", label: "Diet, Nutrition & Medical", icon: "🩺", count: dogs.length },
    { id: "staff", label: "Doctors & Kennel Staff", icon: "👨‍⚕️", count: staff.length },
    { id: "dogs", label: "Sanctuary Dogs", icon: "🐶", count: dogs.length },
    { id: "adoptions", label: "Adoption Requests", icon: "🏠", count: adoptions.length },
    { id: "rescues", label: "Emergency Rescues", icon: "🚑", count: rescues.length },
    { id: "volunteers", label: "Volunteers & Messages", icon: "🤝", count: volunteers.length + contacts.length },
    { id: "donations", label: "Donations & Users", icon: "💰", count: donations.length + users.length },
  ];

  const q = searchTerm.toLowerCase();

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#64748b", fontFamily: "Inter, system-ui, sans-serif" }}>
      {/* LEFT DARK SIDEBAR */}
      <aside
        style={{
          width: "260px",
          background: "#131921",
          color: "#ffffff",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "18px 14px",
          flexShrink: 0,
        }}
      >
        <div>
          {/* BRAND HEADER */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", paddingBottom: "16px", borderBottom: "1px solid #232f3e", marginBottom: "16px" }}>
            <img
              src="/logo.jpeg"
              alt="Dog Sanctuary"
              style={{ width: "38px", height: "38px", borderRadius: "6px", objectFit: "cover" }}
            />
            <div>
              <div style={{ fontWeight: "800", fontSize: "14px", color: "#ffffff" }}>DOG SANCTUARY</div>
              <div style={{ fontSize: "10.5px", fontWeight: "700", color: "#febd69" }}>ENTERPRISE ERP v2.0</div>
            </div>
          </div>

          {/* NAVIGATION TABS */}
          <div style={{ display: "grid", gap: "6px" }}>
            {sidebarItems.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => goToTab(tab.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 12px",
                    borderRadius: "6px",
                    border: "none",
                    background: active ? "#ea580c" : "transparent",
                    color: active ? "#ffffff" : "#cbd5e1",
                    fontWeight: active ? "800" : "600",
                    fontSize: "13px",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <span>
                    {tab.icon} {tab.label}
                  </span>
                  {typeof tab.count === "number" && (
                    <span
                      style={{
                        background: active ? "rgba(0,0,0,0.25)" : "#232f3e",
                        color: "#ffffff",
                        fontSize: "11px",
                        fontWeight: "800",
                        padding: "2px 8px",
                        borderRadius: "999px",
                      }}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* BOTTOM SIDEBAR ACTIONS */}
        <div style={{ display: "grid", gap: "8px", paddingTop: "16px", borderTop: "1px solid #232f3e" }}>
          <Link
            to="/"
            style={{
              textAlign: "center",
              padding: "10px",
              background: "#232f3e",
              color: "#ffffff",
              borderRadius: "6px",
              fontSize: "12.5px",
              fontWeight: "700",
              textDecoration: "none",
            }}
          >
            🌐 View Public Website
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            style={{
              padding: "10px",
              background: "#dc2626",
              color: "#ffffff",
              border: "none",
              borderRadius: "6px",
              fontSize: "12.5px",
              fontWeight: "800",
              cursor: "pointer",
            }}
          >
            Logout Admin
          </button>
        </div>
      </aside>

      {/* RIGHT MAIN CONTENT AREA */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#64748b" }}>
        {/* TOP HEADER BAR WITH STEP-BY-STEP BACK BUTTON */}
        <header
          style={{
            background: "#ffffff",
            padding: "14px 24px",
            borderBottom: "1px solid #cbd5e1",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button
              type="button"
              onClick={handleStepBack}
              style={{
                background: "#ffffff",
                border: "1px solid #cbd5e1",
                color: "#0f172a",
                padding: "6px 14px",
                borderRadius: "4px",
                fontSize: "13px",
                fontWeight: "700",
                cursor: "pointer",
                boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
              }}
            >
              ← Back
            </button>
            <h1 style={{ margin: 0, fontSize: "20px", fontWeight: "800", color: "#0f172a" }}>
              Sanctuary Operations Control Center
            </h1>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <input
              type="text"
              placeholder="🔍 Search dogs, doctors, caretakers, donors, or rescues..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "300px",
                padding: "8px 12px",
                borderRadius: "6px",
                border: "1px solid #cbd5e1",
                fontSize: "13px",
                background: "#ffffff",
              }}
            />
            <span style={{ background: "#dcfce7", color: "#15803d", fontSize: "12px", fontWeight: "800", padding: "6px 12px", borderRadius: "6px" }}>
              ● System Online
            </span>
            <button
              type="button"
              onClick={fetchAllData}
              style={{
                padding: "7px 12px",
                background: "#ffffff",
                border: "1px solid #cbd5e1",
                borderRadius: "6px",
                fontSize: "12.5px",
                fontWeight: "700",
                cursor: "pointer",
              }}
            >
              {loading ? "Syncing..." : "↻ Sync"}
            </button>
          </div>
        </header>

        {/* WORKSPACE BODY */}
        <div style={{ padding: "22px 24px", flex: 1, background: "#64748b" }}>
          {/* TAB 1: EXECUTIVE OVERVIEW */}
          {activeTab === "overview" && (
            <>
              {/* 4 CLICKABLE KPI CARDS */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginBottom: "20px" }}>
                <div
                  onClick={() => goToTab("donations")}
                  title="Click to view Donations & Users"
                  style={{ background: "#ffffff", padding: "18px", borderRadius: "6px", borderLeft: "4px solid #16a34a", cursor: "pointer", boxShadow: "0 2px 6px rgba(0,0,0,0.08)" }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "11.5px", fontWeight: "800", color: "#64748b" }}>TOTAL DONATIONS</span>
                    <span style={{ fontSize: "11px", fontWeight: "700", color: "#16a34a" }}>View →</span>
                  </div>
                  <div style={{ fontSize: "26px", fontWeight: "800", color: "#0f172a", margin: "4px 0" }}>₹{totalDonations}</div>
                  <div style={{ fontSize: "12px", color: "#16a34a", fontWeight: "700" }}>{donations.length} verified UPI contributions</div>
                </div>

                <div
                  onClick={() => goToTab("dogs")}
                  title="Click to manage Sanctuary Dogs"
                  style={{ background: "#ffffff", padding: "18px", borderRadius: "6px", borderLeft: "4px solid #2563eb", cursor: "pointer", boxShadow: "0 2px 6px rgba(0,0,0,0.08)" }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "11.5px", fontWeight: "800", color: "#64748b" }}>SANCTUARY DOGS & DIET</span>
                    <span style={{ fontSize: "11px", fontWeight: "700", color: "#2563eb" }}>Manage →</span>
                  </div>
                  <div style={{ fontSize: "26px", fontWeight: "800", color: "#0f172a", margin: "4px 0" }}>{dogs.length} Dogs</div>
                  <div style={{ fontSize: "12px", color: "#2563eb", fontWeight: "700" }}>{dogs.length} fed today • 0 on meds</div>
                </div>

                <div
                  onClick={() => goToTab("staff")}
                  title="Click to manage Doctors & Kennel Staff"
                  style={{ background: "#ffffff", padding: "18px", borderRadius: "6px", borderLeft: "4px solid #9333ea", cursor: "pointer", boxShadow: "0 2px 6px rgba(0,0,0,0.08)" }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "11.5px", fontWeight: "800", color: "#64748b" }}>DOCTORS & CARETAKERS</span>
                    <span style={{ fontSize: "11px", fontWeight: "700", color: "#9333ea" }}>Staff →</span>
                  </div>
                  <div style={{ fontSize: "26px", fontWeight: "800", color: "#0f172a", margin: "4px 0" }}>
                    {onDutyStaff}/{staff.length}
                  </div>
                  <div style={{ fontSize: "12px", color: "#9333ea", fontWeight: "700" }}>Staff currently On Duty</div>
                </div>

                <div
                  onClick={() => goToTab("rescues")}
                  title="Click to view Emergency Rescues & Adoptions"
                  style={{ background: "#ffffff", padding: "18px", borderRadius: "6px", borderLeft: "4px solid #dc2626", cursor: "pointer", boxShadow: "0 2px 6px rgba(0,0,0,0.08)" }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "11.5px", fontWeight: "800", color: "#64748b" }}>ACTIVE RESCUES & ADOPTIONS</span>
                    <span style={{ fontSize: "11px", fontWeight: "700", color: "#dc2626" }}>Alerts →</span>
                  </div>
                  <div style={{ fontSize: "26px", fontWeight: "800", color: "#0f172a", margin: "4px 0" }}>{activeAlerts}</div>
                  <div style={{ fontSize: "12px", color: "#dc2626", fontWeight: "700" }}>
                    {rescues.length} rescue alerts • {adoptions.length} adoptions pending
                  </div>
                </div>
              </div>

              {/* FEEDING TRACKER + SAFETY RULES */}
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "18px" }}>
                <div style={{ background: "#ffffff", borderRadius: "6px", padding: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                    <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "800", color: "#0f172a" }}>
                      🥣 Today's Dog Feeding & Medical Tracker
                    </h3>
                    <button
                      type="button"
                      onClick={() => goToTab("diet")}
                      style={{ background: "none", border: "none", color: "#2563eb", fontWeight: "700", fontSize: "12.5px", cursor: "pointer" }}
                    >
                      Open Full Chart →
                    </button>
                  </div>

                  <div style={{ display: "grid", gap: "10px" }}>
                    {dogs
                      .filter((d) => d.name.toLowerCase().includes(q) || d.breed.toLowerCase().includes(q))
                      .map((dog) => (
                        <div
                          key={dog._id}
                          onClick={() => goToTab("diet")}
                          style={{
                            background: "#ffffff",
                            border: "1px solid #cbd5e1",
                            borderRadius: "6px",
                            padding: "12px 14px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: "12px",
                            cursor: "pointer",
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: "800", fontSize: "14px", color: "#0f172a" }}>
                              🐶 {dog.name} ({dog.breed})
                            </div>
                            <div style={{ fontSize: "12px", color: "#475569", marginTop: "2px" }}>
                              Diet: {dog.dietPlan || dog.diet}
                            </div>
                            <div style={{ fontSize: "11.5px", color: "#2563eb", fontWeight: "600", marginTop: "2px" }}>
                              🩺 {dog.assignedDoctor || dog.doctor} • 🧹 {dog.assignedCaretaker || dog.caretaker}
                            </div>
                          </div>
                          <span
                            style={{
                              background: "#dcfce7",
                              color: "#15803d",
                              fontSize: "11.5px",
                              fontWeight: "800",
                              padding: "4px 10px",
                              borderRadius: "999px",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {dog.feedingStatus || "Fed Today"}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>

                {/* FEEDING SAFETY RULES */}
                <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: "6px", padding: "20px" }}>
                  <h3 style={{ margin: "0 0 8px", fontSize: "16px", fontWeight: "800", color: "#92400e" }}>
                    ⚠️ Sanctuary Feeding Safety Rules (For Kennel Boys)
                  </h3>
                  <p style={{ fontSize: "12.5px", color: "#78350f", margin: "0 0 12px" }}>
                    Caretakers must strictly verify each dog's allergy tag before serving meals:
                  </p>
                  <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "13px", color: "#991b1b", lineHeight: "1.9", fontWeight: "600" }}>
                    <li>🚫 NEVER feed Chocolate, Grapes, Raisins, or Xylitol sweets.</li>
                    <li>🚫 NEVER feed Onion, Garlic, or spicy/oily human leftovers.</li>
                    <li>🚫 NEVER give cooked chicken bones (splinter hazard).</li>
                    <li style={{ color: "#15803d" }}>✅ Always serve fresh boiled water & prescribed vet supplements.</li>
                  </ul>
                </div>
              </div>
            </>
          )}

          {/* TAB 2: DIET, NUTRITION & MEDICAL */}
          {activeTab === "diet" && (
            <div style={{ background: "#ffffff", borderRadius: "6px", padding: "20px" }}>
              <h3 style={{ margin: "0 0 14px", fontSize: "18px", fontWeight: "800" }}>
                🩺 Master Veterinary Diet & Medical Assignment Log ({dogs.length})
              </h3>
              <div style={{ display: "grid", gap: "10px" }}>
                {dogs.map((dog) => (
                  <div
                    key={dog._id}
                    style={{
                      background: "#ffffff",
                      border: "1px solid #cbd5e1",
                      borderRadius: "6px",
                      padding: "14px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <strong style={{ fontSize: "15px", color: "#0f172a" }}>
                        {dog.name} • {dog.breed} ({dog.age})
                      </strong>
                      <div style={{ fontSize: "13px", color: "#334155", marginTop: "4px" }}>
                        <strong>Meal Chart:</strong> {dog.dietPlan || dog.diet}
                      </div>
                      <div style={{ fontSize: "12.5px", color: "#2563eb", marginTop: "2px" }}>
                        <strong>Vet:</strong> {dog.assignedDoctor || dog.doctor} | <strong>Caretaker:</strong>{" "}
                        {dog.assignedCaretaker || dog.caretaker}
                      </div>
                    </div>
                    <span style={{ background: "#dbeafe", color: "#1e40af", padding: "4px 10px", borderRadius: "4px", fontSize: "12px", fontWeight: "800" }}>
                      {dog.medicalStatus || dog.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: DOCTORS & KENNEL STAFF */}
          {activeTab === "staff" && (
            <div style={{ display: "grid", gap: "18px" }}>
              <div style={{ background: "#ffffff", borderRadius: "6px", padding: "20px" }}>
                <h3 style={{ margin: "0 0 12px", fontSize: "16px", fontWeight: "800" }}>
                  ➕ Hire / Register New Staff Member
                </h3>
                <form onSubmit={handleAddStaff} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "10px" }}>
                  <input
                    placeholder="Full Name (e.g. Dr. Vikram Patil) *"
                    value={newStaff.name}
                    onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                    style={{ padding: "9px 12px", borderRadius: "4px", border: "1px solid #cbd5e1" }}
                  />
                  <select
                    value={newStaff.role}
                    onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
                    style={{ padding: "9px 12px", borderRadius: "4px", border: "1px solid #cbd5e1" }}
                  >
                    <option value="Vet Doctor">🩺 Vet Doctor</option>
                    <option value="Kennel Caretaker">🧹 Kennel Caretaker</option>
                    <option value="Rescue Driver">🚑 Rescue Driver</option>
                    <option value="Pharmacy & Diet">💊 Pharmacy & Diet</option>
                  </select>
                  <input
                    placeholder="Specialization / Duty *"
                    value={newStaff.specialization}
                    onChange={(e) => setNewStaff({ ...newStaff, specialization: e.target.value })}
                    style={{ padding: "9px 12px", borderRadius: "4px", border: "1px solid #cbd5e1" }}
                  />
                  <input
                    placeholder="Phone Number *"
                    value={newStaff.phone}
                    onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                    style={{ padding: "9px 12px", borderRadius: "4px", border: "1px solid #cbd5e1" }}
                  />
                  <select
                    value={newStaff.shift}
                    onChange={(e) => setNewStaff({ ...newStaff, shift: e.target.value })}
                    style={{ padding: "9px 12px", borderRadius: "4px", border: "1px solid #cbd5e1" }}
                  >
                    <option value="Morning (7 AM - 3 PM)">Morning (7 AM - 3 PM)</option>
                    <option value="Evening (3 PM - 11 PM)">Evening (3 PM - 11 PM)</option>
                    <option value="Night Emergency">Night Emergency</option>
                  </select>
                  <button
                    type="submit"
                    style={{ background: "#ea580c", color: "#ffffff", border: "none", borderRadius: "4px", fontWeight: "800", cursor: "pointer" }}
                  >
                    + Add to Staff
                  </button>
                </form>
              </div>

              <div style={{ background: "#ffffff", borderRadius: "6px", padding: "20px" }}>
                <h3 style={{ margin: "0 0 12px", fontSize: "16px", fontWeight: "800" }}>
                  👨‍⚕️ Veterinary Doctors & Kennel Staff Management ({staff.length})
                </h3>
                <div style={{ display: "grid", gap: "10px" }}>
                  {staff.map((m) => (
                    <div
                      key={m._id}
                      style={{
                        background: "#ffffff",
                        border: "1px solid #cbd5e1",
                        borderRadius: "6px",
                        padding: "12px 16px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: "10px",
                      }}
                    >
                      <div>
                        <strong style={{ fontSize: "14.5px", color: "#0f172a" }}>{m.name}</strong>{" "}
                        <span style={{ background: "#dbeafe", color: "#1e40af", fontSize: "11px", fontWeight: "800", padding: "2px 8px", borderRadius: "4px" }}>
                          {m.role}
                        </span>
                        <div style={{ fontSize: "12.5px", color: "#475569", marginTop: "3px" }}>
                          {m.specialization} • {m.shift} • 📞 {m.phone}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteStaff(m._id)}
                        style={{ background: "#dc2626", color: "#ffffff", border: "none", padding: "6px 12px", borderRadius: "4px", fontSize: "12px", fontWeight: "700", cursor: "pointer" }}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SANCTUARY DOGS */}
          {activeTab === "dogs" && (
            <div style={{ display: "grid", gap: "18px" }}>
              <div style={{ background: "#ffffff", borderRadius: "6px", padding: "20px" }}>
                <h3 style={{ margin: "0 0 12px", fontSize: "16px", fontWeight: "800" }}>
                  🐶 Add & Manage Sanctuary Dogs
                </h3>
                <form onSubmit={handleAddDog} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "10px" }}>
                  <input
                    placeholder="Dog Name *"
                    value={newDog.name}
                    onChange={(e) => setNewDog({ ...newDog, name: e.target.value })}
                    style={{ padding: "9px 12px", borderRadius: "4px", border: "1px solid #cbd5e1" }}
                  />
                  <input
                    placeholder="Breed *"
                    value={newDog.breed}
                    onChange={(e) => setNewDog({ ...newDog, breed: e.target.value })}
                    style={{ padding: "9px 12px", borderRadius: "4px", border: "1px solid #cbd5e1" }}
                  />
                  <input
                    placeholder="Age (e.g. 2 Years) *"
                    value={newDog.age}
                    onChange={(e) => setNewDog({ ...newDog, age: e.target.value })}
                    style={{ padding: "9px 12px", borderRadius: "4px", border: "1px solid #cbd5e1" }}
                  />
                  <input
                    placeholder="Assigned Vet Doctor"
                    value={newDog.assignedDoctor}
                    onChange={(e) => setNewDog({ ...newDog, assignedDoctor: e.target.value })}
                    style={{ padding: "9px 12px", borderRadius: "4px", border: "1px solid #cbd5e1" }}
                  />
                  <input
                    placeholder="Assigned Caretaker"
                    value={newDog.assignedCaretaker}
                    onChange={(e) => setNewDog({ ...newDog, assignedCaretaker: e.target.value })}
                    style={{ padding: "9px 12px", borderRadius: "4px", border: "1px solid #cbd5e1" }}
                  />
                  <input
                    placeholder="Diet Plan"
                    value={newDog.dietPlan}
                    onChange={(e) => setNewDog({ ...newDog, dietPlan: e.target.value })}
                    style={{ padding: "9px 12px", borderRadius: "4px", border: "1px solid #cbd5e1" }}
                  />
                  <button
                    type="submit"
                    style={{ background: "#16a34a", color: "#ffffff", border: "none", borderRadius: "4px", fontWeight: "800", cursor: "pointer", padding: "10px" }}
                  >
                    + Add Dog to Sanctuary
                  </button>
                </form>
              </div>

              <div style={{ background: "#ffffff", borderRadius: "6px", padding: "20px" }}>
                <div style={{ display: "grid", gap: "10px" }}>
                  {dogs.map((dog) => (
                    <div
                      key={dog._id}
                      style={{
                        background: "#ffffff",
                        border: "1px solid #cbd5e1",
                        borderRadius: "6px",
                        padding: "12px 16px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div style={{ fontSize: "14px", color: "#0f172a" }}>
                        <strong>{dog.name}</strong> ({dog.breed} • {dog.age}) —{" "}
                        <span style={{ color: "#15803d", fontWeight: "800" }}>{dog.status}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteDog(dog._id)}
                        style={{ background: "#dc2626", color: "#ffffff", border: "none", padding: "6px 12px", borderRadius: "4px", fontSize: "12px", fontWeight: "700", cursor: "pointer" }}
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: ADOPTION REQUESTS */}
          {activeTab === "adoptions" && (
            <div style={{ background: "#ffffff", borderRadius: "6px", padding: "20px" }}>
              <h3 style={{ margin: "0 0 14px", fontSize: "17px", fontWeight: "800" }}>
                🏠 Adoption Applications ({adoptions.length})
              </h3>
              {adoptions.length === 0 ? (
                <p style={{ color: "#64748b" }}>No adoption requests submitted yet.</p>
              ) : (
                <div style={{ display: "grid", gap: "10px" }}>
                  {adoptions.map((a) => (
                    <div
                      key={a._id}
                      style={{
                        background: "#ffffff",
                        border: "1px solid #cbd5e1",
                        borderRadius: "6px",
                        padding: "14px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <strong>{a.name}</strong> ({a.phone} • {a.email}) — Wants to adopt:{" "}
                        <strong>{a.dog}</strong>
                        <div style={{ fontSize: "12.5px", color: "#475569" }}>{a.message}</div>
                      </div>
                      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        <span style={{ fontWeight: "800", fontSize: "12px", color: "#2563eb" }}>{a.status}</span>
                        <button
                          type="button"
                          onClick={() => handleAdoptionStatus(a._id, "Approved")}
                          style={{ background: "#16a34a", color: "#ffffff", border: "none", padding: "6px 10px", borderRadius: "4px", fontSize: "12px", cursor: "pointer" }}
                        >
                          Approve
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 6: EMERGENCY RESCUES */}
          {activeTab === "rescues" && (
            <div style={{ background: "#ffffff", borderRadius: "6px", padding: "20px" }}>
              <h3 style={{ margin: "0 0 14px", fontSize: "17px", fontWeight: "800" }}>
                🚨 Emergency Rescue Reports ({rescues.length})
              </h3>
              {rescues.length === 0 ? (
                <p style={{ color: "#64748b" }}>No active rescue emergencies right now.</p>
              ) : (
                <div style={{ display: "grid", gap: "10px" }}>
                  {rescues.map((r) => (
                    <div
                      key={r._id}
                      style={{
                        background: "#ffffff",
                        border: "1px solid #cbd5e1",
                        borderRadius: "6px",
                        padding: "14px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <strong>{r.reporterName}</strong> ({r.phone}) — 📍 {r.location}
                        <div style={{ fontSize: "12.5px", color: "#b91c1c" }}>{r.condition}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRescueStatus(r._id, "Rescued")}
                        style={{ background: "#16a34a", color: "#ffffff", border: "none", padding: "6px 12px", borderRadius: "4px", fontSize: "12px", fontWeight: "700", cursor: "pointer" }}
                      >
                        {r.status === "Rescued" ? "Rescued ✔" : "Mark Rescued"}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 7: VOLUNTEERS & MESSAGES */}
          {activeTab === "volunteers" && (
            <div style={{ display: "grid", gap: "18px" }}>
              <div style={{ background: "#ffffff", borderRadius: "6px", padding: "20px" }}>
                <h3 style={{ margin: "0 0 12px", fontSize: "17px", fontWeight: "800" }}>
                  🤝 Registered Volunteers ({volunteers.length})
                </h3>
                {volunteers.length === 0 ? (
                  <p style={{ color: "#64748b" }}>No volunteer registrations yet.</p>
                ) : (
                  volunteers.map((v) => (
                    <div key={v._id} style={{ background: "#ffffff", border: "1px solid #cbd5e1", padding: "12px", borderRadius: "6px", marginBottom: "8px" }}>
                      <strong>{v.name}</strong> ({v.phone} • {v.email}) — Activity: {v.activity} ({v.status})
                    </div>
                  ))
                )}
              </div>

              <div style={{ background: "#ffffff", borderRadius: "6px", padding: "20px" }}>
                <h3 style={{ margin: "0 0 12px", fontSize: "17px", fontWeight: "800" }}>
                  ✉️ Help Desk Inquiries ({contacts.length})
                </h3>
                {contacts.length === 0 ? (
                  <p style={{ color: "#64748b" }}>No messages received yet.</p>
                ) : (
                  contacts.map((c) => (
                    <div
                      key={c._id}
                      style={{
                        background: "#ffffff",
                        border: "1px solid #cbd5e1",
                        padding: "12px 16px",
                        borderRadius: "6px",
                        marginBottom: "8px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <div>
                        <strong>{c.name}</strong> ({c.email}): {c.message}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteMessage(c._id)}
                        style={{ background: "#dc2626", color: "#ffffff", border: "none", padding: "5px 10px", borderRadius: "4px", fontSize: "11.5px", fontWeight: "700", cursor: "pointer" }}
                      >
                        Delete
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 8: DONATIONS & USERS */}
          {activeTab === "donations" && (
            <div style={{ display: "grid", gap: "18px" }}>
              <div style={{ background: "#ffffff", borderRadius: "6px", padding: "20px" }}>
                <h3 style={{ margin: "0 0 14px", fontSize: "17px", fontWeight: "800" }}>
                  💰 Verified Sanctuary Donations ({donations.length})
                </h3>
                {donations.length === 0 ? (
                  <p style={{ color: "#64748b" }}>No donations recorded yet.</p>
                ) : (
                  <div style={{ display: "grid", gap: "10px" }}>
                    {donations.map((d) => (
                      <div
                        key={d._id}
                        style={{
                          background: "#ffffff",
                          border: "1px solid #cbd5e1",
                          borderRadius: "6px",
                          padding: "12px 16px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div>
                          <strong>{d.donorName}</strong> ({d.paymentMethod}) •{" "}
                          <span style={{ fontSize: "11.5px", color: "#2563eb" }}>{d.transactionId}</span>
                          <div style={{ fontSize: "12px", color: "#64748b" }}>{d.email}</div>
                        </div>
                        <strong style={{ color: "#15803d", fontSize: "16px" }}>₹{d.amount}</strong>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ background: "#ffffff", borderRadius: "6px", padding: "20px" }}>
                <h3 style={{ margin: "0 0 14px", fontSize: "17px", fontWeight: "800" }}>
                  👥 Registered Portal Accounts ({users.length})
                </h3>
                <div style={{ display: "grid", gap: "8px" }}>
                  {users.map((u) => (
                    <div
                      key={u._id}
                      style={{
                        background: "#ffffff",
                        border: "1px solid #cbd5e1",
                        borderRadius: "6px",
                        padding: "10px 14px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <strong>{u.name}</strong> ({u.email})
                      </div>
                      <span
                        style={{
                          background: u.role === "admin" ? "#fef3c7" : "#e2e8f0",
                          color: u.role === "admin" ? "#92400e" : "#334155",
                          padding: "3px 10px",
                          borderRadius: "999px",
                          fontSize: "11.5px",
                          fontWeight: "800",
                          textTransform: "uppercase",
                        }}
                      >
                        {u.role}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;