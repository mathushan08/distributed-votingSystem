import { useState, useEffect } from "react";
import ElectionList from "./ElectionList";
import ElectionResults from "./ElectionResults";
import Layout from "../components/Layout";
import { apiFetch } from "../api";

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
      <div className="flex gap-4" style={{ marginBottom: "2rem" }}>
        <button
          className={activeTab === "vote" ? "" : "outline"}
          onClick={() => setActiveTab("vote")}
        >
          Active Elections
        </button>
        <button
          className={activeTab === "results" ? "" : "outline"}
          onClick={() => setActiveTab("results")}
        >
          Past Results
        </button>
      </div>

      {activeTab === "vote" ? (
        <ElectionList />
      ) : (
        <div className="grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "2rem" }}>
          {pastElections.length === 0 && <p>No past elections.</p>}
          {pastElections.map(e => (
            <div key={e.id} className="card">
              <h3>{e.title}</h3>
              <ElectionResults electionId={e.id} endTime={e.end_time} />
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}
