import { useEffect, useState } from "react";
import { PieChart, Pie, Tooltip, Cell, Legend, ResponsiveContainer } from "recharts";
import { apiFetch } from "../api";

const COLORS = ["#0066cc", "#00d4ff", "#e6f0ff", "#ffbb28", "#ff8042"];

export default function ElectionResults({ electionId, endTime }) {
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

        // Initial check
        const ended = checkTime();
        if (ended) return;

        // Ticker
        const timer = setInterval(() => {
            const ended = checkTime();
            if (ended) clearInterval(timer);
        }, 1000);

        return () => clearInterval(timer);
    }, [endTime]);

    // Data Fetching Logic (only runs if ended)
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
            console.error("Stream error", err);
            eventSource.close();
            setLoading(false);
        };

        return () => eventSource.close();
    }, [electionId, isEnded]);

    // Format millisecond duration
    const formatTime = (ms) => {
        if (!ms) return "";
        const seconds = Math.floor((ms / 1000) % 60);
        const minutes = Math.floor((ms / (1000 * 60)) % 60);
        const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
        const days = Math.floor(ms / (1000 * 60 * 60 * 24));
        return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    };

    // Render Logic
    if (!isEnded) {
        return (
            <div style={{
                height: 300,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: "var(--bg-page)",
                borderRadius: "var(--radius)",
                textAlign: "center",
                padding: "2rem"
            }}>
                <h4 style={{ margin: "0 0 1rem 0", color: "var(--text-secondary)" }}>Results Pending</h4>
                <div style={{ fontSize: "2rem", fontWeight: "bold", color: "var(--primary)", fontFamily: "monospace" }}>
                    {timeRemaining ? formatTime(timeRemaining) : "Loading..."}
                </div>
                <p style={{ marginTop: "1rem", fontSize: "0.9em", color: "var(--text-secondary)" }}>
                    Results will be released automatically when the election ends.
                </p>
            </div>
        );
    }

    if (loading) return <p>Loading final results...</p>;
    if (data.length === 0) return <p>No votes cast.</p>;

    return (
        <div style={{ width: "100%", height: 300, position: "relative" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            dataKey="value"
                            data={data}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            label
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
