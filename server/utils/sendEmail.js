const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,

  // Force IPv4
  family: 4,

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (to, subject, html) => {
  try {
    console.log("📧 Sending email...");
    console.log("To:", to);
    console.log("From:", process.env.EMAIL_USER);
    console.log("SMTP: smtp.gmail.com:587 IPv4");

    const info = await transporter.sendMail({
      from: `"Good Life Physiotherapy" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("✅ Email Sent Successfully");
    console.log(info.response);
  } catch (err) {
    console.error("❌ Email Error");
    console.error(err);
  }
};

module.exports = sendEmail;