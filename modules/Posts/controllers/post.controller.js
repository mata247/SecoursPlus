const mongoose = require("mongoose");
const Post = require("../../../models/posts.model");
const auth = require("../../../middleware/auth");

const bcrypt = require("bcrypt");
const jwtManager = require("../../../managers/jwtManager");
const emailManager = require("../../../managers/emailManager");
// const errorHandler = require("../../../handlers/errorHandler");

const createPost = async (req, res) => {
  const { title, content } = req.body;
  const userId = req.user._id; // Assuming you have user data in req.user from the auth middleware

  // Validation...
  if (!title) throw "Title must be provided!";
  if (!content) throw "Content must be provided!";

  const newPost = new Post({
    title,
    content,
    user: userId,
  });

  try {
    const savedPost = await newPost.save();
    res.redirect("/home"); // Redirect to the posts page
  } catch (error) {
    res.status(400).json({
      status: "failed",
      message: error.message,
    });
  }
};

const editPost = async (req, res) => {
  const postId = req.params.postId;
  const userId = req.user._id;

  // Validation and permission checks...

  try {
    const updatedPost = await Post.findOneAndUpdate(
      { _id: postId, user: userId },
      { $set: req.body },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({
        status: "failed",
        message: "Post not found or permission denied.",
      });
    }

    res.json({
      status: "Post updated successfully!",
      post: updatedPost,
    });
  } catch (error) {
    res.status(400).json({
      status: "failed",
      message: error.message,
    });
  }
};

const displayAllPosts = async (req, res) => {
  try {
    const allPosts = await Post.find();
    // console.log("retrived posts:");
    res.render("home", { posts: allPosts });
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: "Error retrieving posts.",
    });
  }
};

const deletePost = async (req, res) => {
  const postId = req.params.postId;
  const userId = req.user._id;

  // Validation and permission checks...

  try {
    const deletedPost = await Post.findOneAndDelete({
      _id: postId,
      user: userId,
    });

    if (!deletedPost) {
      return res.status(404).json({
        status: "failed",
        message: "Post not found or permission denied.",
      });
    }

    res.json({
      status: "Post deleted successfully!",
      post: deletedPost,
    });
  } catch (error) {
    res.status(400).json({
      status: "failed",
      message: error.message,
    });
  }
};

module.exports = {
  createPost,
  editPost,
  displayAllPosts,
  deletePost,
};
