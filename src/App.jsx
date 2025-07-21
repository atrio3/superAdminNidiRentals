import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";

// Pages & Components
import Login from "./pages/Login/Login";
import Home from "./pages/home/Home";
import Vehicle from "./components/VehicleList/VehicleList";
import Booking from "./pages/Booking/Booking";
import Completed from "./pages/Completed/Completed";
import Allbookings from "./pages/Allbookings/Allbookings";
import WebsiteAdminPanel from "./pages/WebsiteAdminPanel/WebsiteAdminPanel";
import AppAdminPanel from "./pages/AppAdminPanel/AppAdminPanel";

import { AuthContext } from "./context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  return currentUser ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <div className="grid-container">
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/vehicles"
            element={
              <PrivateRoute>
                <Vehicle />
              </PrivateRoute>
            }
          />
          <Route
            path="/booking"
            element={
              <PrivateRoute>
                <Booking />
              </PrivateRoute>
            }
          />
          <Route
            path="/completed"
            element={
              <PrivateRoute>
                <Completed />
              </PrivateRoute>
            }
          />
          <Route
            path="/allbookings"
            element={
              <PrivateRoute>
                <Allbookings />
              </PrivateRoute>
            }
          />
          <Route
            path="/website-admin"
            element={
              <PrivateRoute>
                <WebsiteAdminPanel />
              </PrivateRoute>
            }
          />
          <Route
            path="/app-admin"
            element={
              <PrivateRoute>
                <AppAdminPanel />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
