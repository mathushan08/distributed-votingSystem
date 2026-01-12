import { useState, useEffect } from "react";
import ElectionList from "./ElectionList";
import ElectionResults from "./ElectionResults";
import Layout from "../components/Layout";
import { apiFetch } from "../api";
import "./VoterPortal.css";

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState("vote"); // vote | results
  const [pastElections, setPastElections] = useState([]);

  useEffect(() => {
    // In a real app we'd filter by status on the backend
    apiFetch("/elections").then(all => {
      // Mocking status logic: simple assumption or just show all for now
      // Since backend doesn't support status, we will just list all in results for now
      setPastElections(all);
    });
  }, []);

  return (
    <Layout role="Voter">
      <div className="vp-header">
        <h1 className="vp-title">Voter Command Center</h1>

      </div>

      <div className="vp-tabs">
        <button
          className={`vp-tab ${activeTab === "vote" ? "active" : ""}`}
          onClick={() => setActiveTab("vote")}
        >
          Official Ballots
        </button>
        <button
          className={`vp-tab ${activeTab === "results" ? "active" : ""}`}
          onClick={() => setActiveTab("results")}
        >
          Election Results
        </button>
      </div>

      {activeTab === "vote" ? (
        <ElectionList />
      ) : (
        <div style={{ display: "grid", gap: "2rem" }}>
          {pastElections.length === 0 && <p style={{ color: "#64748b" }}>No election records found.</p>}
          {pastElections.map(e => (
            <ElectionResults key={e.id} electionId={e.id} endTime={e.end_time} title={e.title} />
          ))}
        </div>
      )}
    </Layout>
  );
}
