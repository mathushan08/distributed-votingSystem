import { useState, useEffect } from "react";
import { apiFetch } from "../api";

export default function AddCandidates() {
  const [elections, setElections] = useState([]);
  const [electionId, setElectionId] = useState("");
  const [candidates, setCandidates] = useState("");

  useEffect(() => {
    apiFetch("/elections").then(setElections);
  }, []);

  const addCandidates = async () => {
    if (!electionId || !candidates) {
      alert("Select election and enter candidates");
      return;
    }

    const list = candidates
      .split(",")
      .map(c => c.trim())
      .filter(Boolean);

    await apiFetch(`/elections/${electionId}/candidates`, {
      method: "POST",
      body: JSON.stringify({ candidates: list }),
    });

    alert("Candidates added");
    setCandidates("");
  };

  return (
    <div>
      <h3>Add Candidates</h3>

      <select onChange={e => setElectionId(e.target.value)}>
        <option value="">Select election</option>
        {elections.map(e => (
          <option key={e.id} value={e.id}>
            {e.title}
          </option>
        ))}
      </select>

      <br /><br />

      <input
        placeholder="Candidates (comma separated)"
        value={candidates}
        onChange={e => setCandidates(e.target.value)}
      />

      <br /><br />

      <button onClick={addCandidates}>Add</button>
    </div>
  );
}
