const { google } = require('googleapis');
const winston = require('winston');

class GoogleSheetsService {
  constructor() {
    this.sheets = null;
    this.spreadsheetId = process.env.GOOGLE_SHEETS_ID;
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
        scopes: ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive.file']
      });

      this.sheets = google.sheets({ version: 'v4', auth });
      this.initialized = true;
      
      winston.info('Google Sheets service initialized successfully');
    } catch (error) {
      winston.error('Failed to initialize Google Sheets service:', error);
      throw error;
    }
  }

  async logApplication(applicationData) {
    try {
      await this.initialize();
      
      const sheetName = 'Applications';
      await this.ensureSheetExists(sheetName);
      
      // Prepare the row data in the correct order
      const row = [
        new Date().toISOString(),  // Timestamp
        applicationData.firstName || '',
        applicationData.lastName || '',
        applicationData.email || '',
        applicationData.phone || '',
        applicationData.university || '',
        applicationData.major || '',
        applicationData.graduationYear || '',
        applicationData.gpa || '',
        applicationData.coverLetter || '',
        applicationData.linkedin || '',
        applicationData.portfolio || '',
        applicationData.availability || '',
        applicationData.duration || '',
        applicationData.transactionId || '',
        applicationData.paymentDone || 'false',
        applicationData.paymentAmount || '0',
        applicationData.opportunityId || '',
        applicationData.opportunityTitle || '',
        applicationData.opportunityCompany || '',
        applicationData.ownerEmail || '',
        applicationData.resumeLink || '',
        applicationData.resumeFileName || ''
      ];
      
      // Append the new row to the sheet
      const response = await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: `${sheetName}!A:W`,  // A:W covers all columns we're using
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        resource: {
          values: [row]
        }
      });
      
      winston.info('Application logged to Google Sheets:', response.data);
      return response.data;
      
    } catch (error) {
      winston.error('Error logging application to Google Sheets:', error);
      throw error;
    }
  }

  async ensureSheetExists(sheetName) {
    try {
      await this.initialize();
      
      // Get existing sheets
      const response = await this.sheets.spreadsheets.get({
        spreadsheetId: this.spreadsheetId
      });
      
      const existingSheets = response.data.sheets.map(sheet => sheet.properties.title);
      
      if (!existingSheets.includes(sheetName)) {
        // Create the sheet
        await this.sheets.spreadsheets.batchUpdate({
          spreadsheetId: this.spreadsheetId,
          resource: {
            requests: [{
              addSheet: {
                properties: {
                  title: sheetName
                }
              }
            }]
          }
        });
        winston.info(`Created new sheet: ${sheetName}`);
      }
    } catch (error) {
      winston.error(`Error ensuring sheet exists: ${sheetName}`, error);
      throw error;
    }
  }

  async setupSheetHeaders(sheetName, headers) {
    try {
      await this.ensureSheetExists(sheetName);
      
      // Check if headers already exist
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: `${sheetName}!A1:Z1`
      });
      
      if (!response.data.values || response.data.values.length === 0) {
        // Add headers
        await this.sheets.spreadsheets.values.update({
          spreadsheetId: this.spreadsheetId,
          range: `${sheetName}!A1`,
          valueInputOption: 'USER_ENTERED',
          resource: {
            values: [headers]
          }
        });
        
        // Format headers (bold, freeze row)
        await this.sheets.spreadsheets.batchUpdate({
          spreadsheetId: this.spreadsheetId,
          resource: {
            requests: [
              {
                repeatCell: {
                  range: {
                    sheetId: await this.getSheetId(sheetName),
                    startRowIndex: 0,
                    endRowIndex: 1,
                    startColumnIndex: 0,
                    endColumnIndex: headers.length
                  },
                  cell: {
                    userEnteredFormat: {
                      textFormat: {
                        bold: true
                      },
                      backgroundColor: {
                        red: 0.9,
                        green: 0.9,
                        blue: 0.9
                      }
                    }
                  },
                  fields: 'userEnteredFormat(textFormat,backgroundColor)'
                }
              },
              {
                updateSheetProperties: {
                  properties: {
                    sheetId: await this.getSheetId(sheetName),
                    gridProperties: {
                      frozenRowCount: 1
                    }
                  },
                  fields: 'gridProperties.frozenRowCount'
                }
              }
            ]
          }
        });
        
        winston.info(`Set up headers for sheet: ${sheetName}`);
      }
    } catch (error) {
      winston.error(`Error setting up headers for sheet: ${sheetName}`, error);
      throw error;
    }
  }

  async getSheetId(sheetName) {
    const response = await this.sheets.spreadsheets.get({
      spreadsheetId: this.spreadsheetId
    });
    
    const sheet = response.data.sheets.find(s => s.properties.title === sheetName);
    return sheet ? sheet.properties.sheetId : null;
  }

  async appendRow(sheetName, values) {
    try {
      await this.initialize();
      
      const response = await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: `${sheetName}!A:A`,
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        resource: {
          values: [values]
        }
      });
      
      winston.info(`Added row to ${sheetName}: ${response.data.updates.updatedRows} rows updated`);
      return response.data;
    } catch (error) {
      winston.error(`Error appending row to ${sheetName}:`, error);
      throw error;
    }
  }


  async logSubscription(subscriptionData) {
    try {
      const { email, subscriptionType, source, interests } = subscriptionData;
      
      const headers = [
        'Timestamp', 'Email', 'Subscription Type', 'Source', 'Interests'
      ];
      
      await this.setupSheetHeaders('Subscriptions', headers);
      
      const values = [
        new Date().toISOString(),
        email || '',
        subscriptionType || '',
        source || '',
        Array.isArray(interests) ? interests.join(', ') : (interests || '')
      ];
      
      await this.appendRow('Subscriptions', values);
      winston.info('Subscription logged to Google Sheets');
    } catch (error) {
      winston.error('Error logging subscription to Google Sheets:', error);
      // Don't throw error to prevent breaking the main application flow
    }
  }

  async logContact(contactData) {
    try {
      const { firstName, lastName, email, phone, company, subject, message, inquiryType } = contactData;
      
      const headers = [
        'Timestamp', 'First Name', 'Last Name', 'Email', 'Phone', 
        'Company', 'Subject', 'Inquiry Type', 'Message'
      ];
      
      await this.setupSheetHeaders('ContactUs', headers);
      
      const values = [
        new Date().toISOString(),
        firstName || '',
        lastName || '',
        email || '',
        phone || '',
        company || '',
        subject || '',
        inquiryType || '',
        message || ''
      ];
      
      await this.appendRow('ContactUs', values);
      winston.info('Contact form logged to Google Sheets');
    } catch (error) {
      winston.error('Error logging contact form to Google Sheets:', error);
      // Don't throw error to prevent breaking the main application flow
    }
  }

  async logCareerApplication(applicationData) {
    try {
      const {
        firstName, lastName, email, phone, location, experience, availability,
        salary, coverLetter, portfolio, linkedin, github, agreeToTerms, allowContact,
        jobId, jobTitle, department, resumeLink, resumeFileName, submittedAt,
        // Adding payment and opportunity fields
        transactionId, paymentDone, paymentAmount, opportunityId,
        opportunityTitle, opportunityCompany, ownerEmail, duration
      } = applicationData;
      
      const headers = [
        'Timestamp', 'First Name', 'Last Name', 'Email', 'Phone', 'Location',
        'Experience Level', 'Availability', 'Duration', 'Salary Expectation', 'Cover Letter',
        'Portfolio', 'LinkedIn', 'GitHub', 'Agree to Terms', 'Allow Contact',
        'Job ID', 'Job Title', 'Department', 'Opportunity ID', 'Opportunity Title',
        'Opportunity Company', 'Transaction ID', 'Payment Done', 'Payment Amount',
        'Owner Email', 'Resume Link', 'Resume File Name'
      ];
      
      await this.setupSheetHeaders('Career Applications', headers);
      
      const values = [
        submittedAt || new Date().toISOString(),
        firstName || '',
        lastName || '',
        email || '',
        phone || '',
        location || '',
        experience || '',
        availability || '',
        duration || '',
        salary || '',
        coverLetter || '',
        portfolio || '',
        linkedin || '',
        github || '',
        agreeToTerms ? 'Yes' : 'No',
        allowContact ? 'Yes' : 'No',
        jobId || '',
        jobTitle || '',
        department || '',
        opportunityId || '',
        opportunityTitle || '',
        opportunityCompany || '',
        transactionId || '',
        paymentDone ? 'Yes' : 'No',
        paymentAmount || '',
        ownerEmail || '',
        resumeLink || '',
        resumeFileName || ''
      ];
      
      await this.appendRow('Career Applications', values);
      winston.info('Career application logged to Google Sheets');
    } catch (error) {
      winston.error('Error logging career application to Google Sheets:', error);
      // Don't throw error to prevent breaking the main application flow
    }
  }

}

module.exports = new GoogleSheetsService();
