import { useEffect, useState } from "react";
import { apiFetch } from "../api";

export default function ViewResults() {
  const [elections, setElections] = useState([]);
  const [results, setResults] = useState([]);

  const loadResults = async (id) => {
    const data = await apiFetch(`/elections/${id}/results`);
    setResults(data.results);
  };

  useEffect(() => {
    apiFetch("/elections").then(setElections);
  }, []);

  return (
    <div>
      <h3>Election Results</h3>

      <select onChange={e => loadResults(e.target.value)}>
        <option value="">Select election</option>
        {elections.map(e => (
          <option key={e.id} value={e.id}>
            {e.title}
          </option>
        ))}
      </select>

      <ul>
        {results.map(r => (
          <li key={r.candidate_id}>
            {r.candidate_name} – {r.votes} votes
          </li>
        ))}
      </ul>
    </div>
  );
}
