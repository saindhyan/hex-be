const express = require('express');
const rateLimit = require('express-rate-limit');
const emailService = require('../services/emailService');
const { validateApplication, validateContact } = require('../middleware/validation');

const router = express.Router();

// Rate limiting for email endpoints
const emailRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 email requests per windowMs
  message: {
    error: 'Too many email requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  }
});

// Test email connection endpoint
router.get('/test-connection', async (req, res) => {
  try {
    const result = await emailService.testConnection();
    res.json(result);
  } catch (error) {
    res.status(500).json({
      error: 'Connection test failed',
      message: error.message
    });
  }
});

// Send application emails endpoint
router.post('/send-application', emailRateLimit, validateApplication, async (req, res) => {
  try {
    const { applicant, internship } = req.validatedData;
    
    // Prepare application data with timestamp
    const applicationData = {
      applicant,
      internship,
      submittedAt: new Date().toISOString()
    };

    console.log('Processing application from:', applicationData.applicant.name);
    
    const ownerEmail = process.env.ADMIN_EMAIL || 'piyushsaini597@gmail.com';
    
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
    console.error('Application email processing failed:', error);
    
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to process application emails',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      timestamp: new Date().toISOString()
    });
  }
});

// Send owner notification only
router.post('/send-owner-notification', emailRateLimit, validateApplication, async (req, res) => {
  try {
    const { applicant, internship, ownerEmail } = req.validatedData;
    
    const applicationData = {
      applicant,
      internship,
      submittedAt: new Date().toISOString()
    };

    const result = await emailService.sendOwnerNotification(applicationData, ownerEmail);

    res.json({
      message: 'Owner notification sent successfully',
      success: true,
      result,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Owner notification failed:', error);
    
    res.status(500).json({
      error: 'Failed to send owner notification',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Send applicant confirmation only
router.post('/send-applicant-confirmation', emailRateLimit, validateApplication, async (req, res) => {
  try {
    const { applicant, internship } = req.validatedData;
    
    const applicationData = {
      applicant,
      internship,
      submittedAt: new Date().toISOString()
    };

    const result = await emailService.sendApplicantConfirmation(applicationData);

    res.json({
      message: 'Applicant confirmation sent successfully',
      success: true,
      result,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Applicant confirmation failed:', error);
    
    res.status(500).json({
      error: 'Failed to send applicant confirmation',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Send contact form emails endpoint
router.post('/send-contact', emailRateLimit, validateContact, async (req, res) => {
  try {
    const contactData = {
      ...req.validatedData,
      submittedAt: new Date().toISOString()
    };

    console.log('Processing contact form from:', contactData.name, '-', contactData.subject);
    
    // Send emails asynchronously and return immediately
    const asyncResult = emailService.sendContactEmailsAsync(contactData);
    
    res.status(200).json({
      message: 'Contact form submitted successfully! We will get back to you soon.',
      success: true,
      status: asyncResult.status,
      details: {
        name: contactData.name,
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
      message: 'Failed to process contact form emails',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      timestamp: new Date().toISOString()
    });
  }
});

// Send contact admin notification only
router.post('/send-contact-admin', emailRateLimit, validateContact, async (req, res) => {
  try {
    const contactData = {
      ...req.validatedData,
      submittedAt: new Date().toISOString()
    };

    const result = await emailService.sendContactAdminNotification(contactData);

    res.json({
      message: 'Contact admin notification sent successfully',
      success: true,
      result,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Contact admin notification failed:', error);
    
    res.status(500).json({
      error: 'Failed to send contact admin notification',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Send contact user confirmation only
router.post('/send-contact-confirmation', emailRateLimit, validateContact, async (req, res) => {
  try {
    const contactData = {
      ...req.validatedData,
      submittedAt: new Date().toISOString()
    };

    const result = await emailService.sendContactUserConfirmation(contactData);

    res.json({
      message: 'Contact user confirmation sent successfully',
      success: true,
      result,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Contact user confirmation failed:', error);
    
    res.status(500).json({
      error: 'Failed to send contact user confirmation',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;
