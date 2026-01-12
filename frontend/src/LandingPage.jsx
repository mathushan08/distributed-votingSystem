import React from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

export default function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className="landing-page">
            {/* Navigation Bar */}
            <nav className="landing-nav">
                <div className="nav-logo">
                    <span className="nav-logo-icon">⚖️</span>
                    Secure Vote
                </div>
                <div className="nav-links">
                    <button className="nav-link-btn" onClick={() => navigate("/login")}>Login</button>
                    <button className="nav-cta-btn" onClick={() => navigate("/signup")}>Get Started</button>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="landing-hero">
                <div className="hero-content">
                    <h1 className="hero-title">
                        Safe and Fair Voting for Everyone
                    </h1>
                    <p className="hero-subtitle">
                        We make voting easy, secure, and trustworthy.
                        Every vote is protected, counted properly, and cannot be changed.
                        You can vote with confidence knowing the process is transparent and reliable.
                    </p>
                    <div className="hero-actions">
                        <button
                            className="btn-primary"
                            onClick={() => navigate("/login")}
                            aria-label="Access Voting Portal"
                        >
                            Start Secure Voting
                        </button>
                        <button
                            className="btn-secondary"
                            onClick={() => navigate("/signup")}
                            aria-label="Create Voter Account"
                        >
                            Create Account
                        </button>
                    </div>
                </div>
            </header>

            {/* Trust Signals / Features Section */}
            <section className="landing-features">
                <div className="features-grid">
                    {/* Security Card */}
                    <div className="feature-card">
                        <div className="feature-icon">🔒</div>
                        <h3>Cryptographic Integrity</h3>
                        <p>
                            Every ballot is cryptographically signed and stored on a tamper-resistant distributed ledger, ensuring end-to-end verifiability.
                        </p>
                    </div>

                    {/* Transparency Card */}
                    <div className="feature-card">
                        <div className="feature-icon">⚡</div>
                        <h3>Real-Time Transparency</h3>
                        <p>
                            Watch election results stream in real-time. Our public verification nodes allow anyone to audit the tallying process instantly.
                        </p>
                    </div>

                    {/* Audit Card */}
                    <div className="feature-card">
                        <div className="feature-icon">🛡️</div>
                        <h3>Institutional Grade</h3>
                        <p>
                            Built for high-stakes environments with role-based access control, comprehensive audit logs, and verified voter identity.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}

