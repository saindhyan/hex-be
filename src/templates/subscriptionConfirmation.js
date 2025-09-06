const subscriptionConfirmationTemplate = (subscriptionData) => {
  const {
    email,
    subscriptionType,
    source,
    interests,
    subscribedAt
  } = subscriptionData;

  const subscriptionTypeLabels = {
    platform_updates: 'Platform Updates',
    newsletter: 'Newsletter',
    opportunities: 'Opportunities',
    announcements: 'Announcements'
  };

  const interestLabels = {
    platform_launch: 'Platform Launch',
    new_features: 'New Features',
    opportunities: 'Opportunities',
    partnerships: 'Partnerships',
    events: 'Events',
    updates: 'General Updates'
  };

  const formattedDate = new Date(subscribedAt).toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });

  const subject_line = `Welcome to HexSyn Updates - Subscription Confirmed!`;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Subscription Confirmed</title>
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
        .interests-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 5px;
        }
        .interest-tag {
          background: #e8f4fd;
          color: #2196f3;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 500;
        }
        .benefits {
          background: #e8f5e8;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
          border-left: 4px solid #4caf50;
        }
        .benefits h3 {
          margin: 0 0 15px 0;
          color: #4caf50;
          font-size: 18px;
        }
        .benefits ul {
          margin: 0;
          padding-left: 20px;
        }
        .benefits li {
          margin-bottom: 8px;
        }
        .manage-subscription {
          background: #fff3cd;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
          border-left: 4px solid #ffc107;
        }
        .manage-subscription h3 {
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
          <div class="checkmark">🎉</div>
          <h1>Subscription Confirmed!</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Welcome to the HexSyn community</p>
        </div>

        <div class="content">
          <p>Hello there,</p>
          
          <p>Thank you for subscribing to HexSyn updates! We're excited to keep you informed about our latest developments and opportunities.</p>

          <div class="summary-box">
            <h3>📋 Your Subscription Details</h3>
            <div class="summary-item">
              <span class="summary-label">Email:</span>
              <span class="summary-value">${email}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Subscription Type:</span>
              <span class="summary-value">${subscriptionTypeLabels[subscriptionType] || subscriptionType}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Source:</span>
              <span class="summary-value">${source}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Your Interests:</span>
              <div class="interests-list">
                ${interests.map(interest => `<span class="interest-tag">${interestLabels[interest] || interest}</span>`).join('')}
              </div>
            </div>
            <div class="summary-item">
              <span class="summary-label">Subscribed:</span>
              <span class="summary-value">${formattedDate}</span>
            </div>
          </div>

          <div class="benefits">
            <h3>🚀 What You'll Receive</h3>
            <ul>
              <li><strong>Platform Updates:</strong> Be the first to know about new features and improvements</li>
              <li><strong>Exclusive Opportunities:</strong> Early access to internships and career opportunities</li>
              <li><strong>Industry Insights:</strong> Valuable content about data science and technology trends</li>
              <li><strong>Event Notifications:</strong> Invitations to webinars, workshops, and networking events</li>
              <li><strong>Community Access:</strong> Connect with like-minded professionals and students</li>
            </ul>
          </div>

          <div class="manage-subscription">
            <h3>⚙️ Manage Your Subscription</h3>
            <p>You can update your preferences or unsubscribe at any time by contacting us at <strong>contact@hexsyndata.com</strong></p>
            <p>We respect your privacy and will never share your information with third parties.</p>
          </div>

          <p>We're building something amazing at HexSyn, and we're thrilled to have you along for the journey. Stay tuned for exciting updates!</p>

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
            Subscription confirmed on: ${formattedDate}
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
SUBSCRIPTION CONFIRMED - WELCOME TO HEXSYN UPDATES!

Hello there,

Thank you for subscribing to HexSyn updates! We're excited to keep you informed about our latest developments and opportunities.

Your Subscription Details:
- Email: ${email}
- Subscription Type: ${subscriptionTypeLabels[subscriptionType] || subscriptionType}
- Source: ${source}
- Your Interests: ${interests.map(interest => interestLabels[interest] || interest).join(', ')}
- Subscribed: ${formattedDate}

What You'll Receive:
- Platform Updates: Be the first to know about new features and improvements
- Exclusive Opportunities: Early access to internships and career opportunities
- Industry Insights: Valuable content about data science and technology trends
- Event Notifications: Invitations to webinars, workshops, and networking events
- Community Access: Connect with like-minded professionals and students

Manage Your Subscription:
You can update your preferences or unsubscribe at any time by contacting us at contact@hexsyndata.com
We respect your privacy and will never share your information with third parties.

We're building something amazing at HexSyn, and we're thrilled to have you along for the journey. Stay tuned for exciting updates!

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

module.exports = subscriptionConfirmationTemplate;
