import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import RoomSelection from "./pages/RoomSelection";
import RoomPage from "./pages/RoomPage";
import AskAIPage from "./pages/AskAIPage";
import Calendar from "./pages/Calendar";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProblemDetail from "./pages/ProblemDetail";
import Discussions from "./pages/Discussion";
import SolutionDetail from "./pages/SolutionDetail";
import Header from "./components/Header";
import UserProfile from "./pages/UserProfile";
import FriendsProfile from "./pages/FriendsProfile";
import Bookmarks from "./pages/Bookmarks";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <div className="whole-container">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/user/:id" element={<ProtectedRoute><FriendsProfile /></ProtectedRoute>} />
          <Route path="/rooms" element={<ProtectedRoute><RoomSelection /></ProtectedRoute>} />
          <Route path="/rooms/:roomId" element={<ProtectedRoute><RoomPage /></ProtectedRoute>} />
          <Route path="/askAI" element={<ProtectedRoute><AskAIPage /></ProtectedRoute>} />
          <Route path="/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/problem/:titleSlug" element={<ProtectedRoute><ProblemDetail /></ProtectedRoute>} />
          <Route path="/discussions/:titleSlug" element={<ProtectedRoute><Discussions /></ProtectedRoute>} />
          <Route path="/solution/:id" element={<ProtectedRoute><SolutionDetail /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
          <Route path="/bookmarks" element={<ProtectedRoute><Bookmarks /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
