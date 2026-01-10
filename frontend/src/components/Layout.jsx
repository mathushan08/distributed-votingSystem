import { useNavigate } from "react-router-dom";

import Sidebar from "./Sidebar";

export default function Layout({ children, role, activePage, onNavigate }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    const isAdmin = role === "Admin" || role === "ADMIN";

    if (isAdmin) {
        return (
            <div style={{ minHeight: "100vh", background: "var(--bg-page)" }}>
                <Sidebar
                    activePage={activePage || "dashboard"}
                    onNavigate={onNavigate}
                    onLogout={handleLogout}
                />
                <main style={{
                    marginLeft: "var(--sidebar-width)",
                    padding: "2rem",
                    minHeight: "100vh",
                    boxSizing: "border-box"
                }}>
                    {children}
                </main>
            </div>
        );
    }

    // Voter / Public Layout
    return (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <nav style={{
                background: "white",
                borderBottom: "1px solid var(--border)",
                padding: "0 2rem",
                height: "var(--header-height)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                boxShadow: "var(--shadow-sm)"
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <div style={{
                        width: 32, height: 32, background: "var(--primary)", borderRadius: 4,
                        display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "bold"
                    }}>V</div>
                    <span style={{ fontWeight: 600, fontSize: "1.125rem", color: "var(--primary)" }}>VotingSys</span>

                    {role && <span className="badge active" style={{ fontSize: "0.75rem" }}>
                        {role} Portal
                    </span>}
                </div>

                <div>
                    {role ? (
                        <button className="outline" onClick={handleLogout}>Logout</button>
                    ) : (
                        <button className="secondary" onClick={() => navigate("/login")}>Login</button>
                    )}
                </div>
            </nav>

            <main className="container" style={{ flex: 1, marginTop: "2rem" }}>
                {children}
            </main>
        </div>
    );
}
