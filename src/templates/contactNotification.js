const contactNotificationTemplate = (contactData) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    company,
    subject,
    message,
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

  const subject_line = `New Contact Form Submission: ${subject}`;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Contact Form Submission</title>
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
        .inquiry-type {
          display: inline-block;
          background: rgba(255, 255, 255, 0.2);
          padding: 5px 15px;
          border-radius: 20px;
          font-size: 14px;
          margin-top: 10px;
        }
        .section {
          margin-bottom: 25px;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 8px;
          border-left: 4px solid #667eea;
        }
        .section h3 {
          margin: 0 0 15px 0;
          color: #667eea;
          font-size: 18px;
        }
        .field-group {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          margin-bottom: 15px;
        }
        .field {
          margin-bottom: 10px;
        }
        .field-label {
          font-weight: 600;
          color: #555;
          margin-bottom: 5px;
          display: block;
        }
        .field-value {
          color: #333;
          padding: 8px 12px;
          background: white;
          border-radius: 4px;
          border: 1px solid #ddd;
        }
        .message-content {
          background: white;
          padding: 20px;
          border-radius: 8px;
          border: 1px solid #ddd;
          white-space: pre-wrap;
          line-height: 1.6;
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
        .action-buttons {
          margin-top: 20px;
          text-align: center;
        }
        .btn {
          display: inline-block;
          padding: 12px 24px;
          background: #667eea;
          color: white;
          text-decoration: none;
          border-radius: 6px;
          margin: 0 10px;
          font-weight: 500;
        }
        .btn:hover {
          background: #5a67d8;
        }
        @media (max-width: 600px) {
          .field-group {
            grid-template-columns: 1fr;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📧 New Contact Form Submission</h1>
          <div class="inquiry-type">${inquiryTypeLabels[inquiryType] || inquiryType}</div>
        </div>

        <div class="section">
          <h3>👤 Contact Information</h3>
          <div class="field-group">
            <div class="field">
              <span class="field-label">Name:</span>
              <div class="field-value">${firstName} ${lastName}</div>
            </div>
            <div class="field">
              <span class="field-label">Email:</span>
              <div class="field-value">
                <a href="mailto:${email}" style="color: #667eea; text-decoration: none;">${email}</a>
              </div>
            </div>
          </div>
          <div class="field-group">
            <div class="field">
              <span class="field-label">Phone:</span>
              <div class="field-value">${phone || 'Not provided'}</div>
            </div>
            <div class="field">
              <span class="field-label">Company:</span>
              <div class="field-value">${company || 'Not provided'}</div>
            </div>
          </div>
        </div>

        <div class="section">
          <h3>📝 Message Details</h3>
          <div class="field">
            <span class="field-label">Subject:</span>
            <div class="field-value">${subject}</div>
          </div>
          <div class="field">
            <span class="field-label">Message:</span>
            <div class="message-content">${message}</div>
          </div>
        </div>

        <div class="action-buttons">
          <a href="mailto:${email}?subject=Re: ${encodeURIComponent(subject)}" class="btn">
            📧 Reply to ${firstName}
          </a>
          <a href="https://docs.google.com/spreadsheets/d/${process.env.GOOGLE_SHEETS_ID}/edit#gid=0" class="btn" target="_blank" style="background: #28a745;">
            📊 View in Google Sheets
          </a>
        </div>

        <div class="footer">
          <p><strong>HexSyn Data Solutions</strong> - Contact Form Notification</p>
          <div class="timestamp">
            Submitted on: ${formattedDate}<br>
            <strong>📊 Data Logged:</strong> <a href="https://docs.google.com/spreadsheets/d/${process.env.GOOGLE_SHEETS_ID}/edit#gid=0" target="_blank" style="color: #667eea;">View ContactUs Sheet</a>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
NEW CONTACT FORM SUBMISSION

Contact Information:
- Name: ${firstName} ${lastName}
- Email: ${email}
- Phone: ${phone || 'Not provided'}
- Company: ${company || 'Not provided'}
- Inquiry Type: ${inquiryTypeLabels[inquiryType] || inquiryType}

Message Details:
- Subject: ${subject}
- Message: ${message}

Submitted on: ${formattedDate}

Reply to this inquiry: ${email}

View all contact forms in Google Sheets: https://docs.google.com/spreadsheets/d/${process.env.GOOGLE_SHEETS_ID}/edit#gid=0
  `;

  return {
    subject: subject_line,
    html,
    text
  };
};

module.exports = contactNotificationTemplate;
