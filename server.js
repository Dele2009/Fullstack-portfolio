const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;

// Middleware to parse JSON and URL-encoded bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content, Content-Type, Authorization'
    )
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, PATCH, OPTIONS'
    )
    next()
  })

// POST endpoint for contact form submissions
app.post('/contact', (req, res) => {
  // Extract form data from the request body
  const {
    user_firstname,
    user_lastname,
    user_email,
    user_state,
    user_city,
    user_zipcode,
    user_message
  } = req.body

  // Create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user:  process.env.EMAIL_USERNAME,
      pass: process.env.SECRET_KEY
    }
  })

  // Setup email data
  let mailOptions = {
    from: user_email,
    to: 'obedaminu303@gmail.com', // Receiver's email address
    subject: 'Portfolio Contact Form Submission',
    html: `
            <p>Name: ${user_firstname} ${user_lastname}</p>
            <p>Email: ${user_email}</p>
            <p>State: ${user_state}</p>
            <p>City: ${user_city}</p>
            <p>Zip Code: ${user_zipcode}</p>
            <p>Message: ${user_message}</p>
        `
  }

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      res.status(500).send('Error sending email');
    } else {
      console.log('Email sent:', info.response);
      res.status(200).send('Email sent successfully');
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
