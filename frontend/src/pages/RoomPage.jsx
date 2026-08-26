import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "../styles/rooms.css";
import io from "socket.io-client";
import CodeEditor from "../components/CodeEditor";

function RoomPage() {
  const location = useLocation();
  const username = location.state?.username;
  const { roomId } = useParams();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [chatMode, setChatMode] = useState(true);
  const [sharedText, setSharedText] = useState("");
  const [sharedInput, setSharedInput] = useState("");
  const [sharedLanguage, setSharedLanguage] = useState("cpp");
  const textAreaRef = useRef(null);
  const messagesEndRef = useRef(null);
  const socket = useRef();
  const navigate = useNavigate();
  const [copyStatus, setCopyStatus] = useState("");

  const inviteLink = `${window.location.origin}/rooms/${encodeURIComponent(roomId)}`;

  useEffect(() => {
    if (!username || !roomId) {
      navigate(`/rooms?roomId=${encodeURIComponent(roomId || "")}`);
    }
  }, [navigate, roomId, username]);
  const backend = process.env.REACT_APP_BACKEND_URL;

  // Use refs to avoid stale closures in socket listeners
  const sharedTextRef = useRef(sharedText);
  const sharedInputRef = useRef(sharedInput);
  sharedTextRef.current = sharedText;
  sharedInputRef.current = sharedInput;

  useEffect(() => {
    if (!username || !roomId) return undefined;

    socket.current = io(`${backend}`);

    socket.current.emit("join-room", { roomId, username });

    socket.current.on("user-joined", (joinedUsername) => {
      setUsers((prev) => [...new Set([...prev, joinedUsername])]);
    });

    socket.current.on("user-left", (leftUsername) => {
      setUsers((prev) => prev.filter((user) => user !== leftUsername));
    });

    socket.current.on("room-users", (userList) => {
      setUsers(userList);
    });

    socket.current.on("recieve-msg", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.current.on(
      "room-init",
      ({ users, sharedText, sharedInput, sharedLanguage, previousMessages }) => {
        setUsers(users);
        setSharedText(sharedText);
        setSharedInput(sharedInput || "");
        setSharedLanguage(sharedLanguage || "cpp");
        if (previousMessages) setMessages(previousMessages);
      }
    );

    socket.current.on("text-edit", (text) => {
      if (text !== sharedTextRef.current) {
        setSharedText(text);
      }
    });

    socket.current.on("input-edit", (input) => {
      if (input !== sharedInputRef.current) {
        setSharedInput(input);
      }
    });

    socket.current.on("language-change", (language) => {
      setSharedLanguage(language);
    });

    return () => {
      socket.current.removeAllListeners();
      socket.current.disconnect();
    };
  }, [username, roomId, backend]);

  const copyInviteLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopyStatus("Invite link copied");
    } catch (error) {
      setCopyStatus("Copy unavailable. Share this link: " + inviteLink);
    }
    window.setTimeout(() => setCopyStatus(""), 3500);
  };

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const toggleEditor = () => {
    setChatMode(!chatMode);
    if (!chatMode && textAreaRef.current) {
      textAreaRef.current.focus();
    }
  };

  const handleTextChange = (newText) => {
    setSharedText(newText);
    socket.current.emit("text-edit", {
      roomId,
      text: newText,
    });
  };

  const sendMsg = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.current.emit("send-msg", {
        roomId,
        message,
        username,
      });
      setMessage("");
    }
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="room-container">
      <div className="left">
        <div className="room-header">
          <div>
            <p className="eyebrow">Collaborative session</p>
            <h2>{roomId}</h2>
          </div>
          <button type="button" className="invite-button" onClick={copyInviteLink}>
            Copy invite link
          </button>
        </div>
        {copyStatus && <p className="copy-status" role="status">{copyStatus}</p>}
        <div className="room-meta">
          <span>{users.length} participant{users.length === 1 ? "" : "s"}</span>
          <span>{sharedLanguage.toUpperCase()}</span>
        </div>
        <hr />
        <h3>Users in the Room:</h3>
        <ul>
          {[...new Set(users)].map((user) => (
            <li key={user}>{user}</li>
          ))}
        </ul>
      </div>
      <div className="right">
        <button onClick={toggleEditor} className="toggle-mode-btn">
          {chatMode ? "Switch to Editor" : "Switch to Chat"}
        </button>

        {chatMode ? (
          <div className="chat-container">
            <div className="title">
              <h3>Messages</h3>
              <hr />
            </div>
            <div className="messages">
              {messages.map((msg, index) => (
                <div key={index} className="message">
                  <div className="message-header">
                    <strong>{msg.username}</strong>
                    <span className="message-time">
                      {formatTime(msg.timestamp)}
                    </span>
                  </div>
                  <p>{msg.message}</p>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <form onSubmit={sendMsg} className="message-form">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
              />
              <button type="submit">Send</button>
            </form>
          </div>
        ) : (
          <div className="editor-container">
            <div className="title">
              <h3>Collaborative Editor</h3>
              <hr />
            </div>
            <CodeEditor
              value={sharedText}
              onChange={handleTextChange}
              inputValue={sharedInput}
              onInputChange={(newInput) => {
                setSharedInput(newInput);
                socket.current.emit("input-edit", {
                  roomId,
                  input: newInput,
                });
              }}
              language={sharedLanguage}
              onLanguageChange={(lang) => {
                setSharedLanguage(lang);
                socket.current.emit("language-change", { roomId, language: lang });
              }}
              height="70vh"
              width="100%"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default RoomPage;
