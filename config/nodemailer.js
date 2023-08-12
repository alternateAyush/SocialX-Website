const path = require("path");
const nodemailer = require("nodemailer");
const ejs = require("ejs");
require("dotenv").congif();
process.env;

let transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "ayushbhatt2002@gmail.com",
    pass: `${process.env.MAILER_MAIL_PASSWORD}`,
  },
});

let renderTemplate = function (data, relativePath) {
  let mailHTML;
  ejs.renderFile(
    path.join(__dirname, "../views/mailers", relativePath),
    data,
    function (err, template) {
      if (err) {
        console.log("error in sending mail ", err);
        return;
      }
      mailHTML = template;
    }
  );
  return mailHTML;
};

module.exports = {
  transporter: transporter,
  renderTemplate: renderTemplate,
};
