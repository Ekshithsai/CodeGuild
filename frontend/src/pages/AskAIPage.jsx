import React, { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import "../styles/askAI.css";
import { useLocation } from "react-router-dom";

function AskAIPage() {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversation, setConversation] = useState([]);
  const location = useLocation();
  const context = location.state?.context || {};

  const quickActions = [
    "Give me a hint without revealing the full solution.",
    "Explain my current code and identify any bugs.",
    "Analyze the time and space complexity of my code.",
    "Suggest important edge cases for this problem.",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsLoading(true);
    try {
      const userMessage = { sender: "user", text: message };
      setConversation((prev) => [...prev, userMessage]);

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/ask-ai`,
        { message, context },
        { headers: { Authorization: `Bearer ${localStorage.getItem("jwtoken")}` } }
      );

      const aiMessage = { sender: "ai", text: response.data.answer };
      setConversation((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error getting AI response:", error);
      let errorMessage = "The AI service could not respond.";
      
      if (error.response?.status === 503) {
        errorMessage = error.response.data?.error || "The AI service needs setup. Add GROQ_API_KEY to backend/.env. Get a free key at https://console.groq.com";
      } else if (error.response?.status === 401) {
        errorMessage = "Invalid API key. Check GROQ_API_KEY in backend/.env";
      } else if (error.response?.status === 429) {
        errorMessage = "Rate limited by Groq. Wait a moment and try again.";
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message?.includes("Failed to fetch") || error.message?.includes("NetworkError")) {
        errorMessage = "Cannot connect to backend server. Make sure it's running on port 5000.\n\nStart it with: cd backend && node index.js";
      }

      setConversation((prev) => [
        ...prev,
        { sender: "ai", text: errorMessage },
      ]);
    } finally {
      setIsLoading(false);
      setMessage("");
    }
  };

  return (
    <div className="ask-ai-container">
      <div className="ask-ai-heading">
        <div>
          <p className="eyebrow">Code Guild assistant</p>
          <h1>Ask AI</h1>
        </div>
        {context.problemTitle && <span className="context-badge">Context attached</span>}
      </div>
      {context.problemTitle && (
        <p className="context-summary">
          Working with <strong>{context.problemTitle}</strong> in {context.language || "your selected language"}.
        </p>
      )}
      <div className="quick-actions">
        {quickActions.map((action) => (
          <button key={action} type="button" onClick={() => setMessage(action)} disabled={isLoading}>
            {action}
          </button>
        ))}
      </div>
      <div className="conversation">
        {conversation.length === 0 && (
          <div className="empty-chat">
            <p>Ask me anything about coding, algorithms, or the current problem!</p>
          </div>
        )}
        {conversation.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            <div className="message-content">
              {msg.sender === "ai" ? (
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              ) : (
                msg.text
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="message ai">
            <div className="message-content loading">Thinking...</div>
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit} className="message-form">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask me anything..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || !message.trim()}>
          {isLoading ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
}

export default AskAIPage;
