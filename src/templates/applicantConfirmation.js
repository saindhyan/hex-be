// Email template for applicant confirmation
const applicantConfirmationTemplate = (applicationData) => {
  const {
    applicant,
    internship,
    submittedAt
  } = applicationData;

  const subject = `Application Confirmed: ${internship.title} at ${internship.company}`;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Application Confirmation</title>
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
                background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
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
            .success-badge {
                background-color: #d4edda;
                border: 1px solid #c3e6cb;
                color: #155724;
                padding: 15px;
                border-radius: 6px;
                text-align: center;
                margin: 20px 0;
            }
            .success-badge .checkmark {
                font-size: 48px;
                color: #28a745;
                margin-bottom: 10px;
            }
            .info-section {
                background-color: #f8f9fa;
                padding: 20px;
                border-radius: 6px;
                margin: 20px 0;
                border-left: 4px solid #28a745;
            }
            .info-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 15px;
                margin: 15px 0;
            }
            .info-item {
                padding: 10px 0;
                border-bottom: 1px solid #e9ecef;
            }
            .info-label {
                font-weight: bold;
                color: #28a745;
                font-size: 12px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-bottom: 3px;
            }
            .info-value {
                font-size: 14px;
                color: #333;
            }
            .timeline {
                background-color: #e3f2fd;
                padding: 20px;
                border-radius: 6px;
                margin: 20px 0;
                border-left: 4px solid #2196f3;
            }
            .timeline h3 {
                margin-top: 0;
                color: #2196f3;
            }
            .timeline-item {
                display: flex;
                align-items: center;
                margin: 10px 0;
                padding: 8px 0;
            }
            .timeline-icon {
                width: 20px;
                height: 20px;
                background-color: #2196f3;
                border-radius: 50%;
                margin-right: 15px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 10px;
                font-weight: bold;
            }
            .tips {
                background-color: #fff3cd;
                border: 1px solid #ffeaa7;
                padding: 20px;
                border-radius: 6px;
                margin: 20px 0;
            }
            .tips h3 {
                margin-top: 0;
                color: #856404;
            }
            .tips ul {
                margin: 10px 0;
                padding-left: 20px;
            }
            .tips li {
                margin: 8px 0;
                color: #856404;
            }
            .contact-info {
                background-color: #f8f9fa;
                padding: 20px;
                border-radius: 6px;
                text-align: center;
                margin: 20px 0;
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
                <h1>🎉 Application Submitted Successfully!</h1>
                <p style="margin: 5px 0 0 0; opacity: 0.9;">HexSyn Platform</p>
            </div>

            <div class="success-badge">
                <div class="checkmark">✅</div>
                <h2 style="margin: 0; color: #155724;">Thank you, ${applicant.firstName}!</h2>
                <p style="margin: 5px 0 0 0;">Your application has been successfully submitted and received.</p>
            </div>

            <div class="info-section">
                <h3 style="margin-top: 0; color: #28a745;">📋 Application Summary</h3>
                <div class="info-grid">
                    <div class="info-item">
                        <div class="info-label">Position Applied For</div>
                        <div class="info-value">${internship.title}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Company</div>
                        <div class="info-value">${internship.company}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Application ID</div>
                        <div class="info-value">#${Date.now().toString().slice(-6)}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Submitted On</div>
                        <div class="info-value">${new Date(submittedAt).toLocaleDateString()}</div>
                    </div>
                </div>
            </div>

            <div class="timeline">
                <h3>📅 What Happens Next?</h3>
                <div class="timeline-item">
                    <div class="timeline-icon">1</div>
                    <div>
                        <strong>Application Review</strong><br>
                        <small>Our team will review your application within 1-2 business days</small>
                    </div>
                </div>
                <div class="timeline-item">
                    <div class="timeline-icon">2</div>
                    <div>
                        <strong>Initial Screening</strong><br>
                        <small>If selected, you'll receive an email for the next steps</small>
                    </div>
                </div>
                <div class="timeline-item">
                    <div class="timeline-icon">3</div>
                    <div>
                        <strong>Interview Process</strong><br>
                        <small>We'll schedule interviews with qualified candidates</small>
                    </div>
                </div>
                <div class="timeline-item">
                    <div class="timeline-icon">4</div>
                    <div>
                        <strong>Final Decision</strong><br>
                        <small>You'll hear back from us within 3-5 business days</small>
                    </div>
                </div>
            </div>

            <div class="tips">
                <h3>💡 Tips While You Wait</h3>
                <ul>
                    <li>Keep your email notifications on - we'll contact you via email</li>
                    <li>Continue applying to other positions that interest you</li>
                    <li>Update your LinkedIn profile and portfolio if needed</li>
                    <li>Prepare for potential interviews by researching the company</li>
                    <li>Have questions ready about the role and company culture</li>
                </ul>
            </div>

            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 6px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #667eea;">📧 Your Application Details</h3>
                <p><strong>Name:</strong> ${applicant.firstName} ${applicant.lastName}</p>
                <p><strong>Email:</strong> ${applicant.email}</p>
                <p><strong>University:</strong> ${applicant.university}</p>
                <p><strong>Major:</strong> ${applicant.major}</p>
                <p><strong>Expected Graduation:</strong> ${applicant.graduationYear}</p>
                <p><strong>Availability:</strong> ${applicant.availability}</p>
            </div>

            <div class="contact-info">
                <h3 style="color: #667eea;">📞 Need Help?</h3>
                <p>If you have any questions about your application or the internship, feel free to reach out to us.</p>
                <p>
                    <strong>Email:</strong> <a href="mailto:support@HexSyn.com" style="color: #667eea;">support@HexSyn.com</a><br>
                    <strong>Phone:</strong> +1 (555) 123-4567
                </p>
            </div>

            <div style="background-color: #e8f5e8; padding: 15px; border-radius: 6px; text-align: center; margin: 20px 0;">
                <p style="margin: 0; color: #28a745;"><strong>🔔 Keep an eye on your inbox!</strong></p>
                <p style="margin: 5px 0 0 0; font-size: 14px;">We'll send you updates about your application status.</p>
            </div>

            <div class="footer">
                <p>This confirmation was sent automatically by the HexSyn platform.</p>
                <p>© ${new Date().getFullYear()} HexSyn. All rights reserved.</p>
                <p style="margin-top: 10px;">
                    <a href="#" style="color: #667eea; text-decoration: none;">Unsubscribe</a> | 
                    <a href="#" style="color: #667eea; text-decoration: none;">Privacy Policy</a>
                </p>
            </div>
        </div>
    </body>
    </html>
  `;

  const text = `
Application Confirmation - ${internship.title} at ${internship.company}

Dear ${applicant.firstName} ${applicant.lastName},

Thank you for your application! We have successfully received your application for the ${internship.title} position at ${internship.company}.

Application Details:
- Position: ${internship.title}
- Company: ${internship.company}
- Application ID: #${Date.now().toString().slice(-6)}
- Submitted: ${new Date(submittedAt).toLocaleString()}

What happens next:
1. Application Review (1-2 business days)
2. Initial Screening (if selected)
3. Interview Process
4. Final Decision (3-5 business days)

Your Information:
- Name: ${applicant.firstName} ${applicant.lastName}
- Email: ${applicant.email}
- University: ${applicant.university}
- Major: ${applicant.major}
- Expected Graduation: ${applicant.graduationYear}
- Availability: ${applicant.availability}

We'll keep you updated via email about your application status. Please keep an eye on your inbox (including spam folder).

If you have any questions, feel free to contact us at support@HexSyn.com or +1 (555) 123-4567.

Best regards,
The HexSyn Team

© ${new Date().getFullYear()} HexSyn. All rights reserved.
  `;

  return {
    subject,
    html,
    text
  };
};

module.exports = applicantConfirmationTemplate;
