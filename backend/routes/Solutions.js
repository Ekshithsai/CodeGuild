const express = require("express");
const router = express.Router();
const Solution = require("../models/Solution");
const auth = require("../middleware/auth");

// Submit a solution
router.post("/submit", auth, async (req, res) => {
  try {
    const { problemSlug, code, language } = req.body;

    const solution = new Solution({
      problemSlug,
      code,
      language,
      author: req.user.user_id,
    });

    await solution.save();

    res.json({
      success: true,
      message: "Solution submitted successfully!",
      passed: true, // In real app, this would depend on test results
      details: "All test cases passed", // Would show actual test results
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const solution = await Solution.findById(req.params.id);

    // Check if solution exists and user is the author
    if (!solution) {
      return res.status(404).json({ error: "Solution not found" });
    }
    if (solution.author.toString() !== req.user.user_id) {
      return res
        .status(403)
        .json({ error: "Unauthorized to delete this solution" });
    }

    await Solution.deleteOne({ _id: req.params.id });
    res.json({ success: true, message: "Solution deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

// Get all solutions for a problem
router.get("/:problemSlug", async (req, res) => {
  try {
    const solutions = await Solution.find({
      problemSlug: req.params.problemSlug,
    })
      .populate("author", "Username _id")
      .sort({ createdAt: -1 });

    res.json(solutions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get solution detail
router.get("/detail/:id", async (req, res) => {
  try {
    const solution = await Solution.findById(req.params.id).populate(
      "author",
      "Username _id"
    );
    res.json(solution);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Handle voting (authenticated, no duplicate votes)
router.post("/vote", auth, async (req, res) => {
  try {
    const { solutionId, voteType } = req.body;
    const userId = req.user.user_id;
    const solution = await Solution.findById(solutionId);

    if (!solution) {
      return res.status(404).json({ error: "Solution not found" });
    }

    // Prevent voting on own solution
    if (solution.author.toString() === userId) {
      return res.status(400).json({ error: "Cannot vote on your own solution" });
    }

    const hasUpvoted = solution.upvotedBy.includes(userId);
    const hasDownvoted = solution.downvotedBy.includes(userId);

    if (voteType === "upvote") {
      if (hasUpvoted) {
        // Remove upvote (toggle off)
        solution.upvotedBy.pull(userId);
        solution.votes -= 1;
      } else {
        // Add upvote, remove downvote if exists
        if (hasDownvoted) {
          solution.downvotedBy.pull(userId);
          solution.votes += 1;
        }
        solution.upvotedBy.addToSet(userId);
        solution.votes += 1;
      }
    } else if (voteType === "downvote") {
      if (hasDownvoted) {
        // Remove downvote (toggle off)
        solution.downvotedBy.pull(userId);
        solution.votes += 1;
      } else {
        // Add downvote, remove upvote if exists
        if (hasUpvoted) {
          solution.upvotedBy.pull(userId);
          solution.votes -= 1;
        }
        solution.downvotedBy.addToSet(userId);
        solution.votes -= 1;
      }
    } else {
      return res.status(400).json({ error: "Invalid vote type" });
    }

    await solution.save();
    res.json({ success: true, votes: solution.votes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
