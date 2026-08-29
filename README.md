# ⚡ CodeGuild

An interactive coding community platform to practice, collaborate, and level up your skills.
---

## What is this?

CodeGuild is a place where you can solve coding problems, chat with others in real-time, get help from an AI assistant, and track your progress — all in the browser. Think of it as a lightweight LeetCode + collaborative coding space.
---
## Features

-  **Auth** — Register/login with JWT and bcrypt. Tokens expire after 24 hours.
-  **Practice** — 600+ problems with an in-browser Monaco editor and live code execution via Piston.
-  **Collab Rooms** — Real-time shared editor and chat for pair programming.
-  **AI Assistant** — Groq-powered (Llama 3.3) chatbot for hints and coding help.
-  **Discussions** — Share solutions, upvote/downvote, and learn from others.
-  **Profiles** — Track your progress and showcase skills.
-  **Bookmarks** — Save problems for later.
-  **Contest Calendar** — Never miss a coding contest.
---
## Tech Stack
| Layer | Tech |
|-------|------|
| Frontend | React 19, React Router, Monaco Editor, Socket.IO Client |
| Backend | Node.js, Express 5, Socket.IO |
| Database | MongoDB (Mongoose) |
| Auth | JWT + bcrypt |
| AI | Groq API (Llama 3.3) |
| Code Execution | Piston API (free, no key needed) |

---

## Getting Started (Local)

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/) running locally (or a free Atlas cluster)
- A free [Groq API key](https://console.groq.com/keys) (optional, for AI features)

### 1. Clone & install

```bash
git clone https://github.com/Ekshithsai/ZCoder.git
cd ZCoder

# Backend
cd backend && npm install

# Frontend (in a new terminal)
cd ../frontend && npm install
```

### 2. Set up environment variables

**Backend** — create `backend/.env`:

```env
MONGODB_URI=mongodb://localhost:27017/zcoder
FRONTEND_URL=http://localhost:3000
PORT=5000
JWT_SECRET=any-random-string-here
GROQ_API_KEY=your_groq_api_key_here   # optional
```

**Frontend** — create `frontend/.env`:

```env
REACT_APP_BACKEND_URL=http://localhost:5000
```

### 3. Run

Start the backend and frontend in separate terminals:

```bash
# Terminal 1 — backend
cd backend && npm run dev

# Terminal 2 — frontend
cd frontend && npm start
```

Open [http://localhost:3000](http://localhost:3000) — you're good to go! 

---
## Project Structure

```
ZCoder/
├── backend/
│   ├── config/          # DB connection
│   ├── middleware/       # Auth middleware
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API endpoints
│   ├── index.js         # Server entry
│   └── socketHandler.js # Real-time events
└── frontend/
    └── src/
        ├── assets/      # Images & logos
        ├── components/  # Reusable UI
        ├── pages/       # Route pages
        └── styles/      # CSS
```

---

## Security

- JWT tokens with 24-hour expiration
- Passwords hashed with bcrypt
- CORS restricted to frontend origin
- Input sanitization against NoSQL injection
- XSS protection via DOMPurify
- Authenticated voting with duplicate-vote prevention

---

<div align="center">

**Built by Ekshith , Bipan **

</div>
