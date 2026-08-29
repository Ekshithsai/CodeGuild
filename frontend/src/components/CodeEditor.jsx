import React, { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import { CODE_SNIPPETS } from "./constants";
import LanguageSelector from "./LanguageSelector";
import "./CodeEditor.css";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

export default function CodeEditor({
  value,
  onChange,
  inputValue,
  onInputChange,
  language,
  onLanguageChange,
}) {
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState("");
  const valueRef = useRef(value);
  valueRef.current = value;

  useEffect(() => {
    const isDefaultSnippet = Object.values(CODE_SNIPPETS).includes(valueRef.current);
    if (isDefaultSnippet || !valueRef.current) {
      onChange(CODE_SNIPPETS[language]);
    }
  }, [language, onChange]);

  const runCode = async () => {
    if (!value || !value.trim()) {
      setError("No code to run.");
      return;
    }

    setIsRunning(true);
    setOutput("");
    setError("");

    try {
      const response = await fetch(`${BACKEND_URL}/api/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language,
          code: value,
          stdin: inputValue || "",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Server error (${response.status})`);
      }

      setOutput(data.output || "Program executed successfully.");
    } catch (err) {
      console.error("Execution error:", err);
      if (err.message.includes("Failed to fetch") || err.message.includes("NetworkError")) {
        setError("Cannot connect to backend server.");
        setOutput("Make sure the backend is running on port 5000.\n\nStart it with: cd backend && node index.js");
      } else {
        setError("Execution failed: " + err.message);
        setOutput(err.message || "An error occurred while running the code.");
      }
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="editor-container">
      <div className="editor-top-bar">
        <h1 className="editor-heading">Online IDE</h1>
        <LanguageSelector language={language} setLanguage={onLanguageChange} />
      </div>

      <div className="editor-wrapper">
        <Editor
          height="320px"
          language={language === "cpp" ? "cpp" : language}
          theme="vs-dark"
          value={value}
          onChange={onChange}
          options={{
            quickSuggestions: false,
            suggestOnTriggerCharacters: false,
            wordBasedSuggestions: false,
            snippetsSuggestions: "none",
            parameterHints: { enabled: false },
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            lineHeight: 1.6,
            padding: { top: 12 },
            scrollBeyondLastLine: false,
            renderLineHighlight: "line",
          }}
        />
      </div>

      <div className="io-section">
        <div className="input-group">
          <label className="io-label">Input</label>
          <textarea
            className="input-box"
            rows="3"
            placeholder="Enter standard input here..."
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
          />
        </div>

        <button
          onClick={runCode}
          className={`run-button ${isRunning ? "running" : ""}`}
          disabled={isRunning}
        >
          {isRunning ? (<><span className="spinner"></span>Running...</>) : (<>▶ Run Code</>)}
        </button>
      </div>

      <div className="output-section">
        <label className="io-label">Output</label>
        {error && <div className="error-banner">{error}</div>}
        <pre className={`output-box ${error ? "has-error" : ""}`}>{output || "Output will appear here..."}</pre>
      </div>
    </div>
  );
}
