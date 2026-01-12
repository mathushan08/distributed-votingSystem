import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api";
import Modal from "../components/Modal";
import "./VoterPortal.css";

export default function ElectionList() {
  const navigate = useNavigate();

  const [elections, setElections] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [selectedElection, setSelectedElection] = useState(null);
  const [candidateId, setCandidateId] = useState(null);
  const [error, setError] = useState("");

  const [currentTime, setCurrentTime] = useState(new Date());

  // 🕒 Live status updates
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 🔒 Auth guard + load elections
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    apiFetch("/elections")
      .then(setElections)
      .catch(err => {
        console.error("Election load failed", err);
        navigate("/login"); // simple fallback
      });
  }, [navigate]);

  const loadCandidates = async (id) => {
    setSelectedElection(id);
    setCandidateId(null); // reset previous vote
    setError("");
    try {
      const data = await apiFetch(`/elections/${id}/candidates`);
      setCandidates(data.candidates);
    } catch (e) {
      setError("Failed to load candidates");
    }
  };

  const [showConfirm, setShowConfirm] = useState(false);

  const confirmVote = () => {
    setShowConfirm(true);
  }

  const handleVote = async () => {
    if (!candidateId) return;

    try {
      await apiFetch("/vote", {
        method: "POST",
        body: JSON.stringify({
          election_id: selectedElection,
          candidate_id: candidateId,
        }),
      });

      // Update local state to reflect voted status
      setElections(prev => prev.map(e =>
        e.id === selectedElection ? { ...e, has_voted: true } : e
      ));

      setCandidateId(null);
      setSelectedElection(null);
      setShowConfirm(false);
      alert("✅ Vote successfully recorded and cryptographically signed.");
    } catch (e) {
      let msg = e.message;
      if (msg.includes("Already voted") || msg.includes("400")) {
        msg = "⚠️ Vote Rejected: A ballot has already been submitted for this ID.";
      }
      alert(msg);
      setShowConfirm(false);
    }
  };

  const getCandidateName = (id) => candidates.find(c => c.id === id)?.name;

  return (
    <div>
      {error && <div className="status-alert">{error}</div>}

      <div style={{ display: "grid", gap: "1.5rem" }}>
        {elections.map(e => {
          const start = new Date(e.start_time);
          const end = new Date(e.end_time);
          const isEnded = currentTime > end;
          const isUpcoming = currentTime < start;
          const isVoted = e.has_voted;
          const isActive = !isEnded && !isUpcoming && !isVoted;

          let statusClass = "vp-card";
          if (isEnded) statusClass += " ended";
          else if (isVoted) statusClass += " voted";
          else if (isUpcoming) statusClass += " upcoming";
          else statusClass += " active";

          return (
            <div key={e.id} className={statusClass}>
              <div className="vp-card-header">
                <div>
                  <div style={{ fontSize: "0.7rem", textTransform: "uppercase", color: "#64748b", fontWeight: 700, marginBottom: "0.25rem" }}>
                    Election ID: {e.id.substring(0, 8).toUpperCase()}
                  </div>
                  <h3 className="vp-card-title">{e.title}</h3>
                </div>

                {isEnded && <span className="vp-status vp-status-ended">Closed</span>}
                {isVoted && <span className="vp-status vp-status-voted">Vote Cast</span>}
                {isUpcoming && <span className="vp-status vp-status-upcoming">Scheduled</span>}
                {isActive && <span className="vp-status vp-status-active">Ballot Open</span>}
              </div>

              <div className="vp-card-body">
                <div className="vp-meta-grid">
                  <div>
                    <span className="vp-meta-label">Start Time</span>
                    <div className="vp-meta-value">{start.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="vp-meta-label">End Time</span>
                    <div className="vp-meta-value">{end.toLocaleString()}</div>
                  </div>
                </div>

                {!isEnded && !isVoted && !selectedElection && isUpcoming === false && (
                  <button className="vp-btn vp-btn-primary" onClick={() => loadCandidates(e.id)}>
                    Access Official Ballot
                  </button>
                )}

                {/* Inline Ballot Interface */}
                {selectedElection === e.id && (
                  <div style={{ marginTop: "1.5rem", borderTop: "1px dashed #cbd5e1", paddingTop: "1.5rem" }}>
                    <h4 style={{ fontSize: "0.9rem", textTransform: "uppercase", color: "#0f172a", marginBottom: "1rem" }}>
                      Select Candidate
                    </h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem" }}>
                      {candidates.map(c => (
                        <label key={c.id} style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "1rem",
                          padding: "0.75rem 1rem",
                          border: candidateId === c.id ? "1px solid #1e3a8a" : "1px solid #e2e8f0",
                          borderRadius: "4px",
                          background: candidateId === c.id ? "#eff6ff" : "white",
                          cursor: "pointer",
                          transition: "all 0.2s"
                        }}>
                          <input
                            type="radio"
                            name="candidate"
                            checked={candidateId === c.id}
                            onChange={() => setCandidateId(c.id)}
                            style={{ margin: 0, width: "1.25em", height: "1.25em" }}
                          />
                          <span style={{ fontWeight: 500, color: "#0f172a" }}>{c.name}</span>
                        </label>
                      ))}
                    </div>

                    <div style={{ display: "flex", gap: "1rem" }}>
                      <button className="vp-btn vp-btn-primary" onClick={confirmVote} disabled={!candidateId}>
                        Sign & Submit Vote
                      </button>
                      <button className="vp-btn vp-btn-outline" onClick={() => setSelectedElection(null)}>
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <Modal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        title="Confirm Ballot Submission"
        actions={
          <>
            <button className="vp-btn vp-btn-outline" onClick={() => setShowConfirm(false)}>Review</button>
            <button className="vp-btn vp-btn-primary" onClick={handleVote}>Confirm & Cast Vote</button>
          </>
        }
      >
        <div style={{ textAlign: "center", padding: "1rem 0" }}>
          <p style={{ color: "#64748b", marginBottom: "1rem" }}>You are about to cryptographically sign and submit your vote for:</p>
          <div style={{
            background: "#f8fafc",
            padding: "1rem",
            border: "1px solid #e2e8f0",
            borderRadius: "4px",
            marginBottom: "1.5rem"
          }}>
            <h3 style={{ fontSize: "1.25rem", color: "#0f172a", margin: 0 }}>
              {getCandidateName(candidateId)}
            </h3>
          </div>
          <div style={{
            fontSize: "0.85rem",
            color: "#b45309",
            background: "#fffbeb",
            padding: "0.5rem",
            borderRadius: "2px",
            border: "1px solid #fde68a"
          }}>
            ⚠️ Warning: Blockchain transactions are immutable. This action cannot be undone.
          </div>
        </div>
      </Modal>

      {elections.length === 0 && <p>No active elections found.</p>}
    </div>
  );
}
