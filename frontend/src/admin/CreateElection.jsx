import { useState } from "react";
import { apiFetch } from "../api";

export default function CreateElection() {
  const [title, setTitle] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");

  // Candidates state
  const [candidates, setCandidates] = useState([]);
  const [newCandidate, setNewCandidate] = useState("");

  const addCandidate = () => {
    if (!newCandidate.trim()) return;
    setCandidates([...candidates, newCandidate.trim()]);
    setNewCandidate("");
  };

  const removeCandidate = (index) => {
    setCandidates(candidates.filter((_, i) => i !== index));
  };

  const create = async () => {
    if (!title || !startsAt || !endsAt) {
      alert("Please fill all election details");
      return;
    }
    if (new Date(startsAt) >= new Date(endsAt)) {
      alert("End time must be after start time");
      return;
    }
    if (candidates.length < 2) {
      alert("Please add at least 2 candidates");
      return;
    }

    try {
      // 1. Create Election
      const electionRes = await apiFetch("/elections", {
        method: "POST",
        body: JSON.stringify({
          title,
          starts_at: new Date(startsAt).toISOString(),
          ends_at: new Date(endsAt).toISOString(),
        }),
      });

      const electionId = electionRes.election_id;

      // 2. Add Candidates
      await apiFetch(`/elections/${electionId}/candidates`, {
        method: "POST",
        body: JSON.stringify({ candidates }),
      });

      alert("Election created successfully!");

      // reset form
      setTitle("");
      setStartsAt("");
      setEndsAt("");
      setCandidates([]);
    } catch (e) {
      alert("Error creating election: " + e.message);
    }
  };

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Create New Election</h2>
      <p style={{ color: "var(--text-secondary)", marginBottom: "2rem" }}>Set up a new ballot and add eligible candidates.</p>

      <div style={{ display: "grid", gap: "1.5rem" }}>
        {/* Election Details */}
        <div>
          <label style={{ fontWeight: 600, display: "block", marginBottom: "0.5rem" }}>Election Title</label>
          <input
            placeholder="e.g. Student Council 2024"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>
            <label style={{ fontWeight: 600, display: "block", marginBottom: "0.5rem" }}>Start Time</label>
            <input
              type="datetime-local"
              value={startsAt}
              onChange={e => setStartsAt(e.target.value)}
            />
          </div>
          <div>
            <label style={{ fontWeight: 600, display: "block", marginBottom: "0.5rem" }}>End Time</label>
            <input
              type="datetime-local"
              value={endsAt}
              onChange={e => setEndsAt(e.target.value)}
            />
          </div>
        </div>

        {/* Candidates Section */}
        <div style={{ background: "var(--bg-page)", padding: "1.5rem", borderRadius: "var(--radius)" }}>
          <label style={{ fontWeight: 600, display: "block", marginBottom: "1rem" }}>Candidates</label>

          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
            <input
              placeholder="Candidate Name"
              value={newCandidate}
              onChange={e => setNewCandidate(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addCandidate()}
              style={{ marginBottom: 0 }}
            />
            <button onClick={addCandidate} className="secondary" style={{ whiteSpace: "nowrap" }}>+ Add</button>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {candidates.map((c, i) => (
              <span key={i} style={{
                background: "white",
                border: "1px solid var(--border)",
                padding: "0.4em 0.8em",
                borderRadius: "99px",
                fontSize: "0.9em",
                display: "flex",
                alignItems: "center",
                gap: "0.5em"
              }}>
                {c}
                <button
                  onClick={() => removeCandidate(i)}
                  style={{
                    padding: 0,
                    background: "none",
                    color: "red",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "1.2em",
                    lineHeight: 1
                  }}
                >×</button>
              </span>
            ))}
            {candidates.length === 0 && <span style={{ color: "var(--text-secondary)", fontStyle: "italic" }}>No candidates added yet.</span>}
          </div>
        </div>

        <button onClick={create} style={{ marginTop: "1rem", padding: "0.8em" }}>
          🚀 Launch Election
        </button>
      </div>
    </div>
  );
}
