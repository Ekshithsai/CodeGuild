import axios from "axios";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ProblemCard from "../components/Problemcard";
import "../styles/Dashboard.css";

const STATIC_TAGS = [
  "Array", "String", "Hash Table", "Dynamic Programming", "Math",
  "Sorting", "Greedy", "Depth-First Search", "Binary Search", "Database",
  "Matrix", "Tree", "Breadth-First Search", "Bit Manipulation", "Two Pointers",
  "Prefix Sum", "Heap (Priority Queue)", "Simulation", "Binary Tree", "Stack",
  "Graph", "Counting", "Sliding Window", "Design", "Enumeration", "Backtracking",
  "Union Find", "Linked List", "Ordered Set", "Number Theory", "Monotonic Stack",
  "Segment Tree", "Trie", "Combinatorics", "Bitmask", "Queue", "Divide and Conquer",
  "Recursion", "Binary Indexed Tree", "Memoization", "Hash Function", "Geometry",
  "Binary Search Tree", "String Matching", "Topological Sort", "Shortest Path",
  "Rolling Hash", "Game Theory", "Interactive", "Data Stream", "Monotonic Queue",
];


function Dashboard() {
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [filterMode, setFilterMode] = useState("OR");
  const [bookmarks, setBookmarks] = useState(new Set());
  const [activeTab, setActiveTab] = useState("problems");
  const [searchTerm, setSearchTerm] = useState("");


  useEffect(() => {
    async function fetchProblems() {
      try {
        const [problemsRes, bookmarksRes] = await Promise.all([
          axios.get(`https://leetcode-api-mu.vercel.app/problems?limit=100`),
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/bookmarks`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("jwtoken")}` },
          }).catch(() => ({ data: { bookmarks: [] } })),
        ]);
        setProblems(problemsRes.data.problemsetQuestionList);
        setBookmarks(new Set(bookmarksRes.data?.bookmarks || []));
      } catch (error) {
        console.error("Error fetching problems:", error);
      }
    }
    fetchProblems();
  }, []);

  const handleBookmarkToggle = useCallback((slug, isNowBookmarked) => {
    setBookmarks((prev) => {
      const next = new Set(prev);
      if (isNowBookmarked) next.add(slug);
      else next.delete(slug);
      return next;
    });
  }, []);

  const handleCardClick = (titleSlug) => {
    navigate(`/problem/${titleSlug}`);
  };

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // --- Analytics computed data ---
  const analytics = useMemo(() => {
    if (!problems.length) return null;

    const total = problems.length;
    const easy = problems.filter((p) => p.difficulty === "Easy").length;
    const medium = problems.filter((p) => p.difficulty === "Medium").length;
    const hard = problems.filter((p) => p.difficulty === "Hard").length;

    const avgAccuracy = problems.reduce((sum, p) => sum + (p.acRate || 0), 0) / total;

    // Questions solved per topic
    const topicStats = {};
    STATIC_TAGS.forEach((tag) => { topicStats[tag] = { total: 0, easy: 0, medium: 0, hard: 0 }; });
    problems.forEach((p) => {
      p.topicTags.forEach((t) => {
        if (topicStats[t.name]) {
          topicStats[t.name].total++;
          if (p.difficulty === "Easy") topicStats[t.name].easy++;
          else if (p.difficulty === "Medium") topicStats[t.name].medium++;
          else if (p.difficulty === "Hard") topicStats[t.name].hard++;
        }
      });
    });

    // Top 10 topics by problem count
    const topTopics = Object.entries(topicStats)
      .filter(([_, v]) => v.total > 0)
      .sort((a, b) => b[1].total - a[1].total)
      .slice(0, 10);

    return { total, easy, medium, hard, avgAccuracy, topicStats, topTopics };
  }, [problems]);

  const filteredProblems = useMemo(() => {
    let filtered = selectedTags.length === 0
      ? problems
      : problems.filter((problem) => {
          const tagNames = problem.topicTags.map((tag) => tag.name);
          return filterMode === "OR"
            ? selectedTags.some((tag) => tagNames.includes(tag))
            : selectedTags.every((tag) => tagNames.includes(tag));
        });

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((p) => p.title.toLowerCase().includes(term));
    }
    return filtered;
  }, [problems, selectedTags, filterMode, searchTerm]);

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p className="dashboard-subtitle">Track your progress and master every topic</p>
        </div>
        <div className="dashboard-tabs">
          <button
            className={`tab-btn ${activeTab === "problems" ? "active" : ""}`}
            onClick={() => setActiveTab("problems")}
          >
            Problems
          </button>
          <button
            className={`tab-btn ${activeTab === "analysis" ? "active" : ""}`}
            onClick={() => setActiveTab("analysis")}
          >
            Analysis
          </button>
        </div>
      </div>

      {activeTab === "problems" && (
        <>
          {/* Search */}
          <div className="dashboard-search">
            <input
              type="text"
              placeholder="Search problems by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          {/* Filter Mode Toggle */}
          <div className="filter-bar">
            <div className="filter-mode-toggle">
              <span className="filter-label">Filter:</span>
              <button
                className={`mode-btn ${filterMode === "OR" ? "active" : ""}`}
                onClick={() => setFilterMode("OR")}
              >
                ANY
              </button>
              <button
                className={`mode-btn ${filterMode === "AND" ? "active" : ""}`}
                onClick={() => setFilterMode("AND")}
              >
                ALL
              </button>
            </div>
            <span className="result-count">{filteredProblems.length} problems</span>
          </div>

          {/* Static Tags */}
          <div className="tag-filters">
            <div className="tag-container">
              {STATIC_TAGS.map((tag) => (
                <button
                  key={tag}
                  className={`tag-button ${selectedTags.includes(tag) ? "selected" : ""}`}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Problem List */}
          <div className="problems-container">
            {filteredProblems.length > 0 ? (
              <ul className="problem-list">
                {filteredProblems.map((problem) => (
                  <li key={problem.questionFrontendId}>
                    <ProblemCard
                      title={problem.title}
                      platform="LeetCode"
                      difficulty={problem.difficulty}
                      Accuracy={problem.acRate}
                      locked={problem.isPaidOnly}
                      onClick={() => handleCardClick(problem.titleSlug)}
                      titleSlug={problem.titleSlug}
                      isBookmarked={bookmarks.has(problem.titleSlug)}
                      onBookmarkToggle={handleBookmarkToggle}
                    />
                  </li>
                ))}
              </ul>
            ) : (
              <div className="no-problems">
                <span className="no-problems-icon">&#9670;</span>
                <p>No problems found for selected tags.</p>
              </div>
            )}
          </div>
        </>
      )}

      {activeTab === "analysis" && analytics && (
        <div className="analysis-section">
          {/* Overview Stats */}
          <div className="analysis-overview">
            <div className="analysis-card total-card">
              <div className="card-label">Total Problems</div>
              <div className="card-value">{analytics.total}</div>
            </div>
            <div className="analysis-card easy-card">
              <div className="card-label">Easy</div>
              <div className="card-value">{analytics.easy}</div>
              <div className="card-bar">
                <div className="bar-fill easy-fill" style={{ width: `${(analytics.easy / analytics.total) * 100}%` }}></div>
              </div>
            </div>
            <div className="analysis-card medium-card">
              <div className="card-label">Medium</div>
              <div className="card-value">{analytics.medium}</div>
              <div className="card-bar">
                <div className="bar-fill medium-fill" style={{ width: `${(analytics.medium / analytics.total) * 100}%` }}></div>
              </div>
            </div>
            <div className="analysis-card hard-card">
              <div className="card-label">Hard</div>
              <div className="card-value">{analytics.hard}</div>
              <div className="card-bar">
                <div className="bar-fill hard-fill" style={{ width: `${(analytics.hard / analytics.total) * 100}%` }}></div>
              </div>
            </div>
            <div className="analysis-card avg-card">
              <div className="card-label">Avg. Accuracy</div>
              <div className="card-value">{analytics.avgAccuracy.toFixed(1)}%</div>
              <div className="card-bar">
                <div className="bar-fill avg-fill" style={{ width: `${analytics.avgAccuracy}%` }}></div>
              </div>
            </div>
          </div>

          {/* Questions Solved Per Topic */}
          <div className="topic-analysis">
            <h2 className="section-heading">Questions per Topic</h2>
            <div className="topic-grid">
              {analytics.topTopics.map(([topic, stats]) => (
                <div key={topic} className="topic-card">
                  <div className="topic-header">
                    <span className="topic-name">{topic}</span>
                    <span className="topic-count">{stats.total}</span>
                  </div>
                  <div className="topic-bar">
                    <div
                      className="topic-bar-easy"
                      style={{ width: `${(stats.easy / stats.total) * 100}%` }}
                    ></div>
                    <div
                      className="topic-bar-medium"
                      style={{ width: `${(stats.medium / stats.total) * 100}%` }}
                    ></div>
                    <div
                      className="topic-bar-hard"
                      style={{ width: `${(stats.hard / stats.total) * 100}%` }}
                    ></div>
                  </div>
                  <div className="topic-breakdown">
                    <span className="bd-easy">E: {stats.easy}</span>
                    <span className="bd-medium">M: {stats.medium}</span>
                    <span className="bd-hard">H: {stats.hard}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Difficulty Distribution */}
          <div className="difficulty-distribution">
            <h2 className="section-heading">Difficulty Distribution</h2>
            <div className="distribution-chart">
              <div className="dist-bar">
                <div className="dist-segment easy-seg" style={{ flex: analytics.easy }}>
                  <span>{analytics.easy}</span>
                </div>
                <div className="dist-segment medium-seg" style={{ flex: analytics.medium }}>
                  <span>{analytics.medium}</span>
                </div>
                <div className="dist-segment hard-seg" style={{ flex: analytics.hard }}>
                  <span>{analytics.hard}</span>
                </div>
              </div>
              <div className="dist-legend">
                <div className="legend-item"><span className="legend-dot easy-dot"></span>Easy ({((analytics.easy / analytics.total) * 100).toFixed(0)}%)</div>
                <div className="legend-item"><span className="legend-dot medium-dot"></span>Medium ({((analytics.medium / analytics.total) * 100).toFixed(0)}%)</div>
                <div className="legend-item"><span className="legend-dot hard-dot"></span>Hard ({((analytics.hard / analytics.total) * 100).toFixed(0)}%)</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
