import { useNavigate } from "react-router-dom";

export default function LandingPage() {
    const navigate = useNavigate();

    return (
        <div style={{
            minHeight: "100vh",
            background: "linear-gradient(135deg, var(--bg-page) 0%, #e6f0ff 100%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "2rem"
        }}>
            <div style={{ marginBottom: "2rem" }}>
                <h1 style={{ fontSize: "3.5rem", color: "var(--primary)", marginBottom: "0.5rem" }}>
                    🗳️ Secure Vote
                </h1>
                <p style={{ fontSize: "1.25rem", color: "var(--text-secondary)", maxWidth: "600px" }}>
                    A secure, distributed voting system for fair and transparent elections.
                    Manage elections, cast your vote, and view real-time results.
                </p>
            </div>

            <div style={{ display: "flex", gap: "1rem" }}>
                <button
                    onClick={() => navigate("/login")}
                    style={{ fontSize: "1.2rem", padding: "0.8em 2em" }}
                >
                    Login
                </button>
                <button
                    className="secondary"
                    onClick={() => navigate("/signup")}
                    style={{ fontSize: "1.2rem", padding: "0.8em 2em" }}
                >
                    Sign Up
                </button>
            </div>

            <div style={{ marginTop: "4rem", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "2rem", maxWidth: "900px" }}>
                <div className="card">
                    <h3>🔒 Secure</h3>
                    <p>End-to-end integrity using distributed ledger concepts.</p>
                </div>
                <div className="card">
                    <h3>⚡ Real-time</h3>
                    <p>Watch election results update live as votes are cast.</p>
                </div>
                <div className="card">
                    <h3>📊 Analytics</h3>
                    <p>Comprehensive visual breakdown of voting demographics.</p>
                </div>
            </div>
        </div>
    );
}
