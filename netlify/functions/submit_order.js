const nodemailer = require("nodemailer");

const {
  SMTP_HOST_EMAIL,
  SMTP_PASS
} = process.env;

exports.handler = function (event, context) {

  // get the event body
  const request = JSON.parse(event.body);

  let sendSuccessfull = true;
  let transporter = nodemailer.createTransport({
    host: "smtp.hostinger.com",
    port: 465,
    secure: true,
    auth: {
      user: SMTP_HOST_EMAIL,
      pass: SMTP_PASS
    }
  });

  transporter.sendMail({
    from: SMTP_HOST_EMAIL,
    to: "devins.d@protonmail.com",
    subject: `FREELANCE: Order Form Submission`,
    html: `
    <h1>New Order Form Submission</h1>
    <h2>You recieved a message from: ${request.firstName} ${request.lastName}</h2>
    <div> 
      <h3>Email: ${request.email}</h3>
      <p>Contact Form: ${request.hasContactForm}</p>
      <p>SEO: ${request.hasSEO}</p>
      <p>CMS: ${request.hasCMS}</p>
      <h4>Notes:</h4>
      <p>${request.notes}</p>
    </div>
    `,
  }).catch(() => sendSuccessfull = false);

  transporter.sendMail({
    from: SMTP_HOST_EMAIL,
    to: request.email,
    subject: `Thank You - DevDeveloper`,
    html: `
    <h1>Your Order Summary</h1>
    <p>
    Thank you for taking the time to submit an order. 
    I will be in touch with you shortly to get into the details!
    </p>
    <div> 
      <h2>Email: ${request.email}</h2>
      <p>Contact Form: ${request.hasContactForm}</p>
      <p>SEO: ${request.hasSEO}</p>
      <p>CMS: ${request.hasCMS}</p>
      <h3>Notes:</h3>
      <p>${request.notes}</p>
    </div>
    `
  }).catch(() => sendSuccessfull = false);

  if (sendSuccessfull) {
    return {
      statusCode: 200,
    }
  } else {
    return {
      statusCode: 500,
    }
  }

}