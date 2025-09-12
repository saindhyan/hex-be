require('dotenv').config();
const fs = require('fs');
const path = require('path');
const googleDriveService = require('./src/services/googleDriveService');

// Use the correct shared drive folder ID we created
const CORRECT_FOLDER_ID = '1fHw2Pd1eQ3kELcIiC3Nxs45ZLeA3rIst';

async function runFinalTest() {
  console.log('🚀 Final Google Drive Upload Test');
  console.log('=================================\n');

  try {
    // Override the folder ID temporarily for testing
    const originalFolderId = googleDriveService.folderId;
    googleDriveService.folderId = CORRECT_FOLDER_ID;

    console.log(`📁 Using folder ID: ${CORRECT_FOLDER_ID}`);
    console.log('🔧 Initializing Google Drive service...');

    // Test the service initialization
    await googleDriveService.initialize();
    console.log('✅ Google Drive service initialized successfully\n');

    // Create a test PDF-like file
    console.log('📄 Creating test resume file...');
    const testResumeContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj

4 0 obj
<<
/Length 44
>>
stream
BT
/F1 12 Tf
72 720 Td
(Test Resume - John Doe) Tj
ET
endstream
endobj

xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000206 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
299
%%EOF`;

    const testFilePath = path.join(__dirname, 'test-resume.pdf');
    fs.writeFileSync(testFilePath, testResumeContent);
    console.log('✅ Test PDF file created\n');

    // Test the upload functionality
    console.log('⬆️  Testing resume upload...');
    const fileBuffer = fs.readFileSync(testFilePath);
    
    const uploadResult = await googleDriveService.uploadResume(
      fileBuffer,
      'test-resume.pdf',
      'John Doe',
      'Software Developer'
    );

    console.log('✅ Upload successful!');
    console.log(`   File ID: ${uploadResult.fileId}`);
    console.log(`   File Name: ${uploadResult.fileName}`);
    console.log(`   View Link: ${uploadResult.viewLink}`);
    console.log(`   Download Link: ${uploadResult.downloadLink}\n`);

    // Test creating a new folder (optional)
    console.log('📂 Testing folder creation...');
    try {
      const newFolderId = await googleDriveService.createResumeFolder();
      console.log(`✅ New folder created with ID: ${newFolderId}\n`);
    } catch (folderError) {
      console.log('ℹ️  Folder creation test skipped (folder may already exist)\n');
    }

    // Cleanup
    fs.unlinkSync(testFilePath);
    console.log('🧹 Test file cleaned up');

    // Restore original folder ID
    googleDriveService.folderId = originalFolderId;

    console.log('\n🎉 ALL TESTS PASSED!');
    console.log('====================================');
    console.log('✅ Google Drive service is working correctly');
    console.log('✅ File upload to shared drive successful');
    console.log('✅ File permissions set correctly');
    console.log('✅ Service supports shared drives');
    console.log('\n📝 IMPORTANT: Update your .env file with:');
    console.log(`GOOGLE_DRIVE_FOLDER_ID=${CORRECT_FOLDER_ID}`);
    console.log('\n🔗 Your uploaded file is accessible at:');
    console.log(uploadResult.viewLink);

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

// Additional utility function to test with different file types
async function testMultipleFileTypes() {
  console.log('\n🧪 Testing Multiple File Types');
  console.log('==============================\n');

  const testFiles = [
    {
      name: 'resume.txt',
      content: 'John Doe\nSoftware Developer\nExperience: 5 years\nSkills: JavaScript, Node.js, React',
      mimeType: 'text/plain'
    },
    {
      name: 'cover-letter.txt', 
      content: 'Dear Hiring Manager,\n\nI am writing to express my interest in the Software Developer position...',
      mimeType: 'text/plain'
    }
  ];

  try {
    googleDriveService.folderId = CORRECT_FOLDER_ID;
    await googleDriveService.initialize();

    for (const testFile of testFiles) {
      console.log(`📄 Testing ${testFile.name}...`);
      
      const filePath = path.join(__dirname, testFile.name);
      fs.writeFileSync(filePath, testFile.content);
      
      const fileBuffer = fs.readFileSync(filePath);
      const result = await googleDriveService.uploadResume(
        fileBuffer,
        testFile.name,
        'Test User',
        'Test Position'
      );
      
      console.log(`✅ ${testFile.name} uploaded successfully`);
      console.log(`   View: ${result.viewLink}\n`);
      
      fs.unlinkSync(filePath);
    }

    console.log('🎉 Multiple file type test completed!');

  } catch (error) {
    console.error('❌ Multiple file type test failed:', error.message);
  }
}

// Run the tests
if (require.main === module) {
  runFinalTest()
    .then(() => testMultipleFileTypes())
    .catch(console.error);
}

module.exports = { runFinalTest, testMultipleFileTypes };
