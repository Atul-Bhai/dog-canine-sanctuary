import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import "./VolunteerRequests.css";

const BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000";
const API = `${BASE_URL}/api`;

function VolunteerRequests() {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // =====================================================
  // GET AUTH TOKEN
  // =====================================================
  const getAuthToken = useCallback(() => {
    return (
      localStorage.getItem("token") ||
      localStorage.getItem("adminToken") ||
      null
    );
  }, []);

  // =====================================================
  // AUTHENTICATED FETCH
  // =====================================================
  const authenticatedFetch = useCallback(
    async (url, options = {}) => {
      const token = getAuthToken();

      if (!token) {
        localStorage.clear();
        navigate("/login", { replace: true });
        throw new Error("Your session has expired. Please login again.");
      }

      const existingHeaders = options.headers || {};

      const response = await fetch(url, {
        ...options,
        headers: {
          ...existingHeaders,
          Authorization: `Bearer ${token}`,
          ...(options.body && !existingHeaders["Content-Type"]
            ? { "Content-Type": "application/json" }
            : {}),
        },
      });

      if (response.status === 401 || response.status === 403) {
        localStorage.clear();
        navigate("/login", { replace: true });
        throw new Error("Your session has expired. Please login again.");
      }

      return response;
    },
    [getAuthToken, navigate]
  );

  // =====================================================
  // LOAD VOLUNTEER APPLICATIONS
  // =====================================================
  const loadApplications = useCallback(
    async (showRefresh = false) => {
      try {
        if (showRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError("");

        const response = await authenticatedFetch(`${API}/volunteer`);

        let data = {};
        try {
          data = await response.json();
        } catch {
          data = {};
        }

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load volunteer requests."
          );
        }

        const volunteerData = Array.isArray(data)
          ? data
          : data.applications || data.volunteers || data.data || [];

        setApplications(volunteerData);
      } catch (err) {
        console.error("Volunteer fetch error:", err);
        setError(err.message || "Unable to connect to backend server.");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [authenticatedFetch]
  );

  // =====================================================
  // UPDATE STATUS (PENDING / APPROVED / REJECTED)
  // =====================================================
  const updateStatus = async (id, status) => {
    try {
      setUpdatingId(id);
      setError("");

      const response = await authenticatedFetch(
        `${API}/volunteer/${id}/status`,
        {
          method: "PATCH",
          body: JSON.stringify({ status }),
        }
      );

      let data = {};
      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update volunteer status."
        );
      }

      setApplications((previous) =>
        previous.map((item) =>
          item._id === id
            ? {
                ...item,
                status: data.volunteer?.status || status,
              }
            : item
        )
      );
    } catch (err) {
      console.error("Update volunteer status error:", err);
      setError(err.message || "Unable to update volunteer status.");
    } finally {
      setUpdatingId(null);
    }
  };

  // =====================================================
  // DELETE
  // =====================================================
  const deleteApplication = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to permanently delete this volunteer request?"
    );

    if (!confirmDelete) return;

    try {
      setUpdatingId(id);
      setError("");

      const response = await authenticatedFetch(`${API}/volunteer/${id}`, {
        method: "DELETE",
      });

      let data = {};
      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete volunteer request."
        );
      }

      setApplications((previous) =>
        previous.filter((item) => item._id !== id)
      );
    } catch (err) {
      console.error("Delete volunteer error:", err);
      setError(err.message || "Unable to delete volunteer request.");
    } finally {
      setUpdatingId(null);
    }
  };

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  // =====================================================
  // SEARCH & FILTER
  // =====================================================
  const filteredApplications = useMemo(() => {
    const value = search.trim().toLowerCase();

    return applications.filter((item) => {
      const currentStatus = item.status || "Pending";
      const matchesStatus =
        statusFilter === "All" || currentStatus === statusFilter;

      const matchesSearch =
        !value ||
        [item.name, item.email, item.phone, item.activity]
          .filter(Boolean)
          .some((field) => String(field).toLowerCase().includes(value));

      return matchesStatus && matchesSearch;
    });
  }, [applications, search, statusFilter]);

  const formatDate = (date) => {
    if (!date) return "Date unavailable";
    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) return "Date unavailable";
    return parsedDate.toLocaleString();
  };

  return (
    <div className="volunteer-admin-page">
      <section className="volunteer-admin-hero">
        <div className="volunteer-hero-glow volunteer-glow-one"></div>
        <div className="volunteer-hero-glow volunteer-glow-two"></div>

        <div className="volunteer-hero-inner">
          <div>
            <div className="volunteer-eyebrow">
              <span></span>
              ADMINISTRATION
            </div>

            <h1>Volunteer Requests</h1>

            <p>
              Review, approve and manage everyone who has registered to support
              your sanctuary.
            </p>
          </div>

          <div className="volunteer-hero-actions">
            <button
              type="button"
              className="volunteer-refresh-btn"
              onClick={() => loadApplications(true)}
              disabled={refreshing || loading}
            >
              <span className={refreshing ? "spin" : ""}>↻</span>
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>

            <Link to="/admin" className="volunteer-dashboard-btn">
              ← Dashboard
            </Link>
          </div>
        </div>
      </section>

      <main className="volunteer-admin-content">
        <section className="volunteer-stats">
          <div className="volunteer-stat-card stat-orange">
            <div className="volunteer-stat-icon">🤝</div>
            <div>
              <div className="volunteer-stat-label">TOTAL VOLUNTEERS</div>
              <div className="volunteer-stat-number">
                {loading ? "—" : applications.length}
              </div>
              <div className="volunteer-stat-description">
                Registrations received
              </div>
            </div>
          </div>

          <div className="volunteer-stat-card stat-blue">
            <div className="volunteer-stat-icon">🐾</div>
            <div>
              <div className="volunteer-stat-label">APPROVED</div>
              <div className="volunteer-stat-number">
                {loading
                  ? "—"
                  : applications.filter((a) => a.status === "Approved").length}
              </div>
              <div className="volunteer-stat-description">
                Active sanctuary volunteers
              </div>
            </div>
          </div>

          <div className="volunteer-stat-card stat-green">
            <div className="volunteer-stat-icon">⏳</div>
            <div>
              <div className="volunteer-stat-label">PENDING</div>
              <div className="volunteer-stat-number">
                {loading
                  ? "—"
                  : applications.filter(
                      (a) => (a.status || "Pending") === "Pending"
                    ).length}
              </div>
              <div className="volunteer-stat-description">
                Awaiting admin review
              </div>
            </div>
          </div>
        </section>

        <section className="volunteer-toolbar">
          <div className="volunteer-search">
            <span>⌕</span>
            <input
              type="text"
              placeholder="Search name, email, phone or activity..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            {search && (
              <button
                type="button"
                className="clear-search"
                onClick={() => setSearch("")}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>

          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {["All", "Pending", "Approved", "Rejected"].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                style={{
                  padding: "8px 14px",
                  borderRadius: "999px",
                  border: "1px solid #d1d5db",
                  background: statusFilter === status ? "#d97706" : "#ffffff",
                  color: statusFilter === status ? "#ffffff" : "#374151",
                  fontWeight: "600",
                  fontSize: "13px",
                  cursor: "pointer",
                }}
              >
                {status}
              </button>
            ))}
          </div>
        </section>

        {error && (
          <div className="volunteer-error">
            <div>
              <strong>Unable to load requests</strong>
              <p>{error}</p>
            </div>
            <button type="button" onClick={() => loadApplications()}>
              Try Again
            </button>
          </div>
        )}

        {loading && !error && (
          <div className="volunteer-loading">
            <div className="loading-spinner"></div>
            <h3>Loading volunteer requests...</h3>
            <p>Please wait while we fetch the latest registrations.</p>
          </div>
        )}

        {!loading && !error && filteredApplications.length === 0 && (
          <div className="volunteer-empty">
            <div className="volunteer-empty-icon">{search ? "⌕" : "🤝"}</div>
            <h3>
              {search || statusFilter !== "All"
                ? "No matching volunteers"
                : "No volunteer requests yet"}
            </h3>
            <p>
              {search || statusFilter !== "All"
                ? "Try changing your search or status filter."
                : "Volunteer registrations will appear here when visitors sign up."}
            </p>
          </div>
        )}

        {!loading && !error && filteredApplications.length > 0 && (
          <section className="volunteer-list-section">
            <div className="volunteer-list-heading">
              <div>
                <div className="volunteer-section-label">
                  VOLUNTEER MANAGEMENT
                </div>
                <h2>Registered Volunteers</h2>
                <p>
                  Review contact details, approve volunteers or manage
                  requests.
                </p>
              </div>
            </div>

            <div className="volunteer-list">
              {filteredApplications.map((item) => {
                const isUpdating = updatingId === item._id;
                const currentStatus = item.status || "Pending";

                const statusBadgeColors =
                  currentStatus === "Approved"
                    ? { bg: "#dcfce7", color: "#15803d" }
                    : currentStatus === "Rejected"
                    ? { bg: "#fee2e2", color: "#b91c1c" }
                    : { bg: "#fef3c7", color: "#b45309" };

                return (
                  <article className="volunteer-request-card" key={item._id}>
                    <div className="volunteer-card-top">
                      <div className="volunteer-person">
                        <div className="volunteer-avatar">
                          {item.name
                            ? item.name.charAt(0).toUpperCase()
                            : "V"}
                        </div>

                        <div>
                          <div className="volunteer-person-label">
                            VOLUNTEER
                          </div>
                          <h3>{item.name || "Unknown Volunteer"}</h3>
                          <div className="volunteer-id">
                            ID: {item._id || "N/A"}
                          </div>
                        </div>
                      </div>

                      <span
                        className="volunteer-status"
                        style={{
                          background: statusBadgeColors.bg,
                          color: statusBadgeColors.color,
                        }}
                      >
                        {currentStatus}
                      </span>
                    </div>

                    <div className="volunteer-details">
                      <div className="volunteer-detail">
                        <div className="detail-icon">✉</div>
                        <div>
                          <span>EMAIL</span>
                          <strong>{item.email || "Not provided"}</strong>
                        </div>
                      </div>

                      <div className="volunteer-detail">
                        <div className="detail-icon">☎</div>
                        <div>
                          <span>PHONE</span>
                          <strong>{item.phone || "Not provided"}</strong>
                        </div>
                      </div>

                      <div className="volunteer-detail">
                        <div className="detail-icon">🐾</div>
                        <div>
                          <span>INTERESTED IN</span>
                          <strong>
                            {item.activity || "General volunteering"}
                          </strong>
                        </div>
                      </div>

                      <div className="volunteer-detail">
                        <div className="detail-icon">◷</div>
                        <div>
                          <span>SUBMITTED</span>
                          <strong>{formatDate(item.createdAt)}</strong>
                        </div>
                      </div>
                    </div>

                    <div
                      className="volunteer-card-footer"
                      style={{ flexWrap: "wrap", gap: "10px" }}
                    >
                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                          flexWrap: "wrap",
                        }}
                      >
                        <button
                          type="button"
                          disabled={isUpdating}
                          onClick={() => updateStatus(item._id, "Pending")}
                          style={{
                            padding: "7px 12px",
                            borderRadius: "8px",
                            border: "1px solid #d1d5db",
                            background:
                              currentStatus === "Pending" ? "#f59e0b" : "#fff",
                            color:
                              currentStatus === "Pending" ? "#fff" : "#374151",
                            fontWeight: "600",
                            fontSize: "12px",
                            cursor: "pointer",
                          }}
                        >
                          Pending
                        </button>

                        <button
                          type="button"
                          disabled={isUpdating}
                          onClick={() => updateStatus(item._id, "Approved")}
                          style={{
                            padding: "7px 12px",
                            borderRadius: "8px",
                            border: "1px solid #16a34a",
                            background:
                              currentStatus === "Approved" ? "#16a34a" : "#fff",
                            color:
                              currentStatus === "Approved" ? "#fff" : "#16a34a",
                            fontWeight: "600",
                            fontSize: "12px",
                            cursor: "pointer",
                          }}
                        >
                          ✓ Approve
                        </button>

                        <button
                          type="button"
                          disabled={isUpdating}
                          onClick={() => updateStatus(item._id, "Rejected")}
                          style={{
                            padding: "7px 12px",
                            borderRadius: "8px",
                            border: "1px solid #dc2626",
                            background:
                              currentStatus === "Rejected" ? "#dc2626" : "#fff",
                            color:
                              currentStatus === "Rejected" ? "#fff" : "#dc2626",
                            fontWeight: "600",
                            fontSize: "12px",
                            cursor: "pointer",
                          }}
                        >
                          × Reject
                        </button>
                      </div>

                      <button
                        type="button"
                        className="volunteer-delete-btn"
                        onClick={() => deleteApplication(item._id)}
                        disabled={isUpdating}
                      >
                        {isUpdating ? "..." : "× Delete Request"}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default VolunteerRequests;