const nodemailer = require("nodemailer");

const emailManager = async (to, text, html, subject) => {
  var transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "c0ec228be36cd1",
      pass: "f9245aa898a1ca",
    },
  });

  await transport.sendMail({
    to: to,
    from: "info@SP-ONG.com",
    text: text,
    html: html,
    subject: subject,
  });
};

module.exports = emailManager;
