const express = require("express");
const auth = require("../../middleware/auth");
const postController = require("../Posts/controllers/post.controller");

const postRoutes = express.Router();

// Display new post creation page

postRoutes.get("/new-post", (req, res) => {
  res.render("new-post"); // Assuming you have the "new-post.ejs" view
});

// Display all posts from the database
postRoutes.get("/", postController.displayAllPosts);

postRoutes.use(auth);

// Create a new post
postRoutes.post("/new-post", postController.createPost);

// Edit a post
postRoutes.put("/:postId", postController.editPost);

// Delete a post
postRoutes.delete("/:postId", postController.deletePost);

module.exports = postRoutes;
