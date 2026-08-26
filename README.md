<div align="center">

# ⚡ CodeHarbor

### An interactive coding community platform to practice, collaborate, and level up your skills.

[![React](https://img.shields.io/badge/React-19.1-61DAFB?style=flat&logo=react&logoColor=white)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-5.x-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.x-47A248?style=flat&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.x-010101?style=flat&logo=socket.io&logoColor=white)](https://socket.io/)

[Live Demo](https://z-coder-tan.vercel.app/) · [Video Demo](https://drive.google.com/file/d/10rNcX1oot6aYd_PbwZib2L2BYr8D3DxZ/view?usp=sharing)

</div>

---

## 🚀 Features

| Feature | Description |
|---------|-------------|
| 🔐 **Authentication** | Secure register/login with bcrypt password hashing and JWT tokens (24h expiry) |
| 💻 **Practice Problems** | 600+ LeetCode problems with in-browser code editor and live execution |
| 🤝 **Collaborative Rooms** | Real-time shared code editor and chat for pair programming |
| 🤖 **AI Assistant** | GroqAI-powered chatbot that helps with coding doubts and problem hints |
| 💬 **Discussions** | Community-driven solution sharing with upvote/downvote system |
| 👤 **Profiles** | Track progress, showcase skills, and view friends' profiles |
| 🔖 **Bookmarks** | Save and filter important problems for quick access |
| 📅 **Contest Calendar** | Never miss coding competitions across platforms |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, React Router, Monaco Editor, Socket.IO Client |
| **Backend** | Node.js, Express 5, Socket.IO |
| **Database** | MongoDB with Mongoose |
| **Auth** | JWT, bcrypt |
| **AI** | Groq API (Llama 3.3) |
| **Code Execution** | Piston API |

---

## 🏗️ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/) (local or Atlas)
- A [Groq API key](https://console.groq.com/keys) (for AI features)

### Clone the repo

```bash
git clone https://github.com/Ekshithsai/ZCoder.git
cd ZCoder
```

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:

```env
MONGODB_URI=mongodb://localhost:27017/codeharbor
GROQ_API_KEY=your_groq_api_key
JWT_SECRET=your_strong_random_secret
PORT=5000
```

Start the server:
```bash
npm run dev
```

### Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` folder:

```env
REACT_APP_BACKEND_URL=http://localhost:5000
REACT_APP_JUDGE=https://emkc.org/api/v2/piston/execute
```

Start the app:
```bash
npm start
```

Visit **http://localhost:3000** 🎉

---

## 📁 Project Structure

```
ZCoder/
├── backend/
│   ├── config/          # Database connection
│   ├── middleware/       # Auth middleware
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API endpoints
│   ├── index.js         # Server entry point
│   └── socketHandler.js # Real-time socket events
└── frontend/
    └── src/
        ├── assets/      # Logos and images
        ├── components/  # Reusable UI components
        ├── pages/       # Route-level components
        └── styles/      # CSS stylesheets
```

---

## 🔒 Security

- JWT tokens with **24-hour expiration**
- Passwords hashed with **bcrypt**
- **CORS** restricted to frontend origin
- **Input sanitization** against NoSQL injection (regex escaping)
- **XSS protection** via DOMPurify on user-rendered HTML
- **Authenticated voting** with duplicate-vote prevention

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

**Built with ❤️ by [Ekshith Sai Gunakar](https://github.com/Ekshithsai)**

</div>
