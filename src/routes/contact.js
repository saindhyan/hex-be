const express = require('express');
const rateLimit = require('express-rate-limit');
const emailService = require('../services/emailService');
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

    console.log('Processing contact form from:', contactData.firstName, contactData.lastName, '-', contactData.subject);
    
    // Send emails asynchronously and return immediately
    const asyncResult = emailService.sendContactEmailsAsync(contactData);
    
    res.status(200).json({
      message: 'Contact form submitted successfully! We will get back to you soon.',
      success: true,
      status: asyncResult.status,
      details: {
        name: `${contactData.firstName} ${contactData.lastName}`,
        email: contactData.email,
        subject: contactData.subject,
        submittedAt: new Date().toISOString()
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Contact form processing failed:', error);
    
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to process contact form',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;
