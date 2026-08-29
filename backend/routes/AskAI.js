require("dotenv").config();
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_BASE = "https://api.groq.com/openai/v1/chat/completions";

// Models to try in order (free-tier-friendly)
const MODELS = [
  "llama-3.3-70b-versatile",
  "llama-3.1-8b-instant",
  "mixtral-8x7b-32768",
  "gemma2-9b-it",
];

async function askGroq(message, context = {}) {
  if (!GROQ_API_KEY) {
    throw new Error("NO_API_KEY");
  }

  const contextText = [
    context.problemTitle && `Problem: ${context.problemTitle}`,
    context.problemDescription && `Problem description:\n${context.problemDescription}`,
    context.language && `Language: ${context.language}`,
    context.code && `Current code:\n${context.code}`,
    context.input && `User input:\n${context.input}`,
  ]
    .filter(Boolean)
    .join("\n\n");

  const systemPrompt =
    "You are Code Guild's coding mentor. Give clear, practical guidance. If the user asks for a hint, do not provide a complete solution. Format your response in markdown.";
  const userContent = `${
    contextText ? contextText + "\n\n" : ""
  }User request: ${message}`;

  // Try each model until one works
  for (const model of MODELS) {
    try {
      console.log(`Trying Groq model: ${model}`);
      const response = await fetch(GROQ_BASE, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userContent },
          ],
          temperature: 0.7,
          max_tokens: 2048,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const answer = data.choices?.[0]?.message?.content;
        if (answer) {
          console.log(`Success with model: ${model}`);
          return answer;
        }
      } else {
        const errBody = await response.text();
        console.warn(`Model ${model} failed (${response.status}): ${errBody.slice(0, 200)}`);

        // If it's an auth error, don't try other models
        if (response.status === 401) {
          throw new Error("INVALID_API_KEY");
        }
        // Continue to next model for 404, 429, etc.
      }
    } catch (err) {
      if (err.message === "INVALID_API_KEY") throw err;
      console.warn(`Model ${model} error: ${err.message}`);
    }
  }

  throw new Error("ALL_MODELS_FAILED");
}

router.post("/ask-ai", auth, async (req, res) => {
  try {
    if (!GROQ_API_KEY) {
      return res.status(503).json({
        error:
          "AI not configured. Add GROQ_API_KEY to backend/.env\n\nGet a free key at https://console.groq.com",
      });
    }

    const { message, context } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ error: "A message is required" });
    }

    const answer = await askGroq(message, context || {});
    res.json({ answer });
  } catch (error) {
    console.error("AI error:", error.message);

    if (error.message === "NO_API_KEY") {
      return res.status(503).json({
        error:
          "AI not configured. Add GROQ_API_KEY to backend/.env\n\nGet a free key at https://console.groq.com",
      });
    }
    if (error.message === "INVALID_API_KEY") {
      return res.status(503).json({
        error:
          "Invalid Groq API key. Delete the old key and create a new one at https://console.groq.com/api-keys",
      });
    }
    if (error.message === "ALL_MODELS_FAILED") {
      return res.status(503).json({
        error:
          "All AI models are currently unavailable. Your API key may not have access to any models.\n\nTry: https://console.groq.com → Create a new API key",
      });
    }

    res.status(500).json({
      error: `AI request failed: ${error.message}`,
    });
  }
});

module.exports = router;
