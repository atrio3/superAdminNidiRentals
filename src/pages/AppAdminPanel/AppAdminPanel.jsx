import React from "react";
import { useNavigate } from "react-router-dom";

const AppAdminPanel = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#f4f6f8",
      }}
    >
      <h1
        style={{ fontSize: "2.5rem", color: "#1976d2", marginBottom: "1rem" }}
      >
        App Admin Panel
      </h1>
      <p
        style={{
          fontSize: "1.3rem",
          color: "#444",
          background: "#fff",
          padding: "2rem 3rem",
          borderRadius: "1rem",
          boxShadow: "0 4px 16px rgba(25, 118, 210, 0.08)",
          fontWeight: 500,
        }}
      >
        🚧 Coming Soon 🚧
      </p>
      <button
        onClick={() => navigate(-1)}
        style={{
          marginTop: "2rem",
          padding: "0.7rem 2.2rem",
          background: "#1976d2",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          fontSize: "1rem",
          fontWeight: 600,
          cursor: "pointer",
          boxShadow: "0 2px 8px rgba(25, 118, 210, 0.10)",
          transition: "background 0.2s, transform 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#1253a2")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "#1976d2")}
      >
        Go Back
      </button>
    </div>
  );
};

export default AppAdminPanel;
