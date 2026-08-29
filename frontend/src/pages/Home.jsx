import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FiGithub, FiArrowRight, FiCode, FiUsers, FiCalendar, FiCpu, FiBarChart2, FiSearch } from "react-icons/fi";
import "../styles/Home.css";

function useDebounce(callback, delay) {
  const timerRef = useRef(null);
  return (...args) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => callback(...args), delay);
  };
}

const codeSnippet = [
  '// Welcome to Code Guild',
  'class Solution {',
  'public:',
  '    int maxSubArray(vector<int>& nums) {',
  '        int maxSum = nums[0];',
  '        int curr = nums[0];',
  '',
  '        for (int i = 1; i < nums.size(); i++) {',
  '            curr = max(nums[i], curr + nums[i]);',
  '            maxSum = max(maxSum, curr);',
  '        }',
  '        return maxSum;',
  '    }',
  '};',
].join('\n');

function Home() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const sectionRefs = useRef([]);

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

  const features = [
    { icon: <FiSearch />, title: "Find Coders", description: "Search and connect with developers from the community.", route: "/dashboard", hasSearch: true },
    { icon: <FiUsers />, title: "Personal Profile", description: "Track your progress and showcase your coding achievements.", route: "/profile" },
    { icon: <FiCode />, title: "Collaborative Rooms", description: "Real-time coding and chat with other developers.", route: "/rooms" },
    { icon: <FiCalendar />, title: "Contest Calendar", description: "Never miss important coding competitions and hackathons.", route: "/calendar" },
    { icon: <FiCpu />, title: "AI Assistant", description: "Get instant help with your coding questions.", route: "/askAI" },
    { icon: <FiBarChart2 />, title: "Progress Dashboard", description: "Visualize your coding journey and growth.", route: "/dashboard" },
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <main className="main">
        <section className="hero" ref={(el) => (sectionRefs.current[0] = el)} data-section="hero">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="badge-dot"></span>
              Built by <strong>Ekshith</strong> & <strong>Bipan</strong>
            </div>
            <h1>
              <span className="hero-accent">Master</span> the Art of<br />Competitive Coding
            </h1>
            <p className="hero-subtitle">
              Practice problems, collaborate in real-time rooms, track your progress,
              and get AI-powered guidance — all in one powerful platform.
            </p>
            <div className="hero-cta">
              <button className="cta-btn primary" onClick={() => navigate("/dashboard")}>
                Go to Dashboard <FiArrowRight size={18} />
              </button>
              <button className="cta-btn secondary" onClick={() => navigate("/rooms")}>
                Join a Room
              </button>
            </div>
            <div className="hero-stats">
              <div className="hero-stat">
                <span className="hero-stat-number">600+</span>
                <span className="hero-stat-label">Problems</span>
              </div>
              <div className="hero-stat-divider"></div>
              <div className="hero-stat">
                <span className="hero-stat-number">24/7</span>
                <span className="hero-stat-label">Active Rooms</span>
              </div>
              <div className="hero-stat-divider"></div>
              <div className="hero-stat">
                <span className="hero-stat-number">4</span>
                <span className="hero-stat-label">Languages</span>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="code-window">
              <div className="window-header">
                <div className="window-dots">
                  <span className="dot red"></span>
                  <span className="dot yellow"></span>
                  <span className="dot green"></span>
                </div>
                <span className="window-title">solution.cpp</span>
              </div>
              <pre className="code-content"><code>{codeSnippet}</code></pre>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="features-section" ref={(el) => (sectionRefs.current[1] = el)} data-section="features">
          <h2 className="section-title">
            Everything You Need
            <span className="title-underline"></span>
          </h2>
          <div className="features-grid">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className={`feature-card ${feature.hasSearch ? "search-feature" : ""}`}
                onClick={() => feature.route && handleFeatureClick(feature.route)}
                style={{ animationDelay: `${idx * 0.08}s` }}
              >
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                {feature.hasSearch ? (
                  <div className="search-wrapper">
                    <input
                      type="search"
                      placeholder="Search users..."
                      value={searchQuery}
                      onChange={searched}
                      onClick={(e) => e.stopPropagation()}
                      className="user-search"
                    />
                    {users.length > 0 ? (
                      <ul className="search-results">
                        {users.map((user) => (
                          <li key={user.id} onClick={(e) => { e.stopPropagation(); navigate(`/user/${user.id}`); }}>
                            {user.username}
                          </li>
                        ))}
                      </ul>
                    ) : searchQuery.length > 2 ? (
                      <p className="no-results">No users found</p>
                    ) : null}
                  </div>
                ) : (
                  <p>{feature.description}</p>
                )}
                <div className="feature-arrow">
                  <FiArrowRight size={16} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Stats Section */}
        <section className="stats-section" ref={(el) => (sectionRefs.current[2] = el)} data-section="stats">
          <div className="stat-item">
            <h3>600+</h3>
            <p>Practice Problems</p>
          </div>
          <div className="stat-item">
            <h3>24/7</h3>
            <p>Active Rooms</p>
          </div>
          <div className="stat-item">
            <h3>Live</h3>
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
          <div className="footer-brand">
            <span className="footer-brand-icon">&#9670;</span>
            <span className="footer-brand-text">Code Guild</span>
          </div>
          <div className="footer-info">
            <p>Made with passion by <strong>Ekshith</strong> & <strong>Bipan</strong></p>
          </div>
          <div className="footer-social">
            <button
              className="social-icon"
              onClick={() => { window.location.href = "https://github.com/Ekshithsai"; }}
              aria-label="GitHub"
            >
              <FiGithub size={18} />
            </button>
          </div>
        </div>
        <div className="footer-copyright">
          <p>&copy; 2025 Code Guild. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
