const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwtManager = require("../../../managers/jwtManager");
const emailManager = require("../../../managers/emailManager");

const register = async (req, res) => {
  const usersModel = mongoose.model("users");

  const { email, password, confirm_password, name, balance } = req.body;

  // validations...

  if (!email) throw "Email must be provided!";
  if (!password) throw "Password must be provided!";
  if (password.length < 5) throw "Password must be at least 5 characters long.";

  if (!name) throw "Name is required";
  if (password !== confirm_password)
    throw "Password and confirmed password do not match!";

  const getDuplicateEmail = await usersModel.findOne({
    email: email,
  });

  if (getDuplicateEmail) throw "This email already exists!";

  const hashedPassword = await bcrypt.hash(password, 12);

  const createdUser = await usersModel.create({
    name: name,
    email: email,
    password: hashedPassword,
    balance: balance,
  });

  // Send the email before responding
  await emailManager(
    createdUser.email,
    "Bienvenue sur  S-DigiCongo. Nous sommes ravis de vous accueillir au sein de la communauté de S-DigiCongo ! Votre décision de nous rejoindre marque le début d'un voyage passionnant vers la transformation numérique et des expériences améliorées. Chez S-DigiCongo, nous sommes dévoués à vous aider à exploiter tout le potentiel des outils et des solutions numériques, vous permettant de prospérer dans le paysage technologique effréné d'aujourd'hui. Nous vous remercions d'avoir choisi S-DigiCongo comme partenaire dans la révolution numérique. Nous sommes impatients d'assister aux transformations incroyables que vous réaliserez. En route vers un avenir d'innovation et de succès ! Cordialement, Administrateur S-DigiCongo Consultant en Transformation Numérique S-DigiCongo info@sdigicongo.com",

    "<h1>Bienvenue sur  S-DigiCongo.</h1> <br/><br/> Nous sommes ravis de vous accueillir au sein de la communauté de S-DigiCongo !. <br/> <br/> Votre décision de nous rejoindre marque le début d'un voyage passionnant vers la transformation numérique et des expériences améliorées.<br/> <br/> Chez S-DigiCongo, nous sommes dévoués à vous aider à exploiter tout le potentiel des outils et des solutions numériques, vous permettant de prospérer dans le paysage technologique effréné d'aujourd'hui. <br/> <br/> Nous vous remercions d'avoir choisi S-DigiCongo comme partenaire dans la révolution numérique. <br/> <br/> Nous sommes impatients d'assister aux transformations incroyables que vous réaliserez. <br/> <br/> En route vers un avenir d'innovation et de succès ! <br/> <br/>  Cordialement, <br/> <br/> Administrateur S-DigiCongo  <br/> <br/> Consultant en Transformation Numérique <br/> <br/> S-DigiCongo <br/> <br/> info@sdigicongo.com",
    "Bienvenue sur  S-DigiCongo -  Votre voyage vers la  transformation numérique commence!"
  );

  const accessToken = jwtManager(createdUser);

  // Respond with JSON
  res.status(201).json({
    status: "User registered successfully!",
    accessToken: accessToken,
  });

  // Redirect after email is sent
  res.redirect("/new-members");
};

 

module.exports = register;


// const mongoose = require("mongoose");
// const bcrypt = require("bcrypt");
// const jwtManager = require("../../../managers/jwtManager");
// const emailManager = require("../../../managers/emailManager");

// const register = async (req, res) => {
//   const usersModel = mongoose.model("users");

//   const { email, password, confirm_password, name, balance } = req.body;

//   // Validations...

//   if (!email) throw "Email must be provided!";
//   if (!password) throw "Password must be provided!";
//   if (password.length < 5) throw "Password must be at least 5 characters long.";

//   if (!name) throw "Name is required";
//   if (password !== confirm_password)
//     throw "Password and confirmed password do not match!";

//   const getDuplicateEmail = await usersModel.findOne({
//     email: email,
//   });

//   if (getDuplicateEmail) throw "This email already exists!";

//   const hashedPassword = await bcrypt.hash(password, 12);

//   const createdUser = await usersModel.create({
//     name: name,
//     email: email,
//     password: hashedPassword,
//     balance: balance,
//   });

//   const accessToken = jwtManager(createdUser);

//   await emailManager(
//     createdUser.email,
//     // Your email content here...
//   );

//   // Redirect to the new-members page upon successful registration
//   res.redirect("/new-members");
// };

// module.exports = register;

