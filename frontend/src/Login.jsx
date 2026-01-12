import { useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "./api";
import "./Auth.css";

export default function Login({ onLogin, onSwitchToSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await apiFetch("/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      localStorage.setItem("token", data.token);
      onLogin();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-split">
        {/* Left Panel - Institutional Visuals */}
        <div className="auth-panel-visual">
          <div className="auth-visual-content">
            <div className="auth-emblem">
              <span className="auth-emblem-icon">⚖️</span>
              SECURE VOTE
            </div>
            <div className="auth-statement">
              <h2>Restricted Access System</h2>
              <p>
                This system is monitored and protected. Access is restricted to authorized personnel and verified voters only.
                All interactions are cryptographically signed and audited.
              </p>
            </div>
          </div>

          <div className="auth-system-status">
            <div className="status-item">
              <span className="status-dot"></span>
              SYSTEM ONLINE
            </div>
            <div className="status-item">
              <span>ENCRYPTION: AES-256</span>
            </div>
            <div className="status-item">
              <span>NODE: US-EAST-1</span>
            </div>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="auth-panel-form">
          <div className="auth-form-container">
            <div className="auth-intro">
              <h1 className="auth-heading">System Authorization</h1>
              <p className="auth-subheading">Enter your credentials to access the voting platform.</p>
            </div>

            {error && (
              <div className="status-alert">
                <strong>ACCESS DENIED:</strong> {error}
              </div>
            )}

            <form onSubmit={login}>
              <div className="form-group">
                <label className="form-label">User Identifier (Email)</label>
                <input
                  className="form-input"
                  placeholder="admin@institution.org"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Access Key (Password)</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? "Verifying Credentials..." : "Login"}
              </button>

              <div className="auth-links">
                <Link to="/forgot-password" className="link-text">
                  Reset Password
                </Link>
                <button type="button" onClick={onSwitchToSignup} className="link-text" style={{ background: "none", border: "none", padding: 0, textTransform: "none", cursor: "pointer", fontSize: "0.875rem" }}>
                  Register New Voter
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
