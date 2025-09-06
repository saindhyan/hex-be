// Email template for internship owner notification
const ownerNotificationTemplate = (applicationData) => {
  const {
    applicant,
    internship,
    submittedAt
  } = applicationData;

  const subject = `New Application Received: ${internship.title} - ${applicant.firstName} ${applicant.lastName}`;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Internship Application</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f8f9fa;
            }
            .container {
                background-color: white;
                border-radius: 8px;
                padding: 30px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 20px;
                border-radius: 8px 8px 0 0;
                margin: -30px -30px 30px -30px;
                text-align: center;
            }
            .header h1 {
                margin: 0;
                font-size: 24px;
            }
            .alert {
                background-color: #e3f2fd;
                border-left: 4px solid #2196f3;
                padding: 15px;
                margin: 20px 0;
                border-radius: 4px;
            }
            .info-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 20px;
                margin: 20px 0;
            }
            .info-item {
                background-color: #f8f9fa;
                padding: 15px;
                border-radius: 6px;
                border-left: 3px solid #667eea;
            }
            .info-label {
                font-weight: bold;
                color: #667eea;
                font-size: 12px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-bottom: 5px;
            }
            .info-value {
                font-size: 14px;
                color: #333;
            }
            .cover-letter {
                background-color: #f8f9fa;
                padding: 20px;
                border-radius: 6px;
                margin: 20px 0;
                border-left: 3px solid #28a745;
            }
            .cover-letter h3 {
                margin-top: 0;
                color: #28a745;
            }
            .action-buttons {
                text-align: center;
                margin: 30px 0;
            }
            .btn {
                display: inline-block;
                padding: 12px 24px;
                margin: 0 10px;
                text-decoration: none;
                border-radius: 6px;
                font-weight: bold;
                text-align: center;
            }
            .btn-primary {
                background-color: #667eea;
                color: white;
            }
            .btn-secondary {
                background-color: #6c757d;
                color: white;
            }
            .footer {
                text-align: center;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #e9ecef;
                color: #6c757d;
                font-size: 12px;
            }
            @media (max-width: 600px) {
                .info-grid {
                    grid-template-columns: 1fr;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎯 New Internship Application</h1>
                <p style="margin: 5px 0 0 0; opacity: 0.9;">HexSyn Platform</p>
            </div>

            <div class="alert">
                <strong>📧 New Application Alert!</strong><br>
                You have received a new application for your internship position.
            </div>

            <h2 style="color: #667eea; margin-bottom: 20px;">📋 Internship Details</h2>
            <div class="info-grid">
                <div class="info-item">
                    <div class="info-label">Position</div>
                    <div class="info-value">${internship.title}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Company</div>
                    <div class="info-value">${internship.company}</div>
                </div>
            </div>

            <h2 style="color: #667eea; margin-bottom: 20px;">👤 Applicant Information</h2>
            <div class="info-grid">
                <div class="info-item">
                    <div class="info-label">Full Name</div>
                    <div class="info-value">${applicant.firstName} ${applicant.lastName}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Email</div>
                    <div class="info-value">${applicant.email}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Phone</div>
                    <div class="info-value">${applicant.phone}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">University</div>
                    <div class="info-value">${applicant.university}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Major</div>
                    <div class="info-value">${applicant.major}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Graduation Year</div>
                    <div class="info-value">${applicant.graduationYear}</div>
                </div>
                ${applicant.gpa ? `
                <div class="info-item">
                    <div class="info-label">GPA</div>
                    <div class="info-value">${applicant.gpa}</div>
                </div>
                ` : ''}
                <div class="info-item">
                    <div class="info-label">Availability</div>
                    <div class="info-value">${applicant.availability}</div>
                </div>
            </div>

            ${applicant.linkedin || applicant.portfolio ? `
            <h3 style="color: #667eea; margin-bottom: 15px;">🔗 Links</h3>
            <div class="info-grid">
                ${applicant.linkedin ? `
                <div class="info-item">
                    <div class="info-label">LinkedIn</div>
                    <div class="info-value"><a href="${applicant.linkedin}" style="color: #0077b5;">${applicant.linkedin}</a></div>
                </div>
                ` : ''}
                ${applicant.portfolio ? `
                <div class="info-item">
                    <div class="info-label">Portfolio</div>
                    <div class="info-value"><a href="${applicant.portfolio}" style="color: #667eea;">${applicant.portfolio}</a></div>
                </div>
                ` : ''}
            </div>
            ` : ''}

            <div class="cover-letter">
                <h3>📝 Cover Letter</h3>
                <p style="margin: 0; white-space: pre-wrap;">${applicant.coverLetter}</p>
            </div>

            <div class="action-buttons">
                <a href="mailto:${applicant.email}" class="btn btn-primary">📧 Contact Applicant</a>
                <a href="#" class="btn btn-secondary">📁 View Full Application</a>
            </div>

            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 6px; margin: 20px 0;">
                <strong>📅 Application Submitted:</strong> ${new Date(submittedAt).toLocaleString()}
            </div>

            <div class="footer">
                <p>This email was sent automatically by the HexSyn platform.</p>
                <p>© ${new Date().getFullYear()} HexSyn. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
  `;

  const text = `
New Internship Application Received

Position: ${internship.title}
Company: ${internship.company}

Applicant Details:
- Name: ${applicant.firstName} ${applicant.lastName}
- Email: ${applicant.email}
- Phone: ${applicant.phone}
- University: ${applicant.university}
- Major: ${applicant.major}
- Graduation Year: ${applicant.graduationYear}
${applicant.gpa ? `- GPA: ${applicant.gpa}` : ''}
- Availability: ${applicant.availability}
${applicant.linkedin ? `- LinkedIn: ${applicant.linkedin}` : ''}
${applicant.portfolio ? `- Portfolio: ${applicant.portfolio}` : ''}

Cover Letter:
${applicant.coverLetter}

Application submitted on: ${new Date(submittedAt).toLocaleString()}

You can contact the applicant directly at: ${applicant.email}
  `;

  return {
    subject,
    html,
    text
  };
};

module.exports = ownerNotificationTemplate;
