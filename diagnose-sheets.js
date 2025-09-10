require('dotenv').config();
const { google } = require('googleapis');

async function diagnoseGoogleSheets() {
  console.log('🔍 Diagnosing Google Sheets setup...\n');

  // Check environment variables
  console.log('📋 Checking environment variables:');
  const requiredVars = [
    'GOOGLE_SHEETS_ID',
    'GOOGLE_PROJECT_ID', 
    'GOOGLE_PRIVATE_KEY_ID',
    'GOOGLE_PRIVATE_KEY',
    'GOOGLE_CLIENT_EMAIL',
    'GOOGLE_CLIENT_ID'
  ];

  const missingVars = [];
  requiredVars.forEach(varName => {
    const value = process.env[varName];
    if (!value) {
      missingVars.push(varName);
      console.log(`❌ ${varName}: Missing`);
    } else {
      console.log(`✅ ${varName}: Set (${varName === 'GOOGLE_PRIVATE_KEY' ? 'length: ' + value.length : 'present'})`);
    }
  });

  if (missingVars.length > 0) {
    console.log(`\n❌ Missing required environment variables: ${missingVars.join(', ')}`);
    return;
  }

  console.log('\n🔑 Service Account Details:');
  console.log(`Email: ${process.env.GOOGLE_CLIENT_EMAIL}`);
  console.log(`Project ID: ${process.env.GOOGLE_PROJECT_ID}`);
  console.log(`Spreadsheet ID: ${process.env.GOOGLE_SHEETS_ID}`);

  // Test authentication
  console.log('\n🔐 Testing authentication...');
  try {
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

    const sheets = google.sheets({ version: 'v4', auth });
    console.log('✅ Authentication setup successful');

    // Test spreadsheet access
    console.log('\n📊 Testing spreadsheet access...');
    const response = await sheets.spreadsheets.get({
      spreadsheetId: process.env.GOOGLE_SHEETS_ID
    });

    console.log('✅ Spreadsheet access successful!');
    console.log(`Spreadsheet title: "${response.data.properties.title}"`);
    console.log(`Existing sheets: ${response.data.sheets.map(s => s.properties.title).join(', ')}`);

    // Test write permissions
    console.log('\n✏️ Testing write permissions...');
    const testSheetName = 'DiagnosticTest';
    
    // Try to create a test sheet
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: process.env.GOOGLE_SHEETS_ID,
      resource: {
        requests: [{
          addSheet: {
            properties: {
              title: testSheetName
            }
          }
        }]
      }
    });

    console.log('✅ Write permissions confirmed - test sheet created');

    // Clean up test sheet
    const updatedResponse = await sheets.spreadsheets.get({
      spreadsheetId: process.env.GOOGLE_SHEETS_ID
    });
    const testSheet = updatedResponse.data.sheets.find(s => s.properties.title === testSheetName);
    
    if (testSheet) {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: process.env.GOOGLE_SHEETS_ID,
        resource: {
          requests: [{
            deleteSheet: {
              sheetId: testSheet.properties.sheetId
            }
          }]
        }
      });
      console.log('🧹 Test sheet cleaned up');
    }

    console.log('\n🎉 All diagnostics passed! Your Google Sheets integration is properly configured.');

  } catch (error) {
    console.error('\n❌ Diagnostic failed:', error.message);
    
    if (error.code === 403) {
      console.log('\n🔧 Permission Issue Detected:');
      console.log('1. Open your Google Spreadsheet');
      console.log('2. Click the "Share" button');
      console.log(`3. Add this email with Editor permissions: ${process.env.GOOGLE_CLIENT_EMAIL}`);
      console.log('4. Make sure "Notify people" is unchecked');
      console.log('5. Click "Share"');
    } else if (error.code === 404) {
      console.log('\n🔧 Spreadsheet Not Found:');
      console.log('1. Check that GOOGLE_SHEETS_ID is correct');
      console.log('2. Verify the spreadsheet exists and is accessible');
      console.log(`3. Current ID: ${process.env.GOOGLE_SHEETS_ID}`);
    } else if (error.message.includes('private key')) {
      console.log('\n🔧 Private Key Issue:');
      console.log('1. Ensure GOOGLE_PRIVATE_KEY includes BEGIN/END markers');
      console.log('2. Check line break formatting (use \\n for line breaks)');
      console.log('3. Verify the key is wrapped in double quotes');
    }
  }
}

diagnoseGoogleSheets();
