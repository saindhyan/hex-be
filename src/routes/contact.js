const express = require('express');
const rateLimit = require('express-rate-limit');
const emailService = require('../services/emailService');
const googleSheetsService = require('../services/googleSheetsService');
const { validateContact } = require('../middleware/validation');

const router = express.Router();

// Rate limiting for contact endpoint
const contactRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 contact requests per windowMs
  message: {
    error: 'Too many contact requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  }
});

// Submit contact form endpoint
router.post('/', contactRateLimit, validateContact, async (req, res) => {
  try {
    const contactData = {
      ...req.validatedData,
      submittedAt: new Date().toISOString()
    };

    console.log('📝 Processing contact form submission:', {
      name: `${contactData.firstName} ${contactData.lastName}`,
      email: contactData.email,
      subject: contactData.subject,
      inquiryType: contactData.inquiryType,
      timestamp: contactData.submittedAt
    });
    
    console.log('🔧 Environment check:', {
      nodeEnv: process.env.NODE_ENV,
      isVercel: !!process.env.VERCEL,
      adminEmail: process.env.ADMIN_EMAIL ? '✓ Set' : '✗ Missing'
    });
    
    // Log to Google Sheets (async, non-blocking)
    googleSheetsService.logContact(contactData).catch(error => {
      console.error('Google Sheets logging failed:', error);
    });
    
    // Send emails synchronously for debugging
    console.log('🚀 Sending emails synchronously for debugging...');
    const emailResults = await emailService.sendContactEmails(contactData);
    console.log('📧 Email sending results:', emailResults);
    
    const hasErrors = emailResults.errors.length > 0;
    const allSuccess = emailResults.adminNotification && emailResults.userConfirmation;
    
    res.status(hasErrors && !allSuccess ? 500 : 200).json({
      message: allSuccess ? 'Contact form submitted and emails sent successfully!' : 
               hasErrors ? 'Contact form submitted but some emails failed' : 
               'Contact form submitted successfully!',
      success: !hasErrors || allSuccess,
      emailStatus: {
        adminNotification: {
          success: !!emailResults.adminNotification,
          messageId: emailResults.adminNotification?.messageId,
          recipient: emailResults.adminNotification?.recipient
        },
        userConfirmation: {
          success: !!emailResults.userConfirmation,
          messageId: emailResults.userConfirmation?.messageId,
          recipient: emailResults.userConfirmation?.recipient
        },
        errors: emailResults.errors
      },
      details: {
        name: `${contactData.firstName} ${contactData.lastName}`,
        email: contactData.email,
        subject: contactData.subject,
        submittedAt: new Date().toISOString()
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('💥 Contact form processing failed:', {
      message: error.message,
      stack: error.stack,
      contactEmail: req.validatedData?.email,
      timestamp: new Date().toISOString()
    });
    
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to process contact form',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;
