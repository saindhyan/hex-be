require('dotenv').config();
const googleSheetsService = require('./src/services/googleSheetsService');

async function testGoogleSheets() {
  console.log('🧪 Starting Google Sheets functionality test...\n');

  try {
    // Test 1: Application logging
    console.log('📝 Testing Application logging...');
    const testApplication = {
      applicant: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1-555-0123',
        university: 'MIT',
        major: 'Computer Science',
        graduationYear: '2024',
        gpa: '3.8',
        linkedin: 'https://linkedin.com/in/johndoe',
        portfolio: 'https://johndoe.dev',
        availability: 'Summer 2024',
        coverLetter: 'I am excited to apply for this position because...'
      },
      opportunity: {
        id: 'job-001',
        title: 'Software Engineer Intern',
        company: 'HexSyn DataLabs'
      },
      ownerEmail: 'hr@hexsyn.com'
    };

    await googleSheetsService.logApplication(testApplication);
    console.log('✅ Application test completed\n');

    // Test 2: Subscription logging
    console.log('📧 Testing Subscription logging...');
    const testSubscription = {
      email: 'subscriber@example.com',
      subscriptionType: 'newsletter',
      source: 'website',
      interests: ['AI', 'Machine Learning', 'Data Science']
    };

    await googleSheetsService.logSubscription(testSubscription);
    console.log('✅ Subscription test completed\n');

    // Test 3: Contact form logging
    console.log('📞 Testing Contact form logging...');
    const testContact = {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@company.com',
      phone: '+1-555-0456',
      company: 'Tech Corp',
      subject: 'Partnership Inquiry',
      inquiryType: 'business',
      message: 'We are interested in exploring a potential partnership with HexSyn DataLabs...'
    };

    await googleSheetsService.logContact(testContact);
    console.log('✅ Contact form test completed\n');

    console.log('🎉 All Google Sheets tests completed successfully!');
    console.log('\n📊 Check your Google Spreadsheet to verify the data was logged correctly.');
    console.log('You should see three sheets with the following data:');
    console.log('- Applications: John Doe\'s application');
    console.log('- Subscriptions: subscriber@example.com subscription');
    console.log('- ContactUs: Jane Smith\'s contact form');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('\n🔍 Troubleshooting tips:');
    console.error('1. Check that all Google Sheets environment variables are set in .env');
    console.error('2. Verify the spreadsheet is shared with the service account email');
    console.error('3. Ensure the Google Sheets API is enabled in your Google Cloud project');
    console.error('4. Check that the service account has Editor permissions');
    
    if (error.message.includes('No private key available')) {
      console.error('\n🔑 Private key issue detected:');
      console.error('- Make sure GOOGLE_PRIVATE_KEY includes the full key with BEGIN/END markers');
      console.error('- Check for proper line break formatting (\\n in production)');
    }
    
    if (error.message.includes('not found')) {
      console.error('\n📋 Spreadsheet access issue:');
      console.error('- Verify GOOGLE_SHEETS_ID is correct');
      console.error('- Ensure the spreadsheet exists and is accessible');
    }
  }
}

// Run the test
testGoogleSheets();
