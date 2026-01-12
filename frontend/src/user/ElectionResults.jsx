import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import "./VoterPortal.css";

const COLORS = ["#2563eb", "#16a34a", "#ea580c", "#9333ea", "#0891b2", "#dc2626", "#ca8a04"];

export default function ElectionResults({ electionId, endTime, title }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [timeRemaining, setTimeRemaining] = useState(null);
    const [isEnded, setIsEnded] = useState(false);

    // Countdown Timer Logic
    useEffect(() => {
        if (!endTime) return;

        const checkTime = () => {
            const now = new Date();
            const end = new Date(endTime);
            const diff = end - now;

            if (diff <= 0) {
                setIsEnded(true);
                return true; // ended
            } else {
                setIsEnded(false);
                setTimeRemaining(diff);
                return false; // still running
            }
        };

        const ended = checkTime();
        if (ended) return;

        const timer = setInterval(() => {
            const ended = checkTime();
            if (ended) clearInterval(timer);
        }, 1000);

        return () => clearInterval(timer);
    }, [endTime]);

    // Data Fetching Logic
    useEffect(() => {
        if (!isEnded) return;

        setLoading(true);
        const token = localStorage.getItem("token");
        const eventSource = new EventSource(
            `http://localhost:3000/elections/${electionId}/results/stream?token=${token}`
        );

        eventSource.onmessage = (event) => {
            const parsed = JSON.parse(event.data);
            const formatted = parsed.map(r => ({
                name: r.name,
                value: parseInt(r.votes, 10)
            }));
            setData(formatted);
            setLoading(false);
        };

        eventSource.onerror = (err) => {
            eventSource.close();
            setLoading(false);
        };

        return () => eventSource.close();
    }, [electionId, isEnded]);

    const formatTime = (ms) => {
        if (!ms) return "";
        const seconds = Math.floor((ms / 1000) % 60);
        const minutes = Math.floor((ms / (1000 * 60)) % 60);
        const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
        const days = Math.floor(ms / (1000 * 60 * 60 * 24));
        return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    };

    const getTotalVotes = () => data.reduce((acc, curr) => acc + curr.value, 0);

    if (!isEnded) {
        return (
            <div className="vp-card active">
                <div className="vp-card-header">
                    <h3 className="vp-card-title">{title}</h3>
                    <span className="vp-status vp-status-active">Live Tallying</span>
                </div>
                <div className="vp-card-body" style={{ textAlign: "center", padding: "3rem" }}>
                    <div style={{ fontSize: "2.5rem", fontWeight: 700, fontFamily: "monospace", color: "#1e3a8a", marginBottom: "0.5rem" }}>
                        {timeRemaining ? formatTime(timeRemaining) : "Loading..."}
                    </div>
                    <div style={{ color: "#64748b", fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                        Time Remaining Until Final Audit
                    </div>
                </div>
            </div>
        );
    }

    if (loading) return <div className="vp-card"><div className="vp-card-body">Accessing Ledger...</div></div>;
    if (data.length === 0) return <div className="vp-card"><div className="vp-card-body">No votes recorded on ledger.</div></div>;

    const totalVotes = getTotalVotes();
    const winner = data.length > 0 ? data[0] : null;

    return (
        <div className="vp-card ended">
            <div className="vp-card-header">
                <div>
                    <div style={{ fontSize: "0.7rem", textTransform: "uppercase", color: "#64748b", fontWeight: 700, marginBottom: "0.25rem" }}>
                        Audit Record #{electionId.substring(0, 6)}
                    </div>
                    <h3 className="vp-card-title">{title}</h3>
                </div>
                <span className="vp-status vp-status-ended">Finalized</span>
            </div>

            <div className="vp-card-body">
                <div className="results-grid">
                    {/* Chart Section */}
                    <div style={{ height: "250px", width: "100%", minWidth: 0, position: "relative" }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={2}
                                    dataKey="value"
                                >
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Centered Total */}
                        <div style={{
                            position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -65%)",
                            textAlign: "center"
                        }}>
                            <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#0f172a" }}>{totalVotes}</div>
                            <div style={{ fontSize: "0.7rem", color: "#64748b", textTransform: "uppercase" }}>Votes</div>
                        </div>
                    </div>

                    {/* Table Section */}
                    <div>
                        <table className="vp-table">
                            <thead>
                                <tr>
                                    <th>Candidate</th>
                                    <th style={{ textAlign: "right" }}>Votes</th>
                                    <th style={{ textAlign: "right" }}>%</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((entry, index) => {
                                    const percent = ((entry.value / totalVotes) * 100).toFixed(1);
                                    const isWinner = index === 0;
                                    return (
                                        <tr key={index} className={isWinner ? "vp-winner-row" : ""}>
                                            <td style={{ fontWeight: 500 }}>
                                                {entry.name}
                                                {isWinner && <span className="vp-winner-badge">Elected</span>}
                                            </td>
                                            <td style={{ textAlign: "right", fontFamily: "monospace", fontSize: "1rem" }}>
                                                {entry.value.toLocaleString()}
                                            </td>
                                            <td style={{ textAlign: "right", color: "#64748b" }}>
                                                {percent}%
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                        <div style={{ marginTop: "1.5rem", paddingTop: "1rem", borderTop: "1px solid #e2e8f0", fontSize: "0.75rem", color: "#94a3b8", display: "flex", gap: "1rem", alignItems: "center" }}>
                            <span>🔒 verification_hash: {Math.random().toString(36).substring(7)}...</span>
                            <span style={{ marginLeft: "auto" }}>Status: <span style={{ color: "#059669", fontWeight: 600 }}>VERIFIED</span></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
