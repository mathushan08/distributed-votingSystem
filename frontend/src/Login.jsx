import { useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "./api";

export default function Login({ onLogin, onSwitchToSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const login = async () => {
    setError("");
    try {
      const data = await apiFetch("/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      localStorage.setItem("token", data.token);
      onLogin();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-page)" }}>
      <div className="card" style={{ width: "100%", maxWidth: "400px" }}>
        <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>Login</h2>

        <div style={{ marginBottom: "1rem" }}>
          <label>Email</label>
          <input
            placeholder="e.g. user@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ marginBottom: 0 }}
          />
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <label>Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ marginBottom: 0 }}
          />
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1rem" }}>
          <Link to="/forgot-password" style={{ color: "var(--primary)", fontSize: "0.875rem" }}>
            Forgot password?
          </Link>
        </div>

        <button onClick={login} style={{ width: "100%", marginBottom: "1rem" }}>Login</button>

        {error && <div className="badge error" style={{ display: "block", textAlign: "center", marginBottom: "1rem" }}>{error}</div>}

        <p style={{ textAlign: "center", fontSize: "0.875rem", margin: 0 }}>
          Don’t have an account?{" "}
          <button onClick={onSwitchToSignup} style={{ background: "none", color: "var(--primary)", border: "none", padding: 0, textDecoration: "underline" }}>
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
}
