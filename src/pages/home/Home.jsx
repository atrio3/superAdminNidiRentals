import React from "react";
import { useNavigate } from "react-router-dom";
import { FaGlobe, FaMobileAlt } from "react-icons/fa";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home">
      {/* Header */}
      <header className="home-header">
        <img src="/logo.jpg" alt="Logo" className="home-logo" />
        <div className="home-header-text">
          <h1 className="home-title">
            <span className="highlight">Nidi</span> Rentals Admin
          </h1>
          <p className="home-subtitle">
            Effortlessly manage your platform — Web & App.
          </p>
        </div>
      </header>

      {/* Main Section */}
      <main className="card-grid">
        <ControlCard
          icon={<FaGlobe size={28} />}
          label="Website Controls"
          onClick={() => navigate("/website-admin")}
        />
        <ControlCard
          icon={<FaMobileAlt size={28} />}
          label="App Controls"
          onClick={() => navigate("/app-admin")}
        />
      </main>

      {/* Footer */}
      <footer className="home-footer">
        Powered by <strong className="footer-brand">Atrio Technologies</strong>
      </footer>
    </div>
  );
};

const ControlCard = ({ icon, label, onClick }) => {
  return (
    <div className="control-card" onClick={onClick}>
      <div className="control-icon">{icon}</div>
      <span className="control-label">{label}</span>
    </div>
  );
};

export default Home;
