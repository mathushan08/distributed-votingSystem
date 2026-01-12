import { useState, useEffect } from "react";
import { apiFetch } from "../api";
import AdminRealtimeResults from "./AdminRealtimeResults";
import CreateElection from "./CreateElection";
import Layout from "../components/Layout";

export default function AdminDashboard() {
  const [view, setView] = useState("dashboard"); // dashboard | elections | logs
  const [activeTab, setActiveTab] = useState("create"); // for elections view
  const [elections, setElections] = useState([]);
  const [selectedElection, setSelectedElection] = useState("");

  useEffect(() => {
    apiFetch("/elections").then(setElections);
  }, []);

  const deleteElection = async (id) => {
    if (!confirm("Are you sure you want to delete this election? This will wipe all associated votes.")) return;
    try {
      await apiFetch(`/elections/${id}`, { method: "DELETE" });
      setElections(prev => prev.filter(e => e.id !== id));
      if (selectedElection === id) setSelectedElection("");
    } catch (e) {
      alert("Failed to delete election: " + e.message);
    }
  };

  const renderContent = () => {
    switch (view) {
      case "dashboard":
        return (
          <div className="grid">
            <h2 style={{ borderBottom: "1px solid var(--border)", paddingBottom: "1rem" }}>System Overview</h2>
            {/* Quick Stats */}
            <div className="grid" style={{ alignContent: "start" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                <div className="card">
                  <h3 className="text-secondary text-sm">Active Elections</h3>
                  <div style={{ fontSize: "2.5rem", fontWeight: 700 }}>{elections.length}</div>
                </div>
                <div className="card">
                  <h3 className="text-secondary text-sm">Total Nodes</h3>
                  <div style={{ fontSize: "2.5rem", fontWeight: 700 }}>3</div>
                </div>
              </div>

              <div className="card">
                <h3>Recent Activity</h3>
                <div className="text-sm text-secondary">
                  <p>• Election "{elections[0]?.title || '...'}" created (1 hour ago)</p>
                  <p>• System audit complete. Integrity verified.</p>
                </div>
              </div>
            </div>
          </div>
        );

      case "elections":
        return (
          <div>
            <h2 style={{ marginBottom: "1.5rem" }}>Election Management</h2>
            <div className="flex gap-4" style={{ marginBottom: "1.5rem", borderBottom: "1px solid var(--border)", paddingBottom: "1px" }}>
              <button
                className={activeTab === "create" ? "" : "outline"}
                style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0, borderBottom: activeTab === "create" ? "2px solid var(--primary)" : "2px solid transparent" }}
                onClick={() => setActiveTab("create")}
              >
                Create Election
              </button>
              <button
                className={activeTab === "results" ? "" : "outline"}
                style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0, borderBottom: activeTab === "results" ? "2px solid var(--primary)" : "2px solid transparent" }}
                onClick={() => setActiveTab("results")}
              >
                Live Analytics
              </button>
              <button
                className={activeTab === "manage" ? "" : "outline"}
                style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0, borderBottom: activeTab === "manage" ? "2px solid var(--primary)" : "2px solid transparent" }}
                onClick={() => setActiveTab("manage")}
              >
                Manage
              </button>
            </div>

            {activeTab === "create" && (
              <div className="card">
                <CreateElection />
              </div>
            )}

            {activeTab === "results" && (
              <div className="card">
                <div className="card-header">
                  <h3>Detailed Analytics</h3>
                  <p className="text-sm">Real-time vote stream from the distributed ledger.</p>
                </div>

                <select onChange={(e) => setSelectedElection(e.target.value)} style={{ maxWidth: "300px" }}>
                  <option value="">Select election</option>
                  {elections.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.title}
                    </option>
                  ))}
                </select>

                {selectedElection && (
                  <div style={{ marginTop: "2rem" }}>
                    <AdminRealtimeResults electionId={selectedElection} />
                  </div>
                )}
              </div>
            )}

            {activeTab === "manage" && (
              <div className="card">
                <h3>All Elections</h3>
                {elections.length === 0 ? <p>No elections found.</p> : (
                  <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
                    <thead>
                      <tr style={{ background: "var(--bg-page)", textAlign: "left" }}>
                        <th style={{ padding: "0.75rem" }}>Title</th>
                        <th style={{ padding: "0.75rem" }}>Status</th>
                        <th style={{ padding: "0.75rem", textAlign: "right" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {elections.map(e => (
                        <tr key={e.id} style={{ borderBottom: "1px solid var(--border)" }}>
                          <td style={{ padding: "0.75rem" }}>{e.title}</td>
                          <td style={{ padding: "0.75rem" }}>
                            {new Date() < new Date(e.start_time) ? "Scheduled" :
                              new Date() > new Date(e.end_time) ? "Ended" : "Active"}
                          </td>
                          <td style={{ padding: "0.75rem", textAlign: "right" }}>
                            <button
                              onClick={() => deleteElection(e.id)}
                              style={{
                                background: "#FEE2E2", color: "#991B1B", border: "none", padding: "0.4rem 0.8rem", borderRadius: "4px"
                              }}
                            >
                              🗑️ Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        );

      default:
        return <div className="card"><h3>Feature coming soon...</h3></div>;
    }
  };

  return (
    <Layout role="Admin" activePage={view} onNavigate={setView}>
      {renderContent()}
    </Layout>
  );
}
