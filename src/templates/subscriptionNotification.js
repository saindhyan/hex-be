const subscriptionNotificationTemplate = (subscriptionData) => {
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

  const subject_line = `New Subscription: ${email} - ${subscriptionTypeLabels[subscriptionType] || subscriptionType}`;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Subscription Notification</title>
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
        .subscription-type {
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
        .stats-section {
          background: #e8f5e8;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
          border-left: 4px solid #4caf50;
        }
        .stats-section h3 {
          margin: 0 0 15px 0;
          color: #4caf50;
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
          <h1>📧 New Subscription Alert</h1>
          <div class="subscription-type">${subscriptionTypeLabels[subscriptionType] || subscriptionType}</div>
        </div>

        <div class="section">
          <h3>👤 Subscriber Information</h3>
          <div class="field-group">
            <div class="field">
              <span class="field-label">Email:</span>
              <div class="field-value">
                <a href="mailto:${email}" style="color: #667eea; text-decoration: none;">${email}</a>
              </div>
            </div>
            <div class="field">
              <span class="field-label">Source:</span>
              <div class="field-value">${source}</div>
            </div>
          </div>
          <div class="field">
            <span class="field-label">Subscription Type:</span>
            <div class="field-value">${subscriptionTypeLabels[subscriptionType] || subscriptionType}</div>
          </div>
        </div>

        <div class="section">
          <h3>🎯 Interests & Preferences</h3>
          <div class="field">
            <span class="field-label">Selected Interests:</span>
            <div class="interests-list">
              ${interests.map(interest => `<span class="interest-tag">${interestLabels[interest] || interest}</span>`).join('')}
            </div>
          </div>
        </div>

        <div class="stats-section">
          <h3>📊 Quick Actions</h3>
          <ul style="margin: 0; padding-left: 20px;">
            <li>Add to mailing list: ${subscriptionTypeLabels[subscriptionType] || subscriptionType}</li>
            <li>Tag interests: ${interests.map(interest => interestLabels[interest] || interest).join(', ')}</li>
            <li>Source tracking: ${source}</li>
            <li>Follow up if needed for high-value subscribers</li>
          </ul>
        </div>

        <div class="action-buttons">
          <a href="mailto:${email}?subject=Welcome to HexSyn!" class="btn">
            📧 Send Welcome Email
          </a>
        </div>

        <div class="footer">
          <p><strong>HexSyn Data Solutions</strong> - Subscription Notification</p>
          <div class="timestamp">
            Subscribed on: ${formattedDate}
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
NEW SUBSCRIPTION NOTIFICATION

Subscriber Information:
- Email: ${email}
- Source: ${source}
- Subscription Type: ${subscriptionTypeLabels[subscriptionType] || subscriptionType}

Interests & Preferences:
- Selected Interests: ${interests.map(interest => interestLabels[interest] || interest).join(', ')}

Quick Actions:
- Add to mailing list: ${subscriptionTypeLabels[subscriptionType] || subscriptionType}
- Tag interests: ${interests.map(interest => interestLabels[interest] || interest).join(', ')}
- Source tracking: ${source}
- Follow up if needed for high-value subscribers

Subscribed on: ${formattedDate}

Contact subscriber: ${email}
  `;

  return {
    subject: subject_line,
    html,
    text
  };
};

module.exports = subscriptionNotificationTemplate;
