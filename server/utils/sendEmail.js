const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (to, subject, html) => {
  try {
    console.log("📧 Sending email...");
    console.log("To:", to);

    const { data, error } = await resend.emails.send({
      from: "Good Life Physiotherapy <onboarding@resend.dev>",
      to: [to],
      subject,
      html,
    });

    if (error) {
      console.error("❌ Resend Email Error:");
      console.error(error);
      return;
    }

    console.log("✅ Email Sent Successfully");
    console.log("Email ID:", data.id);
  } catch (err) {
    console.error("❌ Email Error:");
    console.error(err);
  }
};

module.exports = sendEmail;