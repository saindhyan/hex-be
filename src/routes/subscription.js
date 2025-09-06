const express = require('express');
const rateLimit = require('express-rate-limit');
const emailService = require('../services/emailService');
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
    
    // Send emails asynchronously and return immediately
    const asyncResult = emailService.sendSubscriptionEmailsAsync(subscriptionData);
    
    res.status(200).json({
      message: 'Successfully subscribed to updates! Check your email for confirmation.',
      success: true,
      status: asyncResult.status,
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
