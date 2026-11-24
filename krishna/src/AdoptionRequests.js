import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AdoptionRequests.css";

const BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000";
const API = `${BASE_URL}/api`;

function AdoptionRequests() {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // =====================================================
  // GET AUTH TOKEN
  // =====================================================
  const getAuthToken = useCallback(() => {
    const token = localStorage.getItem("token");
    const adminToken = localStorage.getItem("adminToken");
    return token || adminToken || null;
  }, []);

  // =====================================================
  // AUTHENTICATED REQUEST HELPER
  // =====================================================
  const authenticatedFetch = useCallback(
    async (url, options = {}) => {
      const token = getAuthToken();

      if (!token) {
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
  // LOAD APPLICATIONS
  // =====================================================
  const loadApplications = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await authenticatedFetch(`${API}/adoption`);

      let data = {};
      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load adoption requests."
        );
      }

      const applicationsData = Array.isArray(data)
        ? data
        : data.applications || data.data || [];

      setApplications(applicationsData);
    } catch (err) {
      console.error("Load adoption requests error:", err);
      setError(err.message || "Unable to connect to backend server.");
    } finally {
      setLoading(false);
    }
  }, [authenticatedFetch]);

  // =====================================================
  // UPDATE STATUS
  // =====================================================
  const updateStatus = async (id, status) => {
    try {
      setUpdatingId(id);
      setError("");

      const response = await authenticatedFetch(
        `${API}/adoption/${id}/status`,
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
          data.message || "Failed to update application status."
        );
      }

      setApplications((previous) =>
        previous.map((item) =>
          item._id === id
            ? {
                ...item,
                status:
                  data.application?.status || data.status || status,
              }
            : item
        )
      );
    } catch (err) {
      console.error("Update status error:", err);
      setError(err.message || "Unable to update application status.");
    } finally {
      setUpdatingId(null);
    }
  };

  // =====================================================
  // DELETE APPLICATION
  // =====================================================
  const deleteApplication = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this adoption application?"
    );

    if (!confirmed) return;

    try {
      setUpdatingId(id);
      setError("");

      const response = await authenticatedFetch(`${API}/adoption/${id}`, {
        method: "DELETE",
      });

      let data = {};
      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete application.");
      }

      setApplications((previous) =>
        previous.filter((item) => item._id !== id)
      );
    } catch (err) {
      console.error("Delete application error:", err);
      setError(err.message || "Unable to delete application.");
    } finally {
      setUpdatingId(null);
    }
  };

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  // =====================================================
  // STATISTICS
  // =====================================================
  const statistics = useMemo(() => {
    const pending = applications.filter(
      (item) => (item.status || "Pending") === "Pending"
    ).length;

    const approved = applications.filter(
      (item) => item.status === "Approved"
    ).length;

    const rejected = applications.filter(
      (item) => item.status === "Rejected"
    ).length;

    return {
      total: applications.length,
      pending,
      approved,
      rejected,
    };
  }, [applications]);

  // =====================================================
  // FILTER APPLICATIONS
  // =====================================================
  const filteredApplications = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return applications.filter((item) => {
      const currentStatus = item.status || "Pending";

      const matchesStatus =
        statusFilter === "All" || currentStatus === statusFilter;

      const matchesSearch =
        !searchValue ||
        String(item.name || "")
          .toLowerCase()
          .includes(searchValue) ||
        String(item.email || "")
          .toLowerCase()
          .includes(searchValue) ||
        String(item.phone || "")
          .toLowerCase()
          .includes(searchValue) ||
        String(item.dog || "")
          .toLowerCase()
          .includes(searchValue);

      return matchesStatus && matchesSearch;
    });
  }, [applications, search, statusFilter]);

  const getStatusClass = (status) => {
    const currentStatus = status || "Pending";
    if (currentStatus === "Approved") return "application-status approved";
    if (currentStatus === "Rejected") return "application-status rejected";
    return "application-status pending";
  };

  const getStatusIcon = (status) => {
    const currentStatus = status || "Pending";
    if (currentStatus === "Approved") return "✓";
    if (currentStatus === "Rejected") return "×";
    return "•";
  };

  const formatDate = (date) => {
    if (!date) return "Date unavailable";
    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) return "Date unavailable";
    return parsedDate.toLocaleString();
  };

  return (
    <main className="adoption-admin-page">
      <div className="adoption-admin-container">
        {/* PAGE HEADER */}
        <section className="adoption-page-header">
          <div className="adoption-header-content">
            <div>
              <div className="adoption-eyebrow">ADMINISTRATION</div>
              <h1>Adoption Applications</h1>
              <p>
                Review, manage and track every adoption application submitted
                to the sanctuary.
              </p>
            </div>

            <div className="adoption-header-actions">
              <button
                type="button"
                className="adoption-refresh-btn"
                onClick={loadApplications}
                disabled={loading}
              >
                <span className={loading ? "spin" : ""}>↻</span>
                {loading ? "Refreshing..." : "Refresh"}
              </button>

              <Link to="/admin" className="adoption-dashboard-btn">
                ← Dashboard
              </Link>
            </div>
          </div>
        </section>

        {/* ERROR */}
        {error && (
          <div className="adoption-error">
            <div className="adoption-error-icon">!</div>
            <div>
              <strong>Something went wrong</strong>
              <p>{error}</p>
            </div>
            <button type="button" onClick={loadApplications}>
              Try Again
            </button>
          </div>
        )}

        {/* STATISTICS */}
        <section className="adoption-stats-grid">
          <div className="adoption-stat-card total">
            <div className="adoption-stat-icon">📋</div>
            <div>
              <span>Total Applications</span>
              <strong>{statistics.total}</strong>
            </div>
          </div>

          <div className="adoption-stat-card pending">
            <div className="adoption-stat-icon">◷</div>
            <div>
              <span>Pending Review</span>
              <strong>{statistics.pending}</strong>
            </div>
          </div>

          <div className="adoption-stat-card approved">
            <div className="adoption-stat-icon">✓</div>
            <div>
              <span>Approved</span>
              <strong>{statistics.approved}</strong>
            </div>
          </div>

          <div className="adoption-stat-card rejected">
            <div className="adoption-stat-icon">×</div>
            <div>
              <span>Rejected</span>
              <strong>{statistics.rejected}</strong>
            </div>
          </div>
        </section>

        {/* FILTER BAR */}
        <section className="adoption-filter-panel">
          <div className="adoption-search-box">
            <span>⌕</span>
            <input
              type="text"
              placeholder="Search applicant, email, phone or dog..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>

          <div className="adoption-filter-group">
            <span>Filter:</span>
            {["All", "Pending", "Approved", "Rejected"].map((status) => (
              <button
                key={status}
                type="button"
                className={statusFilter === status ? "active" : ""}
                onClick={() => setStatusFilter(status)}
              >
                {status}
              </button>
            ))}
          </div>
        </section>

        {/* RESULTS HEADER */}
        <div className="adoption-results-header">
          <div>
            <h2>Applications</h2>
            <span>
              Showing {filteredApplications.length} of {applications.length}
            </span>
          </div>
        </div>

        {/* LOADING */}
        {loading ? (
          <section className="adoption-state-card">
            <div className="adoption-loader"></div>
            <h3>Loading applications...</h3>
            <p>
              Please wait while we fetch the latest adoption requests.
            </p>
          </section>
        ) : filteredApplications.length === 0 ? (
          <section className="adoption-state-card empty">
            <div className="adoption-empty-icon">🐾</div>
            <h3>
              {applications.length === 0
                ? "No adoption applications yet"
                : "No matching applications"}
            </h3>
            <p>
              {applications.length === 0
                ? "New adoption applications will appear here."
                : "Try changing your search or status filter."}
            </p>

            {applications.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("All");
                }}
                className="adoption-reset-btn"
              >
                Reset Filters
              </button>
            )}
          </section>
        ) : (
          <section className="adoption-application-list">
            {filteredApplications.map((item) => {
              const currentStatus = item.status || "Pending";
              const isUpdating = updatingId === item._id;

              return (
                <article
                  key={item._id}
                  className="adoption-application-card"
                >
                  <div className="application-card-top">
                    <div className="applicant-profile">
                      <div className="applicant-avatar">
                        {item.name ? item.name.charAt(0).toUpperCase() : "A"}
                      </div>

                      <div>
                        <span className="application-label">APPLICANT</span>
                        <h3>{item.name || "Unknown Applicant"}</h3>
                        <span className="application-id">ID: {item._id}</span>
                      </div>
                    </div>

                    <span className={getStatusClass(currentStatus)}>
                      <span>{getStatusIcon(currentStatus)}</span>
                      {currentStatus}
                    </span>
                  </div>

                  <div className="application-info-grid">
                    <div className="application-info-item">
                      <span className="info-icon">✉</span>
                      <div>
                        <small>Email</small>
                        <strong>{item.email || "Not provided"}</strong>
                      </div>
                    </div>

                    <div className="application-info-item">
                      <span className="info-icon">☎</span>
                      <div>
                        <small>Phone</small>
                        <strong>{item.phone || "Not provided"}</strong>
                      </div>
                    </div>

                    <div className="application-info-item dog">
                      <span className="info-icon">🐶</span>
                      <div>
                        <small>Interested In</small>
                        <strong>{item.dog || "Dog not specified"}</strong>
                      </div>
                    </div>

                    <div className="application-info-item">
                      <span className="info-icon">🗓</span>
                      <div>
                        <small>Submitted</small>
                        <strong>
                          {formatDate(
                            item.createdAt ||
                              item.date ||
                              item.submittedAt
                          )}
                        </strong>
                      </div>
                    </div>
                  </div>

                  {(item.message ||
                    item.address ||
                    item.reason ||
                    item.experience) && (
                    <div className="application-details">
                      {item.address && (
                        <div>
                          <small>Address</small>
                          <p>{item.address}</p>
                        </div>
                      )}

                      {item.reason && (
                        <div>
                          <small>Reason for Adoption</small>
                          <p>{item.reason}</p>
                        </div>
                      )}

                      {item.experience && (
                        <div>
                          <small>Previous Experience</small>
                          <p>{item.experience}</p>
                        </div>
                      )}

                      {item.message && (
                        <div>
                          <small>Message</small>
                          <p>{item.message}</p>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="application-actions">
                    <div className="application-action-label">
                      Update Status
                    </div>

                    <div className="application-status-actions">
                      <button
                        type="button"
                        disabled={isUpdating}
                        className={currentStatus === "Pending" ? "active" : ""}
                        onClick={() => updateStatus(item._id, "Pending")}
                      >
                        {isUpdating && currentStatus !== "Pending"
                          ? "..."
                          : "Pending"}
                      </button>

                      <button
                        type="button"
                        disabled={isUpdating}
                        className={
                          currentStatus === "Approved" ? "active approved" : ""
                        }
                        onClick={() => updateStatus(item._id, "Approved")}
                      >
                        {isUpdating && currentStatus !== "Approved"
                          ? "..."
                          : "✓ Approve"}
                      </button>

                      <button
                        type="button"
                        disabled={isUpdating}
                        className={
                          currentStatus === "Rejected" ? "active rejected" : ""
                        }
                        onClick={() => updateStatus(item._id, "Rejected")}
                      >
                        {isUpdating && currentStatus !== "Rejected"
                          ? "..."
                          : "× Reject"}
                      </button>

                      <button
                        type="button"
                        disabled={isUpdating}
                        className="delete"
                        onClick={() => deleteApplication(item._id)}
                      >
                        {isUpdating ? "..." : "Delete"}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
}

export default AdoptionRequests;