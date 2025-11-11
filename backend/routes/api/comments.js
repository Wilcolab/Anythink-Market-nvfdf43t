/**
 * Express router providing comment-related API endpoints.
 *
 * Routes:
 *  - POST /        : Create a new comment
 *  - GET  /:postId : List comments for a given post
 *  - DELETE /:id   : Delete a comment by id
 *
 * Uses the mongoose Comment model (mongoose.model("Comment")).
 *
 * @module routes/api/comments
 */

/**
 * Create a new comment.
 *
 * Expects a JSON body with:
 *  - text {string}   : The comment text (required)
 *  - postId {string} : The associated post's ObjectId (required)
 *
 * Behavior:
 *  - Constructs a new Comment document and saves it to the database.
 *  - On success, responds with HTTP 201 and the saved comment JSON.
 *  - If validation or save fails, an error response (e.g., 400/500) may be returned by surrounding middleware/error handling.
 *
 * @name createComment
 * @route POST /
 * @async
 * @param {import("express").Request} req - Express request object. Body should contain { text, postId }.
 * @param {import("express").Response} res - Express response object.
 * @returns {Promise<void>} Sends HTTP 201 with the created comment JSON on success.
 */

/**
 * Get comments for a specific post.
 *
 * Path parameters:
 *  - postId {string} : The ObjectId of the post to query comments for.
 *
 * Behavior:
 *  - Finds all Comment documents with the provided postId.
 *  - Responds with HTTP 200 and an array of matching comments (may be empty).
 *  - If postId is malformed or a database error occurs, an error response (e.g., 400/500) may be returned by surrounding middleware/error handling.
 *
 * @name getCommentsByPost
 * @route GET /:postId
 * @async
 * @param {import("express").Request} req - Express request object. Params should include { postId }.
 * @param {import("express").Response} res - Express response object.
 * @returns {Promise<void>} Sends HTTP 200 with an array of comments.
 */

/**
 * Delete a comment by id.
 *
 * Path parameters:
 *  - id {string} : The ObjectId of the comment to delete.
 *
 * Behavior:
 *  - Validates that the provided id is a valid MongoDB ObjectId.
 *    - If invalid, responds with HTTP 400 and an error message.
 *  - Attempts to find and delete the Comment document by id.
 *    - If no document is found, responds with HTTP 404 and an error message.
 *    - If deletion succeeds, responds with HTTP 204 (No Content).
 *  - On unexpected errors, responds with HTTP 500 and an error message.
 *
 * @name deleteComment
 * @route DELETE /:id
 * @async
 * @param {import("express").Request} req - Express request object. Params should include { id }.
 * @param {import("express").Response} res - Express response object.
 * @returns {Promise<void>} Sends HTTP 204 on success, or 400/404/500 with a JSON error object.
 */
const router = require("express").Router();
const mongoose = require("mongoose");
const Comment = mongoose.model("Comment");

module.exports = router;

// Hey GitHub Copilot, can you help me add a new comment endpoint?
router.post("/", async (req, res) => {
  const { text, postId } = req.body;
  const comment = new Comment({ text, postId });
  await comment.save();
  res.status(201).json(comment);
});

router.get("/:postId", async (req, res) => {
  const { postId } = req.params;
  const comments = await Comment.find({ postId });
  res.status(200).json(comments);
});

router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid comment id" });
        }

        const deleted = await Comment.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ error: "Comment not found" });
        }

        return res.sendStatus(204);
    } catch (err) {
        return res.status(500).json({ error: err.message || "Internal server error" });
    }
});