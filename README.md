# ⚡ CodeHarbor

An interactive coding community platform to practice, collaborate, and level up your skills.

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=white)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-5.x-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.x-47A248?style=flat&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.x-010101?style=flat&logo=socket.io&logoColor=white)](https://socket.io/)

[Live Demo](https://z-coder-tan.vercel.app/) · [Video Demo](https://drive.google.com/file/d/10rNcX1oot6aYd_PbwZib2L2BYr8D3DxZ/view?usp=sharing)

---

## What is this?

CodeHarbor is a place where you can solve coding problems, chat with others in real-time, get help from an AI assistant, and track your progress — all in the browser. Think of it as a lightweight LeetCode + collaborative coding space.

---

## Features

- 🔐 **Auth** — Register/login with JWT and bcrypt. Tokens expire after 24 hours.
- 💻 **Practice** — 600+ problems with an in-browser Monaco editor and live code execution via Piston.
- 🤝 **Collab Rooms** — Real-time shared editor and chat for pair programming.
- 🤖 **AI Assistant** — Groq-powered (Llama 3.3) chatbot for hints and coding help.
- 💬 **Discussions** — Share solutions, upvote/downvote, and learn from others.
- 👤 **Profiles** — Track your progress and showcase skills.
- 🔖 **Bookmarks** — Save problems for later.
- 📅 **Contest Calendar** — Never miss a coding contest.

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

Open [http://localhost:3000](http://localhost:3000) — you're good to go! 🎉

---

## Deploy for Free

You can run this entire stack without spending a dollar. Here's how:

### Frontend → Vercel

1. Push your code to GitHub.
2. Go to [vercel.com](https://vercel.com), sign in with GitHub.
3. Click **New Project → Import** your repo.
4. Set these values:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Environment Variables**: Add `REACT_APP_BACKEND_URL` pointing to your backend (see below).
5. Deploy. Vercel gives you a free `.vercel.app` URL.

### Backend → Render (or Railway)

1. Go to [render.com](https://render.com) and sign in with GitHub.
2. Click **New → Web Service**.
3. Connect your repo and configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`
   - **Environment Variables**:
     ```
     MONGODB_URI=your_mongodb_atlas_uri
     FRONTEND_URL=https://your-app.vercel.app
     JWT_SECRET=any_random_string
     GROQ_API_KEY=your_groq_key
     PORT=5000
     ```
4. Deploy. Render gives you a free URL like `your-app.onrender.com`.

> **Note:** Render's free tier spins down after inactivity, so the first request after idle takes ~30 seconds. [Railway](https://railway.app) is a similar alternative (free trial with $5 credit).

### Database → MongoDB Atlas

1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas/database) and create a free account.
2. Create a free **M0** cluster (512 MB, enough for a side project).
3. Under **Database Access**, create a user with a password.
4. Under **Network Access**, add `0.0.0.0/0` (allow from anywhere) or your server's IP.
5. Go to **Database → Connect → Drivers** and copy the connection string.
6. Paste it as `MONGODB_URI` in your backend's environment variables (replace `<password>` with your DB user's password).

### AI Features → Groq (free)

1. Sign up at [console.groq.com](https://console.groq.com).
2. Create an API key.
3. Add it as `GROQ_API_KEY` in your backend env vars.
4. Groq's free tier is generous — no credit card needed.

### Putting it all together

Once deployed, update your Vercel env var:

```
REACT_APP_BACKEND_URL=https://your-app.onrender.com
```

And your Render env var:

```
FRONTEND_URL=https://your-app.vercel.app
```

Redeploy both services, and you're live! 🚀

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

## License

[MIT](LICENSE)

---

<div align="center">

**Built with ❤️ by [Ekshith Sai Gunakar](https://github.com/Ekshithsai)**

</div>
