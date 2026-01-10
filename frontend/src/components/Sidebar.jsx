import { useNavigate } from "react-router-dom";

export default function Sidebar({ activePage, onNavigate, onLogout }) {
    const navigate = useNavigate();

    const menu = [
        { id: "dashboard", label: "Dashboard", icon: "📊" },
        { id: "elections", label: "Elections", icon: "🗳️" },
        { id: "nodes", label: "Node Health", icon: "🔗" },
        { id: "logs", label: "Audit Logs", icon: "📜" },
    ];

    return (
        <div style={{
            width: "var(--sidebar-width)",
            background: "white",
            borderRight: "1px solid var(--border)",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            position: "fixed",
            left: 0, top: 0
        }}>
            <div style={{
                height: "var(--header-height)",
                display: "flex",
                alignItems: "center",
                padding: "0 1.5rem",
                borderBottom: "1px solid var(--border)"
            }}>
                <div style={{
                    width: 32, height: 32, background: "var(--primary)", borderRadius: 4, marginRight: "0.75rem",
                    display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "bold"
                }}>V</div>
                <span style={{ fontWeight: 600, fontSize: "1.125rem", color: "var(--primary)" }}>VotingSys</span>
            </div>

            <nav style={{ padding: "1.5rem 1rem", flex: 1 }}>
                <div className="text-sm text-muted" style={{ paddingLeft: "0.75rem", marginBottom: "0.5rem", textTransform: "uppercase", fontSize: "0.75rem", fontWeight: 600 }}>
                    Admin Console
                </div>
                {menu.map(item => (
                    <button
                        key={item.id}
                        onClick={() => onNavigate ? onNavigate(item.id) : null}
                        style={{
                            width: "100%",
                            justifyContent: "flex-start",
                            background: activePage === item.id ? "var(--secondary)" : "transparent",
                            color: activePage === item.id ? "var(--primary)" : "var(--text-secondary)",
                            marginBottom: "0.25rem",
                            border: "1px solid transparent",
                            textAlign: "left"
                        }}
                    >
                        <span style={{ marginRight: "0.75rem" }}>{item.icon}</span>
                        {item.label}
                    </button>
                ))}
            </nav>

            <div style={{ padding: "1rem", borderTop: "1px solid var(--border)" }}>
                <button className="outline" onClick={onLogout} style={{ width: "100%", justifyContent: "flex-start" }}>
                    <span style={{ marginRight: "0.75rem" }}>🚪</span> Logout
                </button>
            </div>
        </div>
    );
}
