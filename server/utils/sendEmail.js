const nodemailer = require('nodemailer');
const logger = require('./logger');

const sendEmail = async (options) => {
  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    // Define email options
    const mailOptions = {
      from: `${process.env.EMAIL_FROM || 'CPMS'} <${process.env.EMAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      html: options.message
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    
    logger.info(`Email sent: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    logger.error('Email send error:', error);
    return { success: false, error: error.message };
  }
};

module.exports = sendEmail;
