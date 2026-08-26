import React, { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";
import { LANGUAGE_VERSIONS, CODE_SNIPPETS } from "./constants";
import LanguageSelector from "./LanguageSelector";
import "./CodeEditor.css";

export default function CodeEditor({
  value,
  onChange,
  inputValue,
  onInputChange,
  language,
  onLanguageChange,
}) {
  const [output, setOutput] = useState("");
  const valueRef = useRef(value);
  valueRef.current = value;

  useEffect(() => {
    const isDefaultSnippet = Object.values(CODE_SNIPPETS).includes(valueRef.current);
    if (isDefaultSnippet || !valueRef.current) {
      onChange(CODE_SNIPPETS[language]);
    }
  }, [language, onChange]);

  const runCode = async () => {
    setOutput("Running...");
    try {
      const response = await axios.post(process.env.REACT_APP_JUDGE, {
        language,
        version: LANGUAGE_VERSIONS[language],
        files: [{ content: value }],
        stdin: inputValue,
      });

      const { run } = response.data;
      setOutput(run.output);
    } catch (err) {
      setOutput("Error running code");
      console.error(err);
    }
  };

  return (
    <div className="editor-container">
      <h1 className="editor-heading">Online IDE</h1>

      <LanguageSelector
        language={language}
        setLanguage={onLanguageChange}
      />

      <Editor
        height="300px"
        language={language === "cpp" ? "cpp" : language}
        theme="vs-dark"
        value={value}
        onChange={onChange}
        options={{
          // Disable autosuggestions
          quickSuggestions: false,
          suggestOnTriggerCharacters: false,
          wordBasedSuggestions: false,
          snippetsSuggestions: "none",
          parameterHints: { enabled: false },
        }}
      />

      <textarea
        className="input-box"
        rows="4"
        placeholder="Enter input here..."
        value={inputValue}
        onChange={(e) => onInputChange(e.target.value)}
      />

      <button onClick={runCode} className="run-button">
        Run Code
      </button>

      <h2 className="output-heading">Output:</h2>
      <pre className="output-box">{output}</pre>
    </div>
  );
}