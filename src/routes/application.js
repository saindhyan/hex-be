const express = require('express');
const rateLimit = require('express-rate-limit');
const emailService = require('../services/emailService');
const googleSheetsService = require('../services/googleSheetsService');
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
    
    // Log to Google Sheets (async, non-blocking)
    googleSheetsService.logApplication({ applicant, opportunity, ownerEmail }).catch(error => {
      console.error('Google Sheets logging failed:', error);
    });

    // Send emails synchronously for debugging
    console.log('🚀 Sending application emails synchronously for debugging...');
    const emailResults = await emailService.sendBothEmails(applicationData, ownerEmail);
    console.log('📧 Application email sending results:', emailResults);
    
    const hasErrors = emailResults.errors.length > 0;
    const allSuccess = emailResults.ownerNotification && emailResults.applicantConfirmation;
    
    res.status(hasErrors && !allSuccess ? 500 : 200).json({
      message: allSuccess ? 'Application submitted and emails sent successfully!' : 
               hasErrors ? 'Application submitted but some emails failed' : 
               'Application submitted successfully!',
      success: !hasErrors || allSuccess,
      emailStatus: {
        ownerNotification: {
          success: !!emailResults.ownerNotification,
          messageId: emailResults.ownerNotification?.messageId,
          recipient: emailResults.ownerNotification?.recipient
        },
        applicantConfirmation: {
          success: !!emailResults.applicantConfirmation,
          messageId: emailResults.applicantConfirmation?.messageId,
          recipient: emailResults.applicantConfirmation?.recipient
        },
        errors: emailResults.errors
      },
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
