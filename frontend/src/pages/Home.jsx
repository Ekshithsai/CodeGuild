import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { LuGithub } from "react-icons/lu";
import "../styles/Home.css";
import logo from "../assets/logo-noBg.png";

function useDebounce(callback, delay) {
  const timerRef = useRef(null);
  return (...args) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => callback(...args), delay);
  };
}

function Home() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const backend = process.env.REACT_APP_BACKEND_URL;

  const performSearch = useDebounce(async (query) => {
    try {
      const response = await fetch(`${backend}/users/${encodeURIComponent(query)}`);
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Search error:", error);
    }
  }, 800);

  const searched = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length > 2) {
      performSearch(query);
    } else {
      setUsers([]);
    }
  };

  const handleFeatureClick = (route) => {
    navigate(route);
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <main className="main">
        <section className="hero">
          <div className="hero-content">
            <h1>
              <span className="hero-accent">Elevate</span> Your Coding Journey
            </h1>
            <p className="hero-subtitle">
              Practice, collaborate, compete, and learn—all in one powerful
              platform designed for developers.
            </p>
            <div className="hero-cta">
              <button
                className="cta-btn primary"
                onClick={() => navigate("/dashboard")}
              >
                Go to Dashboard
              </button>
              <button
                className="cta-btn secondary"
                onClick={() => navigate("/rooms")}
              >
                Join a Room
              </button>
            </div>
          </div>
          <div className="hero-image">
            <div className="code-snippet">
              <pre>
                {`// Welcome to CodeHarbor\nfunction greet() {\n  console.log("Happy coding!");\n}`}
              </pre>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="features-section">
          <h2 className="section-title">Features</h2>
          <div className="features-grid">
            <div className="feature-card search-feature">
              <div className="feature-icon">🔍</div>
              <h3>Find Coders</h3>
              <input
                type="search"
                placeholder="Search users..."
                value={searchQuery}
                onChange={searched}
                className="user-search"
              />
              {users.length > 0 ? (
                <ul className="search-results">
                  {users.map((user) => (
                    <li
                      key={user.id}
                      onClick={() => navigate(`/user/${user.id}`)}
                    >
                      {user.username}
                    </li>
                  ))}
                </ul>
              ) : searchQuery.length > 2 ? (
                <p className="no-results">No users found</p>
              ) : null}
            </div>
            <div
              className="feature-card"
              onClick={() => handleFeatureClick("/profile")}
            >
              <div className="feature-icon">👤</div>
              <h3>Personal Profile</h3>
              <p>Track your progress and showcase your coding achievements.</p>
            </div>

            <div
              className="feature-card"
              onClick={() => handleFeatureClick("/rooms")}
            >
              <div className="feature-icon">💬</div>
              <h3>Collaborative Rooms</h3>
              <p>Real-time coding and chat with other developers.</p>
            </div>

            <div
              className="feature-card"
              onClick={() => handleFeatureClick("/calendar")}
            >
              <div className="feature-icon">📅</div>
              <h3>Contest Calendar</h3>
              <p>Never miss important coding competitions and hackathons.</p>
            </div>

            <div
              className="feature-card"
              onClick={() => handleFeatureClick("/askAI")}
            >
              <div className="feature-icon">🤖</div>
              <h3>AI Assistant</h3>
              <p>Get instant help with your coding questions.</p>
            </div>

            <div
              className="feature-card"
              onClick={() => handleFeatureClick("/dashboard")}
            >
              <div className="feature-icon">📊</div>
              <h3>Progress Dashboard</h3>
              <p>Visualize your coding journey and growth.</p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="stats-section">
          <div className="stat-item">
            <h3>600+</h3>
            <p>Practise Problems</p>
          </div>
          <div className="stat-item">
            <h3>24/7</h3>
            <p>Active Rooms</p>
          </div>
          <div className="stat-item">
            <h3>Working</h3>
            <p>Contest Calendar</p>
          </div>
          <div className="stat-item">
            <h3>Instant</h3>
            <p>AI Responses</p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">
            <span className="logo-accent">
              <img src={logo} alt="logo" />
            </span>
          </div>
          <div className="footer-links">
            <button className="footer-link">About</button>
            <button className="footer-link">Features</button>
            <button className="footer-link">Contact</button>
            <button className="footer-link">Privacy</button>
          </div>
          <div className="footer-social">
            <button
              className="social-icon"
              onClick={() => {
                window.location.href =
                  "https://github.com/Ekshithsai";
              }}
            >
              <LuGithub />
            </button>
          </div>
        </div>
        <div className="footer-copyright">
          <p>&copy; 2025 CodeHarbor by Ekshithsai.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
