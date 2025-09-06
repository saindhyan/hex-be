const contactConfirmationTemplate = (contactData) => {
  const {
    firstName,
    lastName,
    email,
    subject,
    inquiryType,
    submittedAt
  } = contactData;

  const inquiryTypeLabels = {
    general: 'General Inquiry',
    internship: 'Internship Information',
    partnership: 'Partnership Opportunity',
    support: 'Technical Support',
    careers: 'Career Opportunities',
    media: 'Media & Press'
  };

  const formattedDate = new Date(submittedAt).toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });

  const subject_line = `Thank you for contacting HexSyn - We've received your message`;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Thank you for contacting us</title>
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
          background: white;
          border-radius: 12px;
          padding: 30px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 25px;
          border-radius: 8px;
          margin-bottom: 30px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
          font-weight: 600;
        }
        .checkmark {
          font-size: 48px;
          margin-bottom: 10px;
        }
        .content {
          padding: 0 20px;
        }
        .summary-box {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          border-left: 4px solid #667eea;
          margin: 20px 0;
        }
        .summary-box h3 {
          margin: 0 0 15px 0;
          color: #667eea;
          font-size: 18px;
        }
        .summary-item {
          margin-bottom: 8px;
        }
        .summary-label {
          font-weight: 600;
          color: #555;
        }
        .summary-value {
          color: #333;
        }
        .next-steps {
          background: #e8f4fd;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
          border-left: 4px solid #2196f3;
        }
        .next-steps h3 {
          margin: 0 0 15px 0;
          color: #2196f3;
          font-size: 18px;
        }
        .next-steps ul {
          margin: 0;
          padding-left: 20px;
        }
        .next-steps li {
          margin-bottom: 8px;
        }
        .contact-info {
          background: #fff3cd;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
          border-left: 4px solid #ffc107;
        }
        .contact-info h3 {
          margin: 0 0 15px 0;
          color: #856404;
          font-size: 18px;
        }
        .footer {
          margin-top: 30px;
          padding: 20px;
          background: #f1f3f4;
          border-radius: 8px;
          text-align: center;
          font-size: 14px;
          color: #666;
        }
        .timestamp {
          font-size: 12px;
          color: #888;
          margin-top: 10px;
        }
        .social-links {
          margin-top: 15px;
        }
        .social-links a {
          display: inline-block;
          margin: 0 10px;
          color: #667eea;
          text-decoration: none;
          font-weight: 500;
        }
        .social-links a:hover {
          text-decoration: underline;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="checkmark">✅</div>
          <h1>Message Received!</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Thank you for reaching out to us</p>
        </div>

        <div class="content">
          <p>Hi <strong>${firstName}</strong>,</p>
          
          <p>Thank you for contacting HexSyn Data Solutions! We've successfully received your message and wanted to confirm the details with you.</p>

          <div class="summary-box">
            <h3>📋 Your Submission Summary</h3>
            <div class="summary-item">
              <span class="summary-label">Subject:</span>
              <span class="summary-value">${subject}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Inquiry Type:</span>
              <span class="summary-value">${inquiryTypeLabels[inquiryType] || inquiryType}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Submitted:</span>
              <span class="summary-value">${formattedDate}</span>
            </div>
          </div>

          <div class="next-steps">
            <h3>🚀 What Happens Next?</h3>
            <ul>
              <li><strong>Response Time:</strong> We typically respond within 24 hours during business days</li>
              <li><strong>Review Process:</strong> Our team will carefully review your inquiry and prepare a personalized response</li>
              <li><strong>Follow-up:</strong> You'll receive a detailed response at <strong>${email}</strong></li>
              <li><strong>Urgent Matters:</strong> For time-sensitive inquiries, feel free to call us directly</li>
            </ul>
          </div>

          <div class="contact-info">
            <h3>📞 Need Immediate Assistance?</h3>
            <p><strong>Email:</strong> contact@hexsyndata.com</p>
            <p><strong>Phone:</strong> +1 (555) 123-4567</p>
            <p><strong>Business Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM PST</p>
          </div>

          <p>We're excited to learn more about your needs and explore how HexSyn can help you achieve your goals. Our team is committed to providing you with the best possible service and solutions.</p>

          <p>Best regards,<br>
          <strong>The HexSyn Team</strong></p>
        </div>

        <div class="footer">
          <p><strong>HexSyn Data Solutions</strong></p>
          <p>Empowering careers through innovative technology solutions</p>
          
          <div class="social-links">
            <a href="#">LinkedIn</a>
            <a href="#">Twitter</a>
            <a href="#">Website</a>
          </div>
          
          <div class="timestamp">
            This confirmation was sent on: ${formattedDate}
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
THANK YOU FOR CONTACTING HEXSYN DATA SOLUTIONS

Hi ${firstName},

Thank you for reaching out to us! We've successfully received your message.

Your Submission Summary:
- Subject: ${subject}
- Inquiry Type: ${inquiryTypeLabels[inquiryType] || inquiryType}
- Submitted: ${formattedDate}

What Happens Next?
- Response Time: We typically respond within 24 hours during business days
- Review Process: Our team will carefully review your inquiry and prepare a personalized response
- Follow-up: You'll receive a detailed response at ${email}
- Urgent Matters: For time-sensitive inquiries, feel free to call us directly

Need Immediate Assistance?
- Email: contact@hexsyndata.com
- Phone: +1 (555) 123-4567
- Business Hours: Monday - Friday, 9:00 AM - 6:00 PM PST

We're excited to learn more about your needs and explore how HexSyn can help you achieve your goals.

Best regards,
The HexSyn Team

---
HexSyn Data Solutions
Empowering careers through innovative technology solutions
  `;

  return {
    subject: subject_line,
    html,
    text
  };
};

module.exports = contactConfirmationTemplate;
