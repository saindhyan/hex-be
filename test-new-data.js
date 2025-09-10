require('dotenv').config();
const googleSheetsService = require('./src/services/googleSheetsService');

async function testWithNewData() {
  console.log('🧪 Testing Google Sheets with new data...\n');

  try {
    // Test 1: New Application data
    console.log('📝 Testing with new Application data...');
    const newApplication = {
      applicant: {
        firstName: 'Sarah',
        lastName: 'Chen',
        email: 'sarah.chen@stanford.edu',
        phone: '+1-650-555-7890',
        university: 'Stanford University',
        major: 'Data Science',
        graduationYear: '2025',
        gpa: '3.9',
        linkedin: 'https://linkedin.com/in/sarahchen',
        portfolio: 'https://sarahchen.io',
        availability: 'Fall 2024',
        coverLetter: 'I am passionate about machine learning and excited to contribute to HexSyn\'s innovative projects...'
      },
      opportunity: {
        id: 'intern-002',
        title: 'ML Research Intern',
        company: 'HexSyn DataLabs'
      },
      ownerEmail: 'research@hexsyn.com'
    };

    await googleSheetsService.logApplication(newApplication);
    console.log('✅ New application logged successfully\n');

    // Test 2: New Subscription data
    console.log('📧 Testing with new Subscription data...');
    const newSubscription = {
      email: 'alex.rodriguez@techcorp.com',
      subscriptionType: 'premium_updates',
      source: 'linkedin_campaign',
      interests: ['Deep Learning', 'Computer Vision', 'NLP', 'Robotics']
    };

    await googleSheetsService.logSubscription(newSubscription);
    console.log('✅ New subscription logged successfully\n');

    // Test 3: New Contact form data
    console.log('📞 Testing with new Contact form data...');
    const newContact = {
      firstName: 'Michael',
      lastName: 'Thompson',
      email: 'michael.thompson@innovate.ai',
      phone: '+1-415-555-2468',
      company: 'Innovate AI Solutions',
      subject: 'Collaboration Opportunity',
      inquiryType: 'partnership',
      message: 'We would like to discuss potential collaboration opportunities between our AI research teams. Our company specializes in computer vision applications for autonomous vehicles...'
    };

    await googleSheetsService.logContact(newContact);
    console.log('✅ New contact form logged successfully\n');

    // Test 4: Additional entries to verify multiple rows
    console.log('🔄 Adding multiple entries to test row appending...');
    
    const additionalApplication = {
      applicant: {
        firstName: 'David',
        lastName: 'Kim',
        email: 'david.kim@berkeley.edu',
        phone: '+1-510-555-1357',
        university: 'UC Berkeley',
        major: 'Computer Science',
        graduationYear: '2024',
        gpa: '3.7',
        linkedin: 'https://linkedin.com/in/davidkim',
        portfolio: 'https://davidkim.dev',
        availability: 'Immediate',
        coverLetter: 'As a final year CS student with experience in distributed systems...'
      },
      opportunity: {
        id: 'job-003',
        title: 'Backend Developer',
        company: 'HexSyn DataLabs'
      },
      ownerEmail: 'engineering@hexsyn.com'
    };

    await googleSheetsService.logApplication(additionalApplication);

    const additionalSubscription = {
      email: 'priya.patel@researcher.org',
      subscriptionType: 'weekly_digest',
      source: 'conference_booth',
      interests: ['Quantum Computing', 'Blockchain', 'IoT']
    };

    await googleSheetsService.logSubscription(additionalSubscription);

    console.log('✅ Multiple entries added successfully\n');

    console.log('🎉 All new data tests completed successfully!');
    console.log('\n📊 Check your Google Spreadsheet to verify the new entries:');
    console.log('- Applications: Sarah Chen and David Kim applications');
    console.log('- Subscriptions: Alex Rodriguez and Priya Patel subscriptions');
    console.log('- ContactUs: Michael Thompson contact form');
    console.log('\n💡 The data should be appended to existing entries, not overwritten.');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('\nError details:', error);
  }
}

// Run the test
testWithNewData();
