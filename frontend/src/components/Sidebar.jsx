import { useNavigate } from "react-router-dom";

export default function Sidebar({ activePage, onNavigate, onLogout }) {
    const navigate = useNavigate();

    const menu = [
        { id: "dashboard", label: "Dashboard", icon: "📊" },
        { id: "elections", label: "Elections", icon: "🗳️" },

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
                    width: 32, height: 32, background: "#1e3a8a", borderRadius: 4, marginRight: "0.75rem",
                    display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "1.2rem"
                }}>⚖️</div>
                <span style={{ fontWeight: 700, fontSize: "1.125rem", color: "#1e3a8a", letterSpacing: "-0.02em" }}>Secure Vote</span>
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
                <button onClick={onLogout} style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    background: "#fee2e2",
                    color: "#991b1b",
                    border: "1px solid #fecaca",
                    fontWeight: 600
                }}>
                    <span style={{ marginRight: "0.75rem" }}>🚪</span> Sign Out
                </button>
            </div>
        </div>
    );
}
