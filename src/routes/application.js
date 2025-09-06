const express = require('express');
const rateLimit = require('express-rate-limit');
const emailService = require('../services/emailService');
const { validateApplication } = require('../middleware/validation');

const router = express.Router();

// Rate limiting for application endpoint
const applicationRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 application requests per windowMs
  message: {
    error: 'Too many application requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  }
});

// Submit application endpoint
router.post('/', applicationRateLimit, validateApplication, async (req, res) => {
  try {
    const { applicant, opportunity, ownerEmail } = req.validatedData;
    
    // Prepare application data with timestamp
    const applicationData = {
      applicant,
      opportunity,
      submittedAt: new Date().toISOString()
    };

    console.log('Processing application from:', applicationData.applicant.firstName, applicationData.applicant.lastName);
    
    // Send emails asynchronously and return immediately
    const asyncResult = emailService.sendBothEmailsAsync(applicationData, ownerEmail);
    
    res.status(200).json({
      message: 'Application submitted successfully! Confirmation emails are being sent.',
      success: true,
      status: asyncResult.status,
      details: {
        applicant: applicationData.applicant.email,
        owner: ownerEmail,
        submittedAt: new Date().toISOString()
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Application processing failed:', error);
    
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to process application',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;
