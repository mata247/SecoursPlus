const express = require("express");
const session = require("express-session");
const jwt = require("jsonwebtoken");
require("express-async-errors");
const bodyParser = require("body-parser");
const expressLayouts = require("express-ejs-layouts");
const cors = require("cors");
const errorHandler = require("./handlers/errorHandler");
const mongoose = require("mongoose");
const path = require("path");
const userRoutes = require("./modules/users/users.routes");
const transactionRoutes = require("./modules/transactions/transactions.routes");
const postRoutes = require("./modules/Posts/post.routes");

require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 8001;

mongoose
  .connect(process.env.mongo_connection, {})
  .then(() => {
    console.log("Mongo connection successful!");
  })
  .catch(() => {
    console.log("Mongo connection failed!");
  });

app.use(bodyParser.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(express.static(path.join(__dirname, "public")));
app.use(expressLayouts);

// Set the views directory
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Models initialization
require("./models/users.model");
require("./models/transactions.model");
require("./models/posts.model");

app.use(express.urlencoded({ extended: true }));

app.use("/api/users", userRoutes);
app.use("/api/transactions", transactionRoutes);

app.use("/api/Posts", postRoutes);

// Route to render the new post creation page
app.get("/new-post", (req, res) => {
  res.render("new-post");
});

// Define the route for the home page
app.get("/", async (req, res) => {
  try {
    const Post = mongoose.model("Post");
    const allPosts = await Post.find();
    res.render("home", { posts: allPosts });
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: "Error retrieving posts.",
    });
  }
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/contact", (req, res) => {
  res.render("contact");
});

app.get("/down", (req, res) => {
  res.render("down");
});

// Define the route for the welcome page
app.get("/new-members", (req, res) => {
  // Get the JWT token from the session or wherever it's stored
  const token = req.session.accessToken; // Replace with your token source

  // Verify and decode the JWT token
  jwt.verify(token, process.env.jwt_salt, (err, decoded) => {
    if (err) {
      // Handle token verification error (e.g., invalid token)
      console.error("Token verification error:", err);
      res.status(401).json({
        status: "failed",
        message: "Unauthorized!",
      });
      return;
    }

    // Extract user information from the decoded token
    const userName = decoded.name || '';

    // Render the "new-members.ejs" template with user's name
    res.render("new-members", { userName });
  });
});

// Define the route for the welcome page
app.get("/welcome", (req, res) => {
  // Get the JWT token from the session or wherever it's stored
  const token = req.session.accessToken; // Replace with your token source

  // Verify and decode the JWT token
  jwt.verify(token, process.env.jwt_salt, (err, decoded) => {
    if (err) {
      // Handle token verification error (e.g., invalid token)
      res.status(401).json({
        status: "failed",
        message: "Unauthorized!",
      });
      return;
    }

    // Extract user information from the decoded token
    const userName = decoded.name || '';
    const userEmail = decoded.email || '';

    // Render the "welcome.ejs" template with user's name and email
    res.render("welcome", { userName, userEmail });
  });
});

app.all("*", (req, res, next) => {
  res.status(404).json({
    status: "failed",
    message: "Not found!",
  });
});

app.use(errorHandler);

app.listen(port, () => console.log(`Listening to port ${port}`));
