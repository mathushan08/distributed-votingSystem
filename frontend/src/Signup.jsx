import { useState } from "react";
import { apiFetch } from "./api";

export default function Signup({ onSwitchToLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  const [step, setStep] = useState(1); // 1: Register, 2: OTP
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const register = async () => {
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

  const verify = async () => {
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
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-page)" }}>
      <div className="card" style={{ width: "100%", maxWidth: "400px" }}>
        <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          {step === 1 ? "Sign Up" : "Verify Email"}
        </h2>

        {step === 1 ? (
          <>
            <div style={{ marginBottom: "1rem" }}>
              <label>Email</label>
              <input
                placeholder="e.g. newuser@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{ marginBottom: 0 }}
              />
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label>Password</label>
              <input
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{ marginBottom: 0 }}
              />
            </div>

            <button onClick={register} disabled={loading} style={{ width: "100%", marginBottom: "1rem" }}>
              {loading ? "Sending Code..." : "Next: Verify Email"}
            </button>
          </>
        ) : (
          <>
            <p style={{ textAlign: "center", marginBottom: "1.5rem", color: "var(--text-secondary)" }}>
              We sent a code to <strong>{email}</strong>
            </p>

            <div style={{ marginBottom: "1.5rem" }}>
              <label>Verification Code</label>
              <input
                placeholder="Enter 6-digit code"
                value={otp}
                onChange={e => setOtp(e.target.value)}
                style={{ marginBottom: 0, textAlign: "center", letterSpacing: "0.5em", fontSize: "1.2rem" }}
              />
            </div>

            <button onClick={verify} disabled={loading} style={{ width: "100%", marginBottom: "1rem" }}>
              {loading ? "Verifying..." : "Verify & Login"}
            </button>

            <button
              className="outline"
              onClick={() => setStep(1)}
              disabled={loading}
              style={{ width: "100%", marginBottom: "1rem" }}
            >
              Back
            </button>
          </>
        )}

        {error && <div className="badge error" style={{ display: "block", textAlign: "center", marginBottom: "1rem" }}>{error}</div>}

        <p style={{ textAlign: "center", fontSize: "0.875rem", margin: 0 }}>
          Already have an account?{" "}
          <button onClick={onSwitchToLogin} style={{ background: "none", color: "var(--primary)", border: "none", padding: 0, textDecoration: "underline" }}>
            Login
          </button>
        </p>
      </div>
    </div>
  );
}
