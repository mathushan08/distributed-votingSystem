import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api";
import Modal from "../components/Modal";

export default function ElectionList() {
  const navigate = useNavigate();

  const [elections, setElections] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [selectedElection, setSelectedElection] = useState(null);
  const [candidateId, setCandidateId] = useState(null);
  const [error, setError] = useState("");

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

    // ... logic 
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
      // Show success toast or modal ideally, but alert is fine for success state for now or small notification
      // Let's use a simple success state in the UI if possible, but for now just clear it.
      alert("✅ Vote successfully recorded on the ledger.");
    } catch (e) {
      let msg = e.message;
      if (msg.includes("Already voted") || msg.includes("400")) {
        msg = "⚠️ You have already voted in this election.";
      }
      alert(msg);
      setShowConfirm(false);
    }
  };

  const getCandidateName = (id) => candidates.find(c => c.id === id)?.name;

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Active Elections</h2>
      <p style={{ color: "var(--text-secondary)", marginBottom: "2rem" }}>Select a ballot to cast your vote.</p>

      {error && <div style={{
        padding: "1rem",
        background: "#fee2e2",
        color: "#dc2626",
        borderRadius: "var(--radius)",
        marginBottom: "1rem"
      }}>{error}</div>}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
        {elections.map(e => {
          const now = new Date();
          const start = new Date(e.start_time);
          const end = new Date(e.end_time);
          const isEnded = now > end;
          const isUpcoming = now < start;
          const isVoted = e.has_voted;
          const isActive = !isEnded && !isUpcoming && !isVoted;

          return (
            <div key={e.id} className="card" style={{
              border: selectedElection === e.id ? "2px solid var(--primary)" : "1px solid var(--border)",
              cursor: (isEnded || isVoted) ? "not-allowed" : "pointer",
              transition: "all 0.2s",
              opacity: (isEnded || isVoted) ? 0.7 : 1,
              background: (isEnded || isVoted) ? "var(--bg-page)" : "white"
            }} onClick={() => !isEnded && !isVoted && loadCandidates(e.id)}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "0.5rem" }}>
                <h3 style={{ fontSize: "1.25rem", margin: 0 }}>{e.title}</h3>
                {isEnded && <span className="badge error">Ended</span>}
                {isVoted && <span className="badge success">Voted</span>}
                {isUpcoming && <span className="badge sync">Upcoming</span>}
                {isActive && <span className="badge active">Active</span>}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", fontSize: "0.9em", color: "var(--text-secondary)" }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase" }}>Starts</div>
                  <div>{start.toLocaleDateString()}</div>
                  <div style={{ fontSize: "0.85em" }}>{start.toLocaleTimeString()}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase" }}>Ends</div>
                  <div>{end.toLocaleDateString()}</div>
                  <div style={{ fontSize: "0.85em" }}>{end.toLocaleTimeString()}</div>
                </div>
              </div>

              {/* Show candidates inside the card if selected */}
              {selectedElection === e.id && (
                <div style={{ marginTop: "1.5rem", borderTop: "1px solid var(--border)", paddingTop: "1rem" }} onClick={e => e.stopPropagation()}>
                  <h4 style={{ fontSize: "1rem", marginBottom: "0.5rem" }}>Select Candidate:</h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {candidates.map(c => (
                      <label key={c.id} style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        padding: "0.5rem",
                        borderRadius: "var(--radius)",
                        background: candidateId === c.id ? "var(--secondary)" : "transparent",
                        cursor: "pointer"
                      }}>
                        <input
                          type="radio"
                          name="candidate"
                          checked={candidateId === c.id}
                          onChange={() => setCandidateId(c.id)}
                          style={{ width: "auto", margin: 0 }}
                        />
                        {c.name}
                        {c.party && <span style={{ fontSize: "0.8em", color: "var(--text-secondary)" }}>({c.party})</span>}
                      </label>
                    ))}
                  </div>

                  <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
                    <button onClick={confirmVote} disabled={!candidateId} style={{ flex: 1, opacity: !candidateId ? 0.6 : 1 }}>
                      Proceed to Vote
                    </button>
                    <button className="outline" onClick={() => setSelectedElection(null)} style={{ flex: 1 }}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Modal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        title="Confirm Your Vote"
        actions={
          <>
            <button className="outline" onClick={() => setShowConfirm(false)}>Cancel</button>
            <button onClick={handleVote}>Confirm & Cast Vote</button>
          </>
        }
      >
        <div style={{ textAlign: "center" }}>
          <p>You are about to cast your vote for:</p>
          <h3 style={{ fontSize: "1.5rem", color: "var(--primary)", margin: "1rem 0" }}>
            {getCandidateName(candidateId)}
          </h3>
          <div className="badge warning" style={{ fontSize: "0.85rem", padding: "0.5rem 1rem" }}>
            ⚠️ This action cannot be undone.
          </div>
        </div>
      </Modal>

      {elections.length === 0 && <p>No active elections found.</p>}
    </div>
  );
}
