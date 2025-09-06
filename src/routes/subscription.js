const express = require('express');
const rateLimit = require('express-rate-limit');
const emailService = require('../services/emailService');
const googleSheetsService = require('../services/googleSheetsService');
const { validateSubscription } = require('../middleware/validation');

const router = express.Router();

// Rate limiting for subscription endpoint
const subscriptionRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 subscription requests per windowMs
  message: {
    error: 'Too many subscription requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  }
});

// Subscribe to updates endpoint
router.post('/subscribe', subscriptionRateLimit, validateSubscription, async (req, res) => {
  try {
    const subscriptionData = {
      ...req.validatedData,
      subscribedAt: new Date().toISOString()
    };

    console.log('Processing subscription from:', subscriptionData.email, '-', subscriptionData.subscriptionType);
    
    // Log to Google Sheets (async, non-blocking)
    googleSheetsService.logSubscription(subscriptionData).catch(error => {
      console.error('Google Sheets logging failed:', error);
    });
    
    // Send emails synchronously for debugging
    console.log('🚀 Sending subscription emails synchronously for debugging...');
    const emailResults = await emailService.sendSubscriptionEmails(subscriptionData);
    console.log('📧 Subscription email sending results:', emailResults);
    
    const hasErrors = emailResults.errors.length > 0;
    const allSuccess = emailResults.adminNotification && emailResults.userConfirmation;
    
    res.status(hasErrors && !allSuccess ? 500 : 200).json({
      message: allSuccess ? 'Successfully subscribed and confirmation emails sent!' : 
               hasErrors ? 'Subscription processed but some emails failed' : 
               'Successfully subscribed to updates!',
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
        email: subscriptionData.email,
        subscriptionType: subscriptionData.subscriptionType,
        source: subscriptionData.source,
        interests: subscriptionData.interests,
        subscribedAt: new Date().toISOString()
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Subscription processing failed:', error);
    
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to process subscription',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;
