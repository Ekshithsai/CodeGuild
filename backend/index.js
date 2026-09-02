// server.js
require("dotenv").config();
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const connectDB = require("./config/db");
const aiRoute = require("./routes/AskAI.js");
const loginRoute = require("./routes/LoginRoute.js");
const solutionsRoute = require("./routes/Solutions.js");
const profileRoute = require("./routes/Profile.js");
const socketHandler = require("./socketHandler");
const bookmarksRoute = require("./routes/Bookmarks.js");
const executeRoute = require("./routes/Execute.js");
const User = require("./models/UserModel.js");

// Helper: escape special regex characters to prevent injection
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
// Connect to MongoDB
connectDB();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  },
});

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Headers", "Authorization, Content-Type");
  next();
});
app.use(express.json());

// routes
app.use("/api", aiRoute);
app.use("/", loginRoute);
app.use("/api/solutions", solutionsRoute);
app.use("/user", profileRoute);
app.use("/bookmarks", bookmarksRoute);
app.use("/api", executeRoute);
app.get("/users/:username", async (req, res) => {
  const { username } = req.params;
  if (!username || username.trim() === "") {
    return res.status(400).send([]);
  }
  try {
    const escapedUsername = escapeRegExp(username.trim());
    const usersList = await User.find({
      Username: { $regex: `^${escapedUsername}`, $options: "i" },
    }).select("_id Username");

    if (usersList && usersList.length > 0) {
      // Map to return array of objects with id and username
      const result = usersList.map((user) => ({
        id: user._id,
        username: user.Username,
      }));
      res.status(200).send(result);
    } else {
      res.status(404).send("No users found!");
    }
  } catch (err) {
    res.status(500).send("Server error");
  }
});
app.get("/ping", (req, res) => {
  res.json({ msg: "API is working !!" });
});

socketHandler(io);

app.get("/", (req, res) => {
  res.json({
    name: "Code Guild API",
    status: "running",
    frontend: process.env.FRONTEND_URL || "http://localhost:3000",
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
