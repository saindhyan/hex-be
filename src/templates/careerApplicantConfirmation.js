const careerApplicantConfirmationTemplate = (applicationData) => {
  const {
    firstName, lastName, email, jobTitle, department, jobId, submittedAt
  } = applicationData;

  const subject = `✅ Application Received - ${jobTitle} at HexSyn DataLabs`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Application Confirmation</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .section { background: white; margin: 20px 0; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .highlight { background: #e8f5e8; border-left: 4px solid #4caf50; padding: 15px; margin: 15px 0; }
            .info-box { background: #f0f7ff; border: 1px solid #2196f3; border-radius: 5px; padding: 15px; margin: 15px 0; }
            .next-steps { background: #fff3e0; border-left: 4px solid #ff9800; padding: 15px; margin: 15px 0; }
            .footer { text-align: center; margin-top: 30px; padding: 20px; color: #666; font-size: 14px; }
            .button { background: #667eea; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 0; }
            ul { padding-left: 20px; }
            li { margin: 8px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎉 Application Received!</h1>
                <p>Thank you for applying to HexSyn DataLabs</p>
            </div>
            
            <div class="content">
                <div class="highlight">
                    <strong>Dear ${firstName},</strong><br><br>
                    Thank you for your interest in the <strong>${jobTitle}</strong> position in our <strong>${department}</strong> department. 
                    We have successfully received your application and it is now under review.
                </div>

                <div class="section">
                    <h3>📋 Application Summary</h3>
                    <div class="info-box">
                        <strong>Position:</strong> ${jobTitle}<br>
                        <strong>Department:</strong> ${department}<br>
                        <strong>Job ID:</strong> #${jobId}<br>
                        <strong>Submitted:</strong> ${new Date(submittedAt).toLocaleString()}<br>
                        <strong>Application ID:</strong> CAREER_${Date.now()}
                    </div>
                </div>

                <div class="section">
                    <h3>⏭️ What Happens Next?</h3>
                    <div class="next-steps">
                        <ul>
                            <li><strong>Application Review:</strong> Our HR team will review your application and resume within 3-5 business days.</li>
                            <li><strong>Initial Screening:</strong> If your profile matches our requirements, we'll contact you for an initial phone/video screening.</li>
                            <li><strong>Technical Assessment:</strong> Depending on the role, you may be invited to complete a technical assessment or coding challenge.</li>
                            <li><strong>Final Interview:</strong> Successful candidates will be invited for final interviews with the hiring team.</li>
                            <li><strong>Decision:</strong> We'll notify you of our decision within 2 weeks of your final interview.</li>
                        </ul>
                    </div>
                </div>

                <div class="section">
                    <h3>📞 Contact Information</h3>
                    <p>If you have any questions about your application or the hiring process, please don't hesitate to reach out:</p>
                    <ul>
                        <li><strong>Email:</strong> careers@hexsyndatalabs.com</li>
                        <li><strong>Phone:</strong> +1 (555) 123-4567</li>
                        <li><strong>LinkedIn:</strong> <a href="https://linkedin.com/company/hexsyn-datalabs">HexSyn DataLabs</a></li>
                    </ul>
                </div>

                <div class="section">
                    <h3>🌟 About HexSyn DataLabs</h3>
                    <p>While you wait, feel free to learn more about our company culture, mission, and the exciting projects we're working on:</p>
                    <div style="text-align: center;">
                        <a href="https://hexsyndatalabs.com/about" class="button">Learn About Us</a>
                        <a href="https://hexsyndatalabs.com/careers" class="button">View Other Opportunities</a>
                    </div>
                </div>

                <div class="section">
                    <h3>💡 Tips for Success</h3>
                    <ul>
                        <li>Keep an eye on your email for updates from our team</li>
                        <li>Prepare for potential technical questions related to the role</li>
                        <li>Research our company and recent projects</li>
                        <li>Have questions ready about the role and team</li>
                    </ul>
                </div>
            </div>

            <div class="footer">
                <p>Thank you again for your interest in joining the HexSyn DataLabs team!</p>
                <p>We're excited to learn more about you and explore how you can contribute to our mission.</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="font-size: 12px; color: #999;">
                    This is an automated confirmation email. Please do not reply to this message.<br>
                    For questions, contact us at careers@hexsyndatalabs.com
                </p>
            </div>
        </div>
    </body>
    </html>
  `;

  const text = `
Application Confirmation - ${jobTitle} at HexSyn DataLabs

Dear ${firstName},

Thank you for your interest in the ${jobTitle} position in our ${department} department. 
We have successfully received your application and it is now under review.

Application Summary:
- Position: ${jobTitle}
- Department: ${department}
- Job ID: #${jobId}
- Submitted: ${new Date(submittedAt).toLocaleString()}
- Application ID: CAREER_${Date.now()}

What Happens Next?
1. Application Review: Our HR team will review your application and resume within 3-5 business days.
2. Initial Screening: If your profile matches our requirements, we'll contact you for an initial phone/video screening.
3. Technical Assessment: Depending on the role, you may be invited to complete a technical assessment or coding challenge.
4. Final Interview: Successful candidates will be invited for final interviews with the hiring team.
5. Decision: We'll notify you of our decision within 2 weeks of your final interview.

Contact Information:
- Email: careers@hexsyndatalabs.com
- Phone: +1 (555) 123-4567
- LinkedIn: https://linkedin.com/company/hexsyn-datalabs

Tips for Success:
- Keep an eye on your email for updates from our team
- Prepare for potential technical questions related to the role
- Research our company and recent projects
- Have questions ready about the role and team

Thank you again for your interest in joining the HexSyn DataLabs team!
We're excited to learn more about you and explore how you can contribute to our mission.

---
This is an automated confirmation email. Please do not reply to this message.
For questions, contact us at careers@hexsyndatalabs.com
  `;

  return { subject, html, text };
};

module.exports = careerApplicantConfirmationTemplate;
