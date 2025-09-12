// Test file to verify the career API implementation
// This file demonstrates how the career application API should work

const testCareerApplication = {
  firstName: "Piyush",
  lastName: "Saini", 
  email: "piyushsaini597@gmail.com",
  phone: "+919675028282",
  location: "Remote, OR",
  experience: "mid",
  availability: "1month",
  salary: "",
  coverLetter: "",
  portfolio: "",
  linkedin: "",
  github: "",
  agreeToTerms: true,
  allowContact: true,
  jobId: 1,
  jobTitle: "Senior Software Engineer",
  department: "Engineering"
};

console.log('Career Application Test Data:');
console.log(JSON.stringify(testCareerApplication, null, 2));

console.log('\nAPI Endpoint: POST /api/career');
console.log('Content-Type: multipart/form-data');
console.log('File field: resume (PDF only, max 10MB)');

console.log('\nExpected Response:');
console.log({
  message: 'Career application submitted successfully!',
  success: true,
  details: {
    applicant: 'Piyush Saini',
    email: 'piyushsaini597@gmail.com',
    jobTitle: 'Senior Software Engineer',
    jobId: 1,
    resumeUploaded: true,
    resumeLink: 'https://drive.google.com/file/d/...',
    submittedAt: new Date().toISOString()
  }
});

console.log('\nGoogle Sheets: Data will be logged to "Career Applications" sheet');
console.log('Google Drive: Resume will be uploaded with timestamp and applicant name');
