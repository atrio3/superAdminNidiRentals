import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import {
  FaUsers,
  FaUserCheck,
  FaCar,
  FaClipboardList,
  FaSignOutAlt,
  FaArrowLeft,
} from "react-icons/fa";

const AdminCard = ({ icon: Icon, label, onClick }) => {
  return (
    <div
      onClick={onClick}
      style={{
        width: "210px",
        height: "160px",
        backgroundColor: "#fff",
        borderRadius: "1.5rem",
        boxShadow: "0 8px 32px rgba(31,41,55,0.10)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
        transition:
          "transform 0.22s cubic-bezier(.4,0,.2,1), box-shadow 0.22s cubic-bezier(.4,0,.2,1)",
        gap: "1.2rem",
        fontFamily: "Inter, system-ui, sans-serif",
        fontWeight: 500,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.06)";
        e.currentTarget.style.boxShadow = "0 16px 40px rgba(25,118,210,0.13)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "0 8px 32px rgba(31,41,55,0.10)";
      }}
    >
      <Icon size={38} color="#1976d2" />
      <span
        style={{
          fontSize: "1.13rem",
          fontWeight: "600",
          color: "#22223b",
          letterSpacing: "0.01em",
        }}
      >
        {label}
      </span>
    </div>
  );
};

const WebsiteAdminPanel = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f4f6f8",
        padding: "3rem 1rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      {/* Go Back Button */}
      <button
        onClick={() => navigate(-1)}
        style={{
          alignSelf: "flex-start",
          marginBottom: "1.5rem",
          backgroundColor: "#ffffff",
          color: "#1976d2",
          border: "1px solid #1976d2",
          borderRadius: "12px",
          padding: "0.6rem 1.2rem",
          fontWeight: "600",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          cursor: "pointer",
          boxShadow: "0 4px 10px rgba(25, 118, 210, 0.08)",
          transition: "background 0.2s, transform 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#e3f2fd";
          e.currentTarget.style.transform = "scale(1.03)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "#ffffff";
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        <FaArrowLeft />
        Go Back
      </button>

      {/* Title */}
      <h1
        style={{
          fontSize: "2.4rem",
          fontWeight: "700",
          color: "#1e1e1e",
          marginBottom: "2.5rem",
          textAlign: "center",
          letterSpacing: "0.01em",
        }}
      >
        Website SuperAdmin Dashboard
      </h1>

      {/* Cards Grid */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "2.2rem",
          maxWidth: "960px",
          marginBottom: "3.2rem",
        }}
      >
        <AdminCard
          icon={FaUsers}
          label="Current Bookings"
          onClick={() => navigate("/booking")}
        />
        <AdminCard
          icon={FaUserCheck}
          label="Completed Bookings"
          onClick={() => navigate("/completed")}
        />
        <AdminCard
          icon={FaCar}
          label="Vehicle Management"
          onClick={() => navigate("/vehicles")}
        />
        <AdminCard
          icon={FaClipboardList}
          label="All Bookings"
          onClick={() => navigate("/allbookings")}
        />
      </div>

      {/* Logout Button */}
      <button
        onClick={logout}
        style={{
          backgroundColor: "#1976d2",
          color: "#ffffff",
          border: "none",
          borderRadius: "14px",
          padding: "1rem 2.8rem",
          fontSize: "1.1rem",
          fontWeight: "600",
          display: "flex",
          alignItems: "center",
          gap: "0.7rem",
          cursor: "pointer",
          boxShadow: "0 6px 16px rgba(25, 118, 210, 0.13)",
          transition: "background 0.2s, transform 0.2s",
          marginTop: "0.5rem",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#1253a2";
          e.currentTarget.style.transform = "scale(1.04)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "#1976d2";
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        <FaSignOutAlt size={20} />
        Logout
      </button>

      {/* Footer */}
      <footer
        style={{
          marginTop: "3.5rem",
          fontSize: "1rem",
          color: "#666",
          opacity: 0.7,
          letterSpacing: "0.01em",
        }}
      >
        Powered by{" "}
        <strong style={{ color: "#1976d2" }}>Atrio Technologies</strong>
      </footer>
    </div>
  );
};

export default WebsiteAdminPanel;
