const express = require('express');
const multer = require('multer');
const rateLimit = require('express-rate-limit');
const googleDriveService = require('../services/googleDriveService');
const googleSheetsService = require('../services/googleSheetsService');
const emailService = require('../services/emailService');
const { validateCareerApplication } = require('../middleware/validation');

const router = express.Router();

// Configure multer for file upload (memory storage for serverless)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Only allow PDF files for resumes
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed for resume upload'), false);
    }
  }
});

// Rate limiting for career application endpoint (increased for development)
const careerRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // limit each IP to 100 requests per minute during development
  message: {
    error: 'Too many career application requests from this IP, please try again later.',
    retryAfter: '1 minute'
  }
});

// Career application endpoint
router.post('/', careerRateLimit, upload.single('resume'), validateCareerApplication, async (req, res) => {
  try {
    const applicationData = req.validatedData;
    const resumeFile = req.file;
    
    console.log('Processing career application from:', applicationData.firstName, applicationData.lastName);
    
    let resumeLink = '';
    let resumeFileName = '';
    
    // Upload resume to Google Drive if provided
    if (resumeFile) {
      try {
        const applicantName = `${applicationData.firstName}_${applicationData.lastName}`;
        const jobTitle = applicationData.jobTitle || 'Career_Application';
        
        const uploadResult = await googleDriveService.uploadResume(
          resumeFile.buffer,
          resumeFile.originalname,
          applicantName,
          jobTitle
        );
        
        resumeLink = uploadResult.viewLink;
        resumeFileName = uploadResult.fileName;
        
        console.log('Resume uploaded successfully:', resumeFileName);
      } catch (driveError) {
        console.error('Resume upload failed:', driveError);
        // Continue with application processing even if resume upload fails
        resumeLink = 'Upload failed - file received but not stored';
      }
    }
    
    // Prepare data for Google Sheets and emails
    const completeApplicationData = {
      ...applicationData,
      resumeLink,
      resumeFileName,
      submittedAt: new Date().toISOString()
    };
    
    // Log to Google Sheets (async, non-blocking)
    googleSheetsService.logCareerApplication(completeApplicationData).catch(error => {
      console.error('Google Sheets logging failed:', error);
    });
    
    // Send emails to both admin and applicant (async, non-blocking)
    emailService.sendCareerEmailsAsync(completeApplicationData, resumeFile?.buffer);
    
    res.status(200).json({
      message: 'Career application submitted successfully! Confirmation emails are being sent.',
      success: true,
      details: {
        applicant: `${applicationData.firstName} ${applicationData.lastName}`,
        email: applicationData.email,
        jobTitle: applicationData.jobTitle,
        jobId: applicationData.jobId,
        resumeUploaded: !!resumeFile,
        resumeLink: resumeLink || null,
        emailsStatus: 'sending',
        submittedAt: new Date().toISOString()
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Career application processing failed:', error);
    
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to process career application',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      timestamp: new Date().toISOString()
    });
  }
});

// Error handler for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'File too large',
        message: 'Resume file size must be less than 10MB'
      });
    }
  }
  
  if (error.message === 'Only PDF files are allowed for resume upload') {
    return res.status(400).json({
      error: 'Invalid file type',
      message: 'Only PDF files are allowed for resume upload'
    });
  }
  
  next(error);
});

module.exports = router;
