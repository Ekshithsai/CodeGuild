import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FiMenu, FiX, FiLogOut } from "react-icons/fi";
import "./Header.css";

function Header() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    window.location.reload();
  };

  const handleHamburgerClick = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  return (
    <header className="navbar">
      <nav>
        <div className="nav-brand" onClick={() => navigate("/")}>
          <span className="brand-icon">&#9670;</span>
          <span className="brand-text">Code Guild</span>
        </div>
        <button
          className={`hamburger${menuOpen ? " active" : ""}`}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          onClick={handleHamburgerClick}
          type="button"
        >
          {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
        <ul className={`nav-links${menuOpen ? " show" : ""}`}>
          <li><NavLink to="/" onClick={handleLinkClick}>Home</NavLink></li>
          <li><NavLink to="/dashboard" onClick={handleLinkClick}>Dashboard</NavLink></li>
          <li><NavLink to="/rooms" onClick={handleLinkClick}>Rooms</NavLink></li>
          <li><NavLink to="/calendar" onClick={handleLinkClick}>Calendar</NavLink></li>
          <li><NavLink to="/askAI" onClick={handleLinkClick}>Ask AI</NavLink></li>
          <li><NavLink to="/bookmarks" onClick={handleLinkClick}>Bookmarks</NavLink></li>
          <li><NavLink to="/profile" onClick={handleLinkClick}>Profile</NavLink></li>
          <li className="logout-btn">
            <button onClick={() => { handleLogout(); handleLinkClick(); }}>
              <FiLogOut size={16} /> Logout
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
