export default function Modal({ isOpen, onClose, title, children, actions }) {
    if (!isOpen) return null;

    return (
        <div style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(15, 23, 42, 0.4)", // Slate-900 with opacity
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
            backdropFilter: "blur(2px)"
        }}>
            <div className="card" style={{
                width: "100%", maxWidth: "500px",
                margin: "1rem",
                boxShadow: "var(--shadow-md)",
                padding: 0, // Reset padding to handle header/body separation
                overflow: "hidden" // For border radius
            }}>
                <div style={{
                    padding: "1.25rem 1.5rem",
                    borderBottom: "1px solid var(--border)",
                    display: "flex", justifyContent: "space-between", alignItems: "center"
                }}>
                    <h3 style={{ margin: 0, fontSize: "1.125rem" }}>{title}</h3>
                    <button onClick={onClose} style={{
                        background: "transparent", border: "none", color: "var(--text-secondary)", padding: 0
                    }}>✕</button>
                </div>

                <div style={{ padding: "1.5rem" }}>
                    {children}
                </div>

                {actions && (
                    <div style={{
                        padding: "1rem 1.5rem",
                        background: "var(--secondary)",
                        borderTop: "1px solid var(--border)",
                        display: "flex", justifyContent: "flex-end", gap: "0.75rem"
                    }}>
                        {actions}
                    </div>
                )}
            </div>
        </div>
    );
}
