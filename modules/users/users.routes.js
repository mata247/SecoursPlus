// const express = require("express");
// const register = require("./controllers/register");
// const login = require("./controllers/login");
// const userDashboard = require("./controllers/userDashboard");
// const auth = require("../../middleware/auth");
// const forgotPassword = require("./controllers/forgotPassword");
// const resetPassword = require("./controllers/resetPassword");

// const userRoutes = express.Router();

// userRoutes.get("/register", (req, res) => {
//   res.render("register"); // Assuming you have the "register.ejs" view
// });

// userRoutes.get("/login", (req, res) => {
//   res.render("login"); // Assuming you have the "login.ejs" view
// });

// // Routes...

// userRoutes.post("/register", register);
// userRoutes.post("/login", login);

// userRoutes.post("/forgotpw", forgotPassword);
// userRoutes.post("/resetpw", resetPassword);

// userRoutes.use(auth);

// // Protected routes...

// userRoutes.get("/dashboard", userDashboard);

// module.exports = userRoutes;

const mongoose = require("mongoose"); // Import mongoose
const express = require("express");
const bcrypt = require("bcrypt");
const jwtManager = require("../../managers/jwtManager");// Import the jsonwebtoken library
const register = require("./controllers/register");
const login = require("./controllers/login");
const userDashboard = require("./controllers/userDashboard");
const auth = require("../../middleware/auth");
const forgotPassword = require("./controllers/forgotPassword");
const resetPassword = require("./controllers/resetPassword");

const userRoutes = express.Router();

userRoutes.get("/register", (req, res) => {
  res.render("register"); // Assuming you have the "register.ejs" view
});

userRoutes.get("/login", (req, res) => {
  res.render("login"); // Assuming you have the "login.ejs" view
});

// Routes...

userRoutes.post("/register", async (req, res) => {
  try {
    const usersModel = mongoose.model("users");
    const { email, password, confirm_password, name, balance } = req.body;

    // validations...

    if (!email) throw "Email must be provided!";
    if (!password) throw "Password must be provided!";
    if (password.length < 5) throw "Password must be at least 5 characters long.";

    if (!name) throw "Name is required";
    if (password !== confirm_password) throw "Password and confirmed password do not match!";

    const getDuplicateEmail = await usersModel.findOne({ email: email });

    if (getDuplicateEmail) throw "This email already exists!";

    const hashedPassword = await bcrypt.hash(password, 12);

    // Create the user
    const createdUser = await usersModel.create({
      name: name,
      email: email,
      password: hashedPassword,
      balance: balance,
    });

    // Generate the JWT token for the user
    const payload = {
      name: createdUser.name,
      email: createdUser.email,
      // Other payload data if needed
    };

    const accessToken = jwtManager(payload);

    // Store the token in the session
    req.session.accessToken = accessToken;

    // Redirect to the new-members page upon successful registration
    res.redirect("/new-members");
  } catch (error) {
    // Handle registration error (e.g., validation or database error)
    console.error("Registration error:", error); // Log the error for debugging
    res.redirect("/register"); // Redirect back to the registration page with an error message
  }
});


userRoutes.post("/login", (req, res, next) => {
  // Custom middleware to handle successful login redirection
  login(req, res, (err) => {
    if (err) {
      // Handle login error (e.g., invalid credentials)
      res.redirect("/login"); // Redirect back to the login page with an error message
    } else {
      // Redirect to the welcome page upon successful login
      res.redirect("/welcome");
    }
  });
});

userRoutes.post("/forgotpw", forgotPassword);
userRoutes.post("/resetpw", resetPassword);

userRoutes.use(auth);

// Protected routes...

userRoutes.get("/dashboard", userDashboard);

module.exports = userRoutes;
