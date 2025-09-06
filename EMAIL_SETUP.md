# Email Setup Instructions

This guide will help you configure email functionality for the JobScribe application, including both application submissions and contact form emails.

## Prerequisites

1. **Gmail Account** (recommended) or any SMTP-compatible email service
2. **App Password** for Gmail (required for security)

## Gmail Setup (Recommended)

### Step 1: Enable 2-Factor Authentication
1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Navigate to **Security** → **2-Step Verification**
3. Enable 2-Factor Authentication if not already enabled

### Step 2: Generate App Password
1. In Google Account Settings, go to **Security**
2. Under "2-Step Verification", click **App passwords**
3. Select **Mail** and **Other (Custom name)**
4. Enter "JobScribe Server" as the name
5. Copy the generated 16-character password

### Step 3: Configure Environment Variables
1. Copy `.env.example` to `.env` in the server directory:
   ```bash
   cp .env.example .env
   ```

2. Edit the `.env` file with your email configuration:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:8081

   # SMTP Configuration
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-16-character-app-password

   # Email Configuration
   FROM_NAME=HexSyn DataLabs Team
   FROM_EMAIL=your-email@gmail.com
   REPLY_TO_EMAIL=your-email@gmail.com
   ADMIN_EMAIL=your-admin-email@gmail.com

   # Security
   JWT_SECRET=your-secure-random-string-here
   ```

## Alternative SMTP Providers

### Outlook/Hotmail
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
```

### Yahoo Mail
```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_USER=your-email@yahoo.com
SMTP_PASS=your-app-password
```

### Custom SMTP Server
```env
SMTP_HOST=your-smtp-server.com
SMTP_PORT=587
SMTP_USER=your-username
SMTP_PASS=your-password
```

## Testing Email Configuration

### 1. Start the Server
```bash
cd server
npm install
npm run dev
```

### 2. Test SMTP Connection
```bash
curl -X GET http://localhost:5000/api/email/test-connection
```

Expected response:
```json
{
  "success": true,
  "message": "SMTP connection successful"
}
```

### 3. Test Contact Form Email
```bash
curl -X POST http://localhost:5000/api/email/send-contact \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "subject": "Test Message",
    "message": "This is a test message",
    "inquiryType": "general"
  }'
```

## Email Templates

The application includes professionally designed email templates:

### Application Emails
- **Owner Notification**: Sent to internship/job owners when someone applies
- **Applicant Confirmation**: Sent to applicants confirming their submission

### Contact Form Emails
- **Admin Notification**: Sent to admin when someone submits contact form
- **User Confirmation**: Sent to users confirming their message was received

## API Endpoints

### Application Emails
- `POST /api/email/send-application` - Send both owner and applicant emails
- `POST /api/email/send-owner-notification` - Send only owner notification
- `POST /api/email/send-applicant-confirmation` - Send only applicant confirmation

### Contact Form Emails
- `POST /api/email/send-contact` - Send both admin and user emails
- `POST /api/email/send-contact-admin` - Send only admin notification
- `POST /api/email/send-contact-confirmation` - Send only user confirmation

### Utility
- `GET /api/email/test-connection` - Test SMTP connection

## Rate Limiting

Email endpoints are rate-limited to prevent abuse:
- **5 requests per 15 minutes** per IP address
- Returns 429 status code when limit exceeded

## Error Handling

The system handles partial failures gracefully:
- **200**: Both emails sent successfully
- **207**: Partial success (one email failed)
- **500**: Complete failure

## Security Features

1. **Rate Limiting**: Prevents email spam
2. **Input Validation**: All form data is validated
3. **CORS Protection**: Only allowed origins can access API
4. **Helmet Security**: Security headers enabled
5. **Environment Variables**: Sensitive data not hardcoded

## Troubleshooting

### Common Issues

1. **"Authentication failed"**
   - Verify SMTP credentials
   - Ensure app password is used (not regular password)
   - Check 2FA is enabled for Gmail

2. **"Connection timeout"**
   - Verify SMTP host and port
   - Check firewall settings
   - Ensure network connectivity

3. **"Invalid recipient"**
   - Verify email addresses are valid
   - Check ADMIN_EMAIL is set correctly

4. **"Rate limit exceeded"**
   - Wait 15 minutes before retrying
   - Check if multiple requests are being sent

### Debug Mode

Set `NODE_ENV=development` in `.env` to see detailed error messages.

### Logs

Check server console for detailed email sending logs:
```bash
npm run dev
```

## Production Deployment

### Environment Variables
Ensure all production environment variables are set:
- Use production SMTP credentials
- Set `NODE_ENV=production`
- Configure proper `FRONTEND_URL`
- Use strong `JWT_SECRET`

### Security Considerations
- Never commit `.env` file to version control
- Use environment-specific configurations
- Monitor email sending rates
- Implement additional security measures as needed

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Verify your SMTP configuration
3. Test with the provided curl commands
4. Check server logs for detailed error messages

For additional help, contact the development team.
