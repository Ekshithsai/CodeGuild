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
      // Add user message to conversation
      const userMessage = { sender: "user", text: message };
      setConversation((prev) => [...prev, userMessage]);

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/ask-ai`,
        {
          message,
          context,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtoken")}`,
          },
        }
      );

      // Add AI response to conversation
      const aiMessage = { sender: "ai", text: response.data.answer };
      setConversation((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error getting AI response:", error);
      const errorMessage = error.response?.data?.error ||
        "The AI service could not respond. Check the backend configuration and try again.";
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
          <p className="eyebrow">CodeHarbor assistant</p>
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
