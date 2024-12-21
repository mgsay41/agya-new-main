import nodemailer from "nodemailer";
import Mailgen from "mailgen";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "shopa.store.q@gmail.com",
    pass: "vihgzgsjacevouee",
  },
});

const MailGenerator = new Mailgen({
  theme: "default",
  product: {
    name: "Egya",
    link: "https://mailgen.js/",
  },
});

export const sendMail = async (userEmail, text, subjectText) => {
  const mail = {
    body: {
      intro:
        text ||
        "Welcome to Daily Tuition! We're very excited to have you on board.",
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
  const emailBody = MailGenerator.generate(mail);
  const message = {
    from: process.env.AUTH_EMAIL,
    to: userEmail,
    subject: subjectText,
    html: emailBody,
  };
  // send mail
  transporter.sendMail(message)
  .then(() =>{
  });
};
