import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

const email = process.env.USER_EMAIL;
const pass = process.env.USER_PASS;

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: email,
    pass,
  },
} as SMTPTransport.Options);

export const mailOptions = {
  from: email
};
