export function App() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        background: "#0f172a",
        color: "#e5e7eb"
      }}
    >
      <div
        style={{
          padding: "2rem 3rem",
          borderRadius: "1rem",
          background: "rgba(15,23,42,0.9)",
          border: "1px solid rgba(148,163,184,0.4)",
          boxShadow: "0 20px 45px rgba(15,23,42,0.9)",
          textAlign: "center",
          maxWidth: "480px"
        }}
      >
        <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>komandaX</h1>
        <p style={{ marginBottom: "1.5rem", color: "#9ca3af" }}>
          Frontend is running. Start building your pages in <code>frontend/src/pages</code>.
        </p>
        <p style={{ fontSize: "0.9rem", color: "#6b7280" }}>
          This is just a blank starting screen. Replace <code>App.tsx</code> with your real layout.
        </p>
      </div>
    </div>
  );
}

