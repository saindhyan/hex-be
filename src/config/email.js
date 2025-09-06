const nodemailer = require('nodemailer');

// SMTP configuration
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

// Email configuration
const emailConfig = {
  from: {
    name: process.env.FROM_NAME || 'HexSyn DataLabs Team',
    address: process.env.FROM_EMAIL || process.env.SMTP_USER
  },
  replyTo: process.env.REPLY_TO_EMAIL || process.env.SMTP_USER
};

module.exports = {
  createTransporter,
  emailConfig
};
