import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#0066cc", "#00d4ff", "#e6f0ff", "#ffbb28", "#ff8042"];

export default function AdminRealtimeResults({ electionId }) {
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!electionId) return;

    const token = localStorage.getItem("token");

    const eventSource = new EventSource(
      `http://localhost:3000/elections/${electionId}/results/stream?token=${token}`
    );

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // Transform for charts (votes comes as string from DB count)
      const chartData = data.map(r => ({
        name: r.name,
        value: parseInt(r.votes, 10)
      }));
      setResults(chartData);
    };

    eventSource.onerror = () => {
      eventSource.close();
    };

    return () => eventSource.close();
  }, [electionId]);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
        <div>
          <h3>Live Results</h3>
          <div style={{ fontSize: "2rem", fontWeight: "bold", color: "var(--primary)" }}>
            {results.reduce((acc, curr) => acc + curr.value, 0)} <span style={{ fontSize: "1rem", fontWeight: "normal", color: "var(--text-secondary)" }}>votes cast</span>
          </div>
        </div>
        <span style={{ fontSize: "0.8em", color: "green", display: "flex", alignItems: "center", gap: "0.5em" }}>
          <span style={{ display: "block", width: 8, height: 8, background: "green", borderRadius: "50%" }}></span>
          Live updating
        </span>
      </div>

      {results.length === 0 ? (
        <p>No votes yet.</p>
      ) : (
        <div style={{ width: "100%", height: 350, position: "relative" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={results}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label
                >
                  {results.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Summary Table */}
      <table style={{ width: "100%", marginTop: "2rem", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "var(--bg-page)", textAlign: "left" }}>
            <th style={{ padding: "0.5rem" }}>Candidate</th>
            <th style={{ padding: "0.5rem" }}>Votes</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r, i) => (
            <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
              <td style={{ padding: "0.5rem" }}>{r.name}</td>
              <td style={{ padding: "0.5rem", fontWeight: "bold" }}>{r.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
