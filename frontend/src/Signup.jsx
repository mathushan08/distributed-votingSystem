import { useState } from "react";
import { apiFetch } from "./api";
import "./Auth.css";

export default function Signup({ onSwitchToLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  const [step, setStep] = useState(1); // 1: Register, 2: OTP
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const register = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await apiFetch("/register", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      setStep(2);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const verify = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await apiFetch("/verify-email", {
        method: "POST",
        body: JSON.stringify({ email, otp }),
      });

      // Auto-login
      localStorage.setItem("token", data.token);
      window.location.href = "/dashboard";
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
              <h2>Voter Registration</h2>
              <p>
                Initiating secure enrollment protocol. Your identity will be cryptographically verified before access is granted.
                Ensure you are using a secure connection.
              </p>
            </div>
          </div>

          <div className="auth-system-status">
            <div className="status-item">
              <span className="status-dot"></span>
              REGISTRATION ACTIVE
            </div>
            <div className="status-item">
              <span>PROTOCOL: TLS 1.3</span>
            </div>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="auth-panel-form">
          <div className="auth-form-container">
            <div className="auth-intro">
              <h1 className="auth-heading">
                {step === 1 ? " Identity Verification" : "Token Verification"}
              </h1>
              <p className="auth-subheading">
                {step === 1
                  ? "Create a new secure voter account."
                  : `Enter the authentication code sent to ${email}`
                }
              </p>
            </div>

            {error && <div className="status-alert">⚠️ {error}</div>}

            {step === 1 ? (
              <form onSubmit={register}>
                <div className="form-group">
                  <label className="form-label">Official Email Address</label>
                  <input
                    className="form-input"
                    placeholder="name@institution.org"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Set Password</label>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="Min. 8 characters"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="btn-submit" disabled={loading}>
                  {loading ? "Processing..." : "Proceed to Verification"}
                </button>
              </form>
            ) : (
              <form onSubmit={verify}>
                <div className="form-group">
                  <label className="form-label">Verification Token</label>
                  <input
                    className="form-input"
                    placeholder="000000"
                    value={otp}
                    onChange={e => setOtp(e.target.value)}
                    maxLength={6}
                    style={{ fontFamily: "monospace", letterSpacing: "0.25em", textAlign: "center" }}
                    required
                  />
                </div>

                <button type="submit" className="btn-submit" disabled={loading}>
                  {loading ? "Verifying..." : "Validate & Access"}
                </button>

                <button
                  type="button"
                  className="btn-link"
                  onClick={() => setStep(1)}
                  disabled={loading}
                  style={{ width: "100%", marginTop: "1rem", background: "none", border: "none", cursor: "pointer", color: "#64748b" }}
                >
                  Return to Step 1
                </button>
              </form>
            )}

            <div className="auth-links" style={{ justifyContent: "center", marginTop: "2rem" }}>
              <span style={{ color: "#64748b" }}>Already enrolled?</span>
              <button onClick={onSwitchToLogin} style={{ background: "none", border: "none", padding: 0, marginLeft: "0.5rem", fontWeight: 600, cursor: "pointer", color: "#0f172a" }}>
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
