import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,  // True for port 465 (SSL), false for port 587 (TLS)
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

export const sendBookingConfirmationEmail = async (toEmail, bookingDetails) => {
  const mailOptions = {
    from: `"Car Rental" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Booking Confirmed!",
    html: `...your email template...`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent to:", toEmail);
  } catch (error) {
    console.error("Email error:", error);
    throw error;
  }
};
