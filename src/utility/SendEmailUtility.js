const nodemailer = require("nodemailer");

const SendEmailUtility = async (EmailTo, EmailText, EmailSubject) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
      secure: false,
    port: 587, // port for secure SMTP
    auth: {
      user: "info.parvezservice@gmail.com",
      pass: "pyfr hyao yejh zgzt",
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const mailOptions = {
    from: '"Task Manager" <info.parvezservice@gmail.com>', // sender address
    to: EmailTo,
    subject: EmailSubject, // Subject line
    text: EmailText, // plain text body
  };
  return await transporter.sendMail(mailOptions);
};

module.exports = SendEmailUtility;
