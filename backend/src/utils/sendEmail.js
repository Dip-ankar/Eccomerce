import nodemailer from "nodemailer";

export const sendEmail = async (options) => {
  // 1️⃣ Create a transporter (use your mail service or Gmail)
  const transporter = nodemailer.createTransport({
    service: 'gmail', // optional if using Gmail
    auth: {
      user: process.env.SMTP_MAIL,    // your email
      pass: process.env.SMTP_PASSWORD,// your app password
    },
  });

  // 2️⃣ Email options
  const mailOptions = {
    from: process.env.SMTP_MAIL,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // 3️⃣ Send email
  await transporter.sendMail(mailOptions);
};
