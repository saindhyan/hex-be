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
        scopes: ['https://www.googleapis.com/auth/spreadsheets']
      });

      this.sheets = google.sheets({ version: 'v4', auth });
      this.initialized = true;
      
      winston.info('Google Sheets service initialized successfully');
    } catch (error) {
      winston.error('Failed to initialize Google Sheets service:', error);
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

  async logApplication(applicationData) {
    try {
      const { applicant, opportunity, ownerEmail } = applicationData;
      
      const headers = [
        'Timestamp', 'First Name', 'Last Name', 'Email', 'Phone', 'University', 
        'Major', 'Graduation Year', 'GPA', 'LinkedIn', 'Portfolio', 'Availability',
        'Opportunity ID', 'Opportunity Title', 'Company', 'Owner Email', 'Cover Letter'
      ];
      
      await this.setupSheetHeaders('Applications', headers);
      
      const values = [
        new Date().toISOString(),
        applicant.firstName || '',
        applicant.lastName || '',
        applicant.email || '',
        applicant.phone || '',
        applicant.university || '',
        applicant.major || '',
        applicant.graduationYear || '',
        applicant.gpa || '',
        applicant.linkedin || '',
        applicant.portfolio || '',
        applicant.availability || '',
        opportunity.id || '',
        opportunity.title || '',
        opportunity.company || '',
        ownerEmail || '',
        applicant.coverLetter || ''
      ];
      
      await this.appendRow('Applications', values);
      winston.info('Application logged to Google Sheets');
    } catch (error) {
      winston.error('Error logging application to Google Sheets:', error);
      // Don't throw error to prevent breaking the main application flow
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
}

module.exports = new GoogleSheetsService();
