import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, text }: any) => {
  const transporter = nodemailer.createTransport({
    service: "gmail", // Use your email provider
    auth: {
      user: process.env.EMAIL_USER, // Set this in .env
      pass: process.env.EMAIL_PASS, // Set this in .env
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  });
};
