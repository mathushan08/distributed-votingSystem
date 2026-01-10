import { useState, useEffect } from "react";

export default function NodeStatus() {
    // Mock distributed nodes state
    const [nodes, setNodes] = useState([
        { id: 1, name: "Node-Alpha (Primary)", status: "active", latency: "12ms" },
        { id: 2, name: "Node-Beta", status: "syncing", latency: "45ms" },
        { id: 3, name: "Node-Gamma", status: "active", latency: "18ms" }
    ]);

    // Simulate subtle interactions
    useEffect(() => {
        const interval = setInterval(() => {
            setNodes(prev => prev.map(n => ({
                ...n,
                latency: Math.floor(Math.random() * 40 + 10) + "ms",
                status: Math.random() > 0.95 ? (n.status === "active" ? "syncing" : "active") : n.status
            })));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="card">
            <div className="card-header">
                <h3 className="text-sm" style={{ textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-secondary)" }}>
                    Network Status
                </h3>
            </div>

            <div className="grid gap-2">
                {nodes.map(node => (
                    <div key={node.id} className="flex justify-between items-center" style={{
                        padding: "0.75rem",
                        background: "var(--secondary)",
                        borderRadius: "var(--radius)"
                    }}>
                        <div className="flex items-center gap-2">
                            <div style={{
                                width: 8, height: 8, borderRadius: "50%",
                                background: node.status === "active" ? "var(--success)" : "var(--warning)",
                                boxShadow: node.status === "active" ? "0 0 0 2px #DCFCE7" : "0 0 0 2px #FEF3C7"
                            }} />
                            <div className="flex-col">
                                <span style={{ fontWeight: 500, fontSize: "0.875rem" }}>{node.name}</span>
                                <span className="text-sm text-muted" style={{ fontSize: "0.75rem" }}>ID: {node.id.toString().padStart(4, '0')}</span>
                            </div>
                        </div>

                        <span className="badge" style={{ fontSize: "0.7em" }}>
                            {node.status === "active" ? "CONSENSUS" : "SYNCING"}
                        </span>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px dashed var(--border)", fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                System Consensus: <span style={{ color: "var(--success)", fontWeight: 600 }}>REACHED</span>
                <br />
                Block Height: #6,204,192
            </div>
        </div>
    );
}
