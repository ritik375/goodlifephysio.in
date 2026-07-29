const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
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

    const info = await transporter.sendMail({
      from: `"MotionWell Physiotherapy" <${process.env.EMAIL_USER}>`,
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