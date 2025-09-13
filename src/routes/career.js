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

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Career application endpoint - Processed synchronously
router.post('/', careerRateLimit, upload.single('resume'), validateCareerApplication, async (req, res, next) => {
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
    
    // Prepare response object
    const responseData = {
      success: true,
      message: 'Career application submitted successfully',
      details: {
        applicant: `${applicationData.firstName} ${applicationData.lastName}`,
        email: applicationData.email,
        jobTitle: applicationData.jobTitle,
        jobId: applicationData.jobId,
        resumeUploaded: !!resumeFile,
        operations: {
          resumeUpload: { status: 'pending', success: false, message: 'Not started' },
          sheetUpdate: { status: 'pending', success: false, message: 'Not started' },
          emailNotification: { status: 'pending', success: false, message: 'Not started' }
        },
        timestamps: {
          submittedAt: new Date().toISOString(),
          completedAt: null
        }
      }
    };

    // Update response with resume upload status
    if (resumeFile) {
      responseData.details.operations.resumeUpload = {
        status: 'completed',
        success: true,
        message: 'Resume uploaded successfully',
        resumeLink,
        resumeFileName
      };
    } else {
      responseData.details.operations.resumeUpload = {
        status: 'skipped',
        success: true,
        message: 'No resume file provided'
      };
    }

    try {
      // 1. Log to Google Sheets
      responseData.details.operations.sheetUpdate.status = 'processing';
      responseData.details.operations.sheetUpdate.message = 'Saving to Google Sheets...';
      
      await googleSheetsService.logCareerApplication({
        ...applicationData,
        resumeLink,
        resumeFileName,
        submittedAt: responseData.details.timestamps.submittedAt
      });
      
      responseData.details.operations.sheetUpdate = {
        status: 'completed',
        success: true,
        message: 'Successfully saved to Google Sheets',
        timestamp: new Date().toISOString()
      };
      
      // 2. Send emails (if enabled)
      if (emailService.sendCareerEmailsAsync) {
        responseData.details.operations.emailNotification.status = 'processing';
        responseData.details.operations.emailNotification.message = 'Sending emails...';
        
        await emailService.sendCareerEmailsAsync(
          { ...applicationData, resumeLink, resumeFileName },
          resumeFile?.buffer
        );
        
        responseData.details.operations.emailNotification = {
          status: 'completed',
          success: true,
          message: 'Successfully sent email notifications',
          timestamp: new Date().toISOString()
        };
      } else {
        responseData.details.operations.emailNotification = {
          status: 'skipped',
          success: true,
          message: 'Email service not configured',
          timestamp: new Date().toISOString()
        };
      }
      
    } catch (error) {
      console.error('Error processing application:', error);
      
      // Update the failed operation status
      const failedOperation = 
        responseData.details.operations.sheetUpdate.status === 'processing' ? 'sheetUpdate' :
        responseData.details.operations.emailNotification.status === 'processing' ? 'emailNotification' :
        'unknown';
      
      responseData.details.operations[failedOperation] = {
        status: 'failed',
        success: false,
        message: error.message || 'Unknown error occurred',
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        timestamp: new Date().toISOString()
      };
      
      // If sheet update failed, mark as partial success
      if (failedOperation === 'sheetUpdate') {
        responseData.success = false;
        responseData.message = 'Application submitted but could not save to Google Sheets';
      }
    }
    
    // Update completion timestamp
    responseData.details.timestamps.completedAt = new Date().toISOString();
    
    // Set the final response status based on operation success
    const statusCode = responseData.success ? 200 : 207; // 207 for partial success
    
    // Clean up the response for production (remove stack traces)
    if (process.env.NODE_ENV !== 'development') {
      Object.values(responseData.details.operations).forEach(op => {
        if (op.error) delete op.error;
      });
    }
    
    // Add resume link and timestamp to response
    responseData.details.resumeLink = resumeLink || null;
    responseData.details.submittedAt = responseData.details.timestamps.submittedAt;
    responseData.timestamp = new Date().toISOString();
    
    res.status(statusCode).json(responseData);

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
