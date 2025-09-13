const { google } = require('googleapis');
const winston = require('winston');

class GoogleDriveService {
  constructor() {
    this.drive = null;
    this.folderId = process.env.GOOGLE_DRIVE_FOLDER_ID || null;
    this.initialized = false;
  }

  async initialize() {
    try {
      if (this.initialized) return;

      // Create service account credentials from environment variables
      const credentials = {
        type: 'service_account',
        project_id: process.env.GOOGLE_PROJECT_ID,
        private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        client_id: process.env.GOOGLE_CLIENT_ID,
        auth_uri: 'https://accounts.google.com/o/oauth2/auth',
        token_uri: 'https://oauth2.googleapis.com/token',
        auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
        client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.GOOGLE_CLIENT_EMAIL}`
      };

      const auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ['https://www.googleapis.com/auth/drive.file']
      });

      this.drive = google.drive({ version: 'v3', auth });
      this.initialized = true;
      
      winston.info('Google Drive service initialized successfully');
    } catch (error) {
      winston.error('Failed to initialize Google Drive service:', error);
      throw error;
    }
  }

  async uploadResume(fileBuffer, fileName, applicantName, jobTitle) {
    let stream = null;
    
    try {
      if (!fileBuffer || !fileName) {
        throw new Error('File buffer and file name are required');
      }
      
      await this.initialize();

      // Create a unique filename with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const sanitizedApplicantName = (applicantName || 'applicant').replace(/[^a-zA-Z0-9]/g, '_');
      const sanitizedJobTitle = (jobTitle || 'application').replace(/[^a-zA-Z0-9]/g, '_');
      const uniqueFileName = `${timestamp}_${sanitizedApplicantName}_${sanitizedJobTitle}_${fileName}`;

      const fileMetadata = {
        name: uniqueFileName,
        parents: this.folderId ? [this.folderId] : undefined
      };

      const { Readable } = require('stream');
      
      // Convert Buffer to stream for Google Drive API with proper error handling
      stream = new Readable();
      stream.push(fileBuffer);
      stream.push(null);

      // Handle stream errors
      stream.on('error', (error) => {
        winston.error('Stream error during upload:', error);
        throw error;
      });

      const media = {
        mimeType: 'application/pdf',
        body: stream
      };

      winston.info(`Starting upload for: ${uniqueFileName}`);
      
      // Upload with timeout
      const uploadPromise = this.drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id,name,webViewLink,webContentLink',
        supportsAllDrives: true
      });

      // Set a timeout for the upload (30 seconds)
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error('Google Drive upload timed out after 30 seconds'));
        }, 30000);
      });

      const response = await Promise.race([uploadPromise, timeoutPromise]);

      winston.info(`File uploaded, setting permissions: ${response.data.name}`);
      
      // Set file permissions
      try {
        await this.drive.permissions.create({
          fileId: response.data.id,
          requestBody: {
            role: 'reader',
            type: 'anyone'
          },
          supportsAllDrives: true
        });
      } catch (permError) {
        // Log permission error but don't fail the upload
        winston.warn(`Failed to set public permissions for ${response.data.id}:`, permError);
      }

      winston.info(`Resume uploaded successfully: ${response.data.name}`);
      
      return {
        fileId: response.data.id,
        fileName: response.data.name,
        viewLink: response.data.webViewLink,
        downloadLink: response.data.webContentLink
      };
    } catch (error) {
      winston.error('Error in uploadResume:', {
        error: error.message,
        stack: error.stack,
        fileName,
        applicantName,
        jobTitle
      });
      throw new Error(`Failed to upload resume: ${error.message}`);
    } finally {
      // Ensure stream is properly destroyed
      if (stream) {
        stream.destroy();
      }
    }
  }

  async createResumeFolder() {
    try {
      await this.initialize();

      const folderMetadata = {
        name: 'Career Applications - Resumes',
        mimeType: 'application/vnd.google-apps.folder'
      };

      const response = await this.drive.files.create({
        resource: folderMetadata,
        fields: 'id,name',
        supportsAllDrives: true
      });

      winston.info(`Created resume folder: ${response.data.name} (ID: ${response.data.id})`);
      
      return response.data.id;
    } catch (error) {
      winston.error('Error creating resume folder:', error);
      throw error;
    }
  }

  async deleteFile(fileId) {
    try {
      await this.initialize();
      
      await this.drive.files.delete({
        fileId: fileId,
        supportsAllDrives: true
      });

      winston.info(`File deleted successfully: ${fileId}`);
    } catch (error) {
      winston.error(`Error deleting file ${fileId}:`, error);
      throw error;
    }
  }
}

module.exports = new GoogleDriveService();
