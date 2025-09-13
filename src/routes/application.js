const express = require('express');
const rateLimit = require('express-rate-limit');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const emailService = require('../services/emailService');
const googleSheetsService = require('../services/googleSheetsService');
const googleDriveService = require('../services/googleDriveService');
const { validateApplication } = require('../middleware/validation');

const router = express.Router();

// Configure multer for file uploads
// Use memory storage for Vercel compatibility
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});

// Rate limiting for application endpoint
const applicationRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 application requests per windowMs
  message: {
    error: 'Too many application requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  }
});

// Submit application endpoint with file upload
router.post('/', 
  applicationRateLimit, 
  upload.single('resume'),
  validateApplication, 
  async (req, res) => {
    try {
      const applicationData = req.validatedData;
      const resumeFile = req.file;
      
      console.log('Processing application from:', applicationData.firstName, applicationData.lastName);
      
      let resumeLink = '';
      let resumeFileName = '';
      
      // Upload resume to Google Drive if provided
      if (resumeFile) {
        try {
          const applicantName = `${applicationData.firstName}_${applicationData.lastName}`;
          const jobTitle = applicationData.opportunityTitle || 'Application';
          
          // Get the file buffer directly from memory storage
          const fileBuffer = resumeFile.buffer;
          
          const uploadResult = await googleDriveService.uploadResume(
            fileBuffer,
            resumeFile.originalname,
            applicantName,
            jobTitle
          );
          
          resumeLink = uploadResult.viewLink;
          resumeFileName = uploadResult.fileName;
        } catch (error) {
          console.error('Error uploading resume to Google Drive:', error);
          // Don't fail the entire request if resume upload fails
        }
      }
      
      // Prepare application data for Google Sheets and emails
      const applicationForSheets = {
        ...applicationData,
        resumeLink,
        resumeFileName,
        submittedAt: new Date().toISOString()
      };
      
      // Log to Google Sheets (async, non-blocking)
      googleSheetsService.logApplication(applicationForSheets).catch(error => {
        console.error('Google Sheets logging failed:', error);
      });
      
      // Send emails
      console.log('🚀 Sending application emails...');
      const emailResults = await emailService.sendApplicationEmails(applicationForSheets);
      console.log('📧 Application email sending results:', emailResults);
      
      const hasErrors = emailResults.errors && emailResults.errors.length > 0;
      const allSuccess = emailResults.ownerNotification && emailResults.applicantConfirmation;
      
      res.status(hasErrors && !allSuccess ? 500 : 200).json({
        message: allSuccess ? 'Application submitted and emails sent successfully!' : 
                hasErrors ? 'Application submitted but some emails failed' : 
                'Application submitted successfully!',
        success: !hasErrors || allSuccess,
        emailStatus: {
          ownerNotification: {
            success: !!(emailResults.ownerNotification && emailResults.ownerNotification.success),
            messageId: emailResults.ownerNotification?.messageId,
            recipient: emailResults.ownerNotification?.recipient
          },
          applicantConfirmation: {
            success: !!(emailResults.applicantConfirmation && emailResults.applicantConfirmation.success),
            messageId: emailResults.applicantConfirmation?.messageId,
            recipient: emailResults.applicantConfirmation?.recipient
          },
          errors: emailResults.errors || []
        },
        details: {
          applicant: applicationData.email,
          owner: applicationData.ownerEmail,
          submittedAt: new Date().toISOString(),
          resumeUploaded: !!resumeLink,
          resumeLink: resumeLink || 'No resume uploaded'
        },
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Application processing failed:', error);
      
      // No need to clean up files when using memory storage
      
      res.status(500).json({
        error: 'Internal server error',
        message: error.message || 'Failed to process application',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        timestamp: new Date().toISOString()
      });
    }
  }
);

module.exports = router;
