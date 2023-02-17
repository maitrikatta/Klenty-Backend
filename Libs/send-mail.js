const nodemailer = require("nodemailer");
async function sendMail(eventResult, templateResult) {
  const { recipientEmail } = eventResult;
  const { title, detail, wishType } = templateResult;
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_ACCOUNT,
      pass: process.env.EMAIL_PASS,
    },
  });

  const body = `
  <h3>${title}</h3>
  <p>${detail} </p>
  `;

  const mailOptions = {
    from: "yktherock99@gmail.com",
    to: "ykakde3@gmail.com",
    subject: wishType,
    html: body,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      return 0;
    } else {
      return 1;
    }
  });
}

module.exports = sendMail;
