const careerAdminNotificationTemplate = (applicationData) => {
  const {
    firstName, lastName, email, phone, location, experience, availability,
    salary, coverLetter, portfolio, linkedin, github, agreeToTerms, allowContact,
    jobId, jobTitle, department, resumeLink, resumeFileName, submittedAt
  } = applicationData;

  const subject = `🚨 New Career Application: ${firstName} ${lastName} - ${jobTitle}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Career Application</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 800px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .section { background: white; margin: 20px 0; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .section h3 { color: #667eea; margin-top: 0; border-bottom: 2px solid #667eea; padding-bottom: 10px; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 15px 0; }
            .info-item { padding: 10px; background: #f8f9fa; border-radius: 5px; }
            .info-label { font-weight: bold; color: #555; display: block; margin-bottom: 5px; }
            .info-value { color: #333; }
            .highlight { background: #e3f2fd; border-left: 4px solid #2196f3; padding: 15px; margin: 15px 0; }
            .resume-link { background: #4caf50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 0; }
            .sheets-link { background: #0f9d58; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 0; }
            .footer { text-align: center; margin-top: 30px; padding: 20px; color: #666; font-size: 14px; }
            @media (max-width: 600px) {
                .info-grid { grid-template-columns: 1fr; }
                .container { padding: 10px; }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎯 New Career Application Received</h1>
                <p>A new candidate has applied for a position at HexSyn DataLabs</p>
            </div>
            
            <div class="content">
                <div class="highlight">
                    <strong>📋 Application Summary:</strong><br>
                    <strong>${firstName} ${lastName}</strong> has applied for <strong>${jobTitle}</strong> in the <strong>${department}</strong> department.
                </div>

                <div class="section">
                    <h3>👤 Candidate Information</h3>
                    <div class="info-grid">
                        <div class="info-item">
                            <span class="info-label">Full Name:</span>
                            <span class="info-value">${firstName} ${lastName}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Email:</span>
                            <span class="info-value">${email}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Phone:</span>
                            <span class="info-value">${phone}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Location:</span>
                            <span class="info-value">${location}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Experience Level:</span>
                            <span class="info-value">${experience.charAt(0).toUpperCase() + experience.slice(1)}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Availability:</span>
                            <span class="info-value">${availability}</span>
                        </div>
                    </div>
                </div>

                <div class="section">
                    <h3>💼 Position Details</h3>
                    <div class="info-grid">
                        <div class="info-item">
                            <span class="info-label">Job ID:</span>
                            <span class="info-value">#${jobId}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Job Title:</span>
                            <span class="info-value">${jobTitle}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Department:</span>
                            <span class="info-value">${department}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Salary Expectation:</span>
                            <span class="info-value">${salary || 'Not specified'}</span>
                        </div>
                    </div>
                </div>

                ${portfolio || linkedin || github ? `
                <div class="section">
                    <h3>🔗 Professional Links</h3>
                    <div class="info-grid">
                        ${portfolio ? `
                        <div class="info-item">
                            <span class="info-label">Portfolio:</span>
                            <span class="info-value"><a href="${portfolio}" target="_blank">${portfolio}</a></span>
                        </div>
                        ` : ''}
                        ${linkedin ? `
                        <div class="info-item">
                            <span class="info-label">LinkedIn:</span>
                            <span class="info-value"><a href="${linkedin}" target="_blank">${linkedin}</a></span>
                        </div>
                        ` : ''}
                        ${github ? `
                        <div class="info-item">
                            <span class="info-label">GitHub:</span>
                            <span class="info-value"><a href="${github}" target="_blank">${github}</a></span>
                        </div>
                        ` : ''}
                    </div>
                </div>
                ` : ''}

                ${coverLetter ? `
                <div class="section">
                    <h3>📝 Cover Letter</h3>
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; white-space: pre-wrap;">${coverLetter}</div>
                </div>
                ` : ''}

                <div class="section">
                    <h3>📄 Documents & Data</h3>
                    <div style="text-align: center;">
                        ${resumeLink ? `
                        <a href="${resumeLink}" class="resume-link" target="_blank">
                            📄 View Resume: ${resumeFileName}
                        </a><br>
                        ` : '<p>No resume uploaded</p>'}
                        
                        <a href="https://docs.google.com/spreadsheets/d/${process.env.GOOGLE_SHEETS_ID}" class="sheets-link" target="_blank">
                            📊 View All Applications in Google Sheets
                        </a>
                    </div>
                </div>

                <div class="section">
                    <h3>✅ Consent & Agreements</h3>
                    <div class="info-grid">
                        <div class="info-item">
                            <span class="info-label">Agreed to Terms:</span>
                            <span class="info-value">${agreeToTerms ? '✅ Yes' : '❌ No'}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Allow Contact:</span>
                            <span class="info-value">${allowContact ? '✅ Yes' : '❌ No'}</span>
                        </div>
                    </div>
                </div>

                <div class="section">
                    <h3>⏰ Application Details</h3>
                    <div class="info-item">
                        <span class="info-label">Submitted At:</span>
                        <span class="info-value">${new Date(submittedAt).toLocaleString()}</span>
                    </div>
                </div>
            </div>

            <div class="footer">
                <p>This application was automatically processed by the HexSyn DataLabs career portal.</p>
                <p>Please review the candidate's information and resume, then follow up accordingly.</p>
            </div>
        </div>
    </body>
    </html>
  `;

  const text = `
New Career Application Received

Candidate: ${firstName} ${lastName}
Position: ${jobTitle} (${department})
Job ID: #${jobId}

Contact Information:
- Email: ${email}
- Phone: ${phone}
- Location: ${location}

Professional Details:
- Experience Level: ${experience}
- Availability: ${availability}
- Salary Expectation: ${salary || 'Not specified'}

${portfolio ? `Portfolio: ${portfolio}` : ''}
${linkedin ? `LinkedIn: ${linkedin}` : ''}
${github ? `GitHub: ${github}` : ''}

${coverLetter ? `Cover Letter:\n${coverLetter}` : ''}

Resume: ${resumeLink || 'No resume uploaded'}

Consent:
- Agreed to Terms: ${agreeToTerms ? 'Yes' : 'No'}
- Allow Contact: ${allowContact ? 'Yes' : 'No'}

Submitted: ${new Date(submittedAt).toLocaleString()}

View all applications: https://docs.google.com/spreadsheets/d/${process.env.GOOGLE_SHEETS_ID}
  `;

  return { subject, html, text };
};

module.exports = careerAdminNotificationTemplate;
