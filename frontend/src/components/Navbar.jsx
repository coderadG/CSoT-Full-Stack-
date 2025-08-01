import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isAuthPage = ["/login", "/register"].includes(location.pathname);

  return (
    <nav
      style={{
        padding: "1rem 2rem",
        backgroundColor: theme === "dark" ? "#1a1a1a" : "#f8f8f8",
        color: theme === "dark" ? "#fff" : "#000",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
      }}
    >
      {/* Left side: Logo or app name */}
      <div style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
        <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>
          SparkChat
        </Link>
      </div>

      {/* Middle: Navigation links */}
      <div>
        {user && !isAuthPage && (
          <>
            <Link
              to="/users"
              style={{
                marginRight: "1rem",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              Users
            </Link>
            <Link
              to="/recent-chats"
              style={{
                marginRight: "1rem",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              Recent Chats
            </Link>
          </>
        )}
      </div>

      {/* Right side: Theme toggle + Logout/Login/Register */}
      <div>
        <button onClick={toggleTheme} style={{ marginRight: "1rem" }}>
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>

        {user && !isAuthPage && (
          <button onClick={handleLogout}>Logout</button>
        )}

        {!user && location.pathname !== "/login" && (
          <button onClick={() => navigate("/login")}>Login</button>
        )}
        {!user && location.pathname !== "/register" && (
          <button
            onClick={() => navigate("/register")}
            style={{ marginLeft: "0.5rem" }}
          >
            Register
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
