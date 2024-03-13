// const mongoose = require("mongoose");
// const bcrypt = require("bcrypt");
// const jsonwebtoken = require("jsonwebtoken");
// const jwtManager = require("../../../managers/jwtManager");

// const login = async (req, res) => {
//   const usersModel = mongoose.model("users");

//   const { email, password } = req.body;

//   const getUser = await usersModel.findOne({
//     email: email,
//   });

//   if (!getUser) throw "This email doesnot exist in the system!";

//   const comparePassword = await bcrypt.compare(password, getUser.password);

//   if (!comparePassword) throw "Email and password do not match!";

//   const accessToken = jwtManager(getUser);

//   // success response
//   res.status(200).json({
//     status: "success",
//     message: "User logged in successfully!",
//     accessToken: accessToken,
//   });
// };

// module.exports = login;


const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const jwtManager = require("../../../managers/jwtManager");

const login = async (req, res) => {
  const usersModel = mongoose.model("users");

  const { email, password } = req.body;

  console.log("Received login request for email:", email); // Debugging

  const getUser = await usersModel.findOne({
    email: email,
  });

  console.log("User retrieved from the database:", getUser); // Debugging

  if (!getUser) {
    req.session.message = "This email does not exist in the system!";
    return res.redirect("/login"); // Redirect to the login page
  }

  const comparePassword = await bcrypt.compare(password, getUser.password);

  console.log("Password comparison result:", comparePassword); // Debugging

  if (!comparePassword) {
    req.session.message = "Email and password do not match!";
    return res.redirect("/login"); // Redirect to the login page
  }

  const accessToken = jwtManager(getUser);

  console.log("Generated access token:", accessToken); // Debugging

  // Store the status message in the session
  req.session.message = "User logged in successfully!";
  req.session.accessToken = accessToken;

  console.log("Session data stored:", req.session); // Debugging

  // Redirect to the welcome page after successful login
  res.redirect("/welcome");
};

module.exports = login;



