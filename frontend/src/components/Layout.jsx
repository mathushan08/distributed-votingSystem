import { useNavigate } from "react-router-dom";

import Sidebar from "./Sidebar";
import "./Layout.css";

export default function Layout({ children, role, activePage, onNavigate }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    const isAdmin = role === "Admin" || role === "ADMIN";

    if (isAdmin) {
        return (
            <div className="admin-layout">
                <Sidebar
                    activePage={activePage || "dashboard"}
                    onNavigate={onNavigate}
                    onLogout={handleLogout}
                />
                <main className="admin-main">
                    {children}
                </main>
            </div>
        );
    }

    // Voter / Public Layout
    return (
        <div className="voter-layout">
            <nav className="voter-nav">
                <div className="voter-nav-brand">
                    <div className="brand-icon">⚖️</div>
                    <span className="brand-text">Secure Vote</span>

                    {role && <span className="badge active" style={{ fontSize: "0.75rem" }}>
                        {role} Portal
                    </span>}
                </div>

                <div>
                    {role ? (
                        <button onClick={handleLogout} className="sign-out-button">Sign Out</button>
                    ) : (
                        <button className="secondary" onClick={() => navigate("/login")}>Login</button>
                    )}
                </div>
            </nav>

            <main className="container voter-main">
                {children}
            </main>
        </div>
    );
}
