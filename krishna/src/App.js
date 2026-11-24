import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import Navbar from "./navbar";
import Footer from "./footer";

import Home from "./home";
import About from "./about";
import Care from "./care";
import Rescue from "./rescue";
import Adoption from "./adoption";
import Donation from "./donation";
import Volunteer from "./volunteer";
import Contact from "./contact";

import Login from "./login";
import Signup from "./signup";
import ForgotPassword from "./ForgotPassword";
import AdminDashboard from "./AdminDashboard";

// Protected Route for Admin ERP
function AdminRoute({ children }) {
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const isAdmin =
    user?.role === "admin" || localStorage.getItem("userRole") === "admin";

  if (!isLoggedIn || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// Full-Screen Layout Wrapper (Pins Footer to Bottom on All Public Pages)
function AppLayout({ children }) {
  const location = useLocation();
  const path = location.pathname.toLowerCase();

  const hideLayout =
    path.startsWith("/admin") ||
    path === "/login" ||
    path === "/signup" ||
    path === "/forgot-password";

  return (
    <div
      style={{
        width: "100%",
        backgroundColor: "#64748b",
      }}
    >
      {!hideLayout && <Navbar />}
      <div style={{ width: "100%" }}>{children}</div>
      {!hideLayout && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppLayout>
        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/care" element={<Care />} />
          <Route path="/rescue" element={<Rescue />} />
          <Route path="/adoption" element={<Adoption />} />
          <Route path="/donate" element={<Donation />} />
          <Route path="/volunteer" element={<Volunteer />} />
          <Route path="/contact" element={<Contact />} />

          {/* Authentication Pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Protected Admin ERP Dashboard */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppLayout>
    </Router>
  );
}

export default App;