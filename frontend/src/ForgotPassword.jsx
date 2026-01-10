import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiFetch } from "./api";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [step, setStep] = useState(1); // 1: Email, 2: OTP + New Password
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSendCode = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");
        setLoading(true);

        try {
            await apiFetch("/forgot-password", {
                method: "POST",
                body: JSON.stringify({ email }),
            });
            setStep(2);
            setMessage("Reset code sent to your email.");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");
        setLoading(true);

        try {
            await apiFetch("/reset-password", {
                method: "POST",
                body: JSON.stringify({ email, otp, new_password: newPassword }),
            });
            alert("Password reset successfully. Please login.");
            navigate("/login");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            maxWidth: "400px",
            margin: "4rem auto",
            padding: "2rem",
            background: "white",
            borderRadius: "8px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
        }}>
            <h2 style={{ textAlign: "center", marginBottom: "2rem", color: "var(--primary)" }}>
                Reset Password
            </h2>

            {error && (
                <div style={{
                    padding: "0.75rem",
                    marginBottom: "1rem",
                    background: "#fee2e2",
                    color: "#dc2626",
                    borderRadius: "4px",
                    fontSize: "0.9rem"
                }}>
                    {error}
                </div>
            )}

            {message && (
                <div style={{
                    padding: "0.75rem",
                    marginBottom: "1rem",
                    background: "#dcfce7",
                    color: "#166534",
                    borderRadius: "4px",
                    fontSize: "0.9rem"
                }}>
                    {message}
                </div>
            )}

            {step === 1 ? (
                <form onSubmit={handleSendCode}>
                    <div style={{ marginBottom: "1rem" }}>
                        <label style={{ display: "block", marginBottom: "0.5rem" }}>Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{ width: "100%", padding: "0.5rem" }}
                        />
                    </div>
                    <button type="submit" disabled={loading} style={{ width: "100%" }}>
                        {loading ? "Sending..." : "Send Reset Code"}
                    </button>
                </form>
            ) : (
                <form onSubmit={handleResetPassword}>
                    <div style={{ marginBottom: "1rem" }}>
                        <label style={{ display: "block", marginBottom: "0.5rem" }}>Reset Code (OTP)</label>
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                            placeholder="Enter 6-digit code"
                            style={{ width: "100%", padding: "0.5rem" }}
                        />
                    </div>
                    <div style={{ marginBottom: "1rem" }}>
                        <label style={{ display: "block", marginBottom: "0.5rem" }}>New Password</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            placeholder="Min 6 chars"
                            style={{ width: "100%", padding: "0.5rem" }}
                        />
                    </div>
                    <button type="submit" disabled={loading} style={{ width: "100%" }}>
                        {loading ? "Reset Password" : "Confirm New Password"}
                    </button>
                </form>
            )}

            <div style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "0.9rem" }}>
                <Link to="/login" style={{ color: "var(--primary)" }}>Back to Login</Link>
            </div>
        </div>
    );
}
