import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiFetch } from "./api";
import "./Auth.css";

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
            setMessage("Recovery protocol initiated. Check secure inbox for reset token.");
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
            alert("Security credentials updated. Proceed to authentication.");
            navigate("/login");
        } catch (err) {
            setError(err.message);
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
                            <h2>Credential Recovery</h2>
                            <p>
                                Identity verification is required to reset access keys.
                                This action is logged and audited for security purposes.
                            </p>
                        </div>
                    </div>

                    <div className="auth-system-status">
                        <div className="status-item">
                            <span className="status-dot" style={{ background: "#f59e0b" }}></span>
                            RECOVERY MODE
                        </div>
                        <div className="status-item">
                            <span>SECURE CHANNEL</span>
                        </div>
                    </div>
                </div>

                {/* Right Panel - Form */}
                <div className="auth-panel-form">
                    <div className="auth-form-container">
                        <div className="auth-intro">
                            <h1 className="auth-heading">
                                {step === 1 ? "Reset Access Key" : "Verify & Update"}
                            </h1>
                            <p className="auth-subheading">
                                {step === 1
                                    ? "Enter your official email to receive a recovery token."
                                    : "Enter the token and your new secure password."
                                }
                            </p>
                        </div>

                        {error && (
                            <div className="status-alert">
                                <strong>ERROR:</strong> {error}
                            </div>
                        )}

                        {message && (
                            <div className="status-alert" style={{ background: "#f0fdf4", borderColor: "#16a34a", color: "#166534" }}>
                                <strong>STATUS:</strong> {message}
                            </div>
                        )}

                        {step === 1 ? (
                            <form onSubmit={handleSendCode}>
                                <div className="form-group">
                                    <label className="form-label">Official Email Address</label>
                                    <input
                                        type="email"
                                        className="form-input"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        placeholder="name@institution.org"
                                    />
                                </div>
                                <button type="submit" className="btn-submit" disabled={loading}>
                                    {loading ? "Verifying Identity..." : "Request Reset Token"}
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleResetPassword}>
                                <div className="form-group">
                                    <label className="form-label">Recovery Token (OTP)</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        required
                                        placeholder="000000"
                                        maxLength={6}
                                        style={{ fontFamily: "monospace", letterSpacing: "0.25em", textAlign: "center" }}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">New Access Key</label>
                                    <input
                                        type="password"
                                        className="form-input"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                        placeholder="Min. 8 characters"
                                    />
                                </div>
                                <button type="submit" className="btn-submit" disabled={loading}>
                                    {loading ? "Updating Credentials..." : "Confirm Update"}
                                </button>
                            </form>
                        )}

                        <div className="auth-links" style={{ justifyContent: "center", marginTop: "2rem" }}>
                            <Link to="/login" className="link-text">
                                Cancel & Return to Login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
