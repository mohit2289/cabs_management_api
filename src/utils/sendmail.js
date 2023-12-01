const nodemailer = require("nodemailer");
const fs = require("fs");
const ejs = require("ejs");
const path = require("path");

const sendMailHelper = async (email, obj) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        service: 'gmail',
        port: 465,
        secure: true,
        requireTLS: true,
        auth: {
            user: "trilokitourtravels@gmail.com",
            pass: "jejakpwobgoxxjmr",
        },
    });
  
    const ejsfile = path.resolve(
      __dirname,
      "../",
      "templates",
      "bookinginvoice.ejs"
    );
    const template = fs.readFileSync(ejsfile, { encoding: "utf-8" });
    const compiled = ejs.compile(template, {
      compileDebug: true,
    });
    const data = obj;
    const html = compiled({
      data,
    });

   // console.log(html);

    const mailOptions = {
      from: "trilokitourtravels@gmail.com",
      to: email,
      cc: "trilokicabs@gmail.com",
      subject: "no-reply",
      html: html,
    };
    return transporter.sendMail(mailOptions);
  };


  module.exports = {
    sendMailHelper
  }