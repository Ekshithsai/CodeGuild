require("dotenv").config();
const Groq = require("groq-sdk");
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

// Initialize OpenAI with your API key
const groq = process.env.GROQ_API_KEY
  ? new Groq({ apiKey: process.env.GROQ_API_KEY })
  : null;

async function getGroqChatCompletion(message, context = {}) {
  const contextText = [
    context.problemTitle && `Problem: ${context.problemTitle}`,
    context.problemDescription && `Problem description:\n${context.problemDescription}`,
    context.language && `Language: ${context.language}`,
    context.code && `Current code:\n${context.code}`,
    context.input && `User input:\n${context.input}`,
  ].filter(Boolean).join("\n\n");

  return groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: `You are CodeHarbor's coding mentor. Give clear, practical guidance. If the user asks for a hint, do not provide a complete solution.\n\n${contextText ? `${contextText}\n\n` : ""}User request: ${message}`,
      },
    ],
    model: "llama-3.3-70b-versatile",
  });
}

router.post("/ask-ai", auth, async (req, res) => {
  try {
    if (!groq) {
      return res.status(503).json({ error: "AI service is not configured" });
    }
    const { message, context } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ error: "A message is required" });
    }
    const chatCompletion = await getGroqChatCompletion(message, context);
    let ans = chatCompletion.choices[0]?.message?.content || "";
    res.json({
      answer: ans,
    });
  } catch (error) {
    console.error("AI API error:", error);
    res.status(500).json({ error: "Failed to get AI response" });
  }
});

module.exports = router;
