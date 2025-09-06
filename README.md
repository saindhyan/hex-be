# HexSyn Server - Email Service

Backend server for the HexSyn internship application platform with SMTP email functionality.

## Features

- **Dual Email System**: Automatically sends emails to both internship owners and applicants
- **Professional Templates**: Beautiful HTML email templates with responsive design
- **SMTP Integration**: Configurable SMTP settings for various email providers
- **Rate Limiting**: Built-in protection against email spam
- **Validation**: Comprehensive input validation using Joi
- **Error Handling**: Robust error handling with detailed logging

## Setup Instructions

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Configure Environment Variables

Copy the `.env.example` file to `.env` and update with your SMTP credentials:

```bash
cp .env.example .env
```

Update the following variables in `.env`:

```env
# SMTP Configuration
SMTP_HOST=smtp.gmail.com          # Your SMTP host
SMTP_PORT=587                     # SMTP port (587 for TLS, 465 for SSL)
SMTP_USER=your-email@gmail.com    # Your email address
SMTP_PASS=your-app-password       # Your email password or app password

# Email Configuration
FROM_NAME=HexSyn Team          # Display name for outgoing emails
FROM_EMAIL=noreply@HexSyn.com  # From email address
REPLY_TO_EMAIL=support@HexSyn.com  # Reply-to email address
```

### 3. Gmail Setup (if using Gmail)

If using Gmail, you'll need to:

1. Enable 2-Factor Authentication on your Google account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
   - Use this app password in `SMTP_PASS`

### 4. Start the Server

```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Health Check
```
GET /api/health
```

### Test Email Connection
```
GET /api/email/test-connection
```

### Send Application Emails
```
POST /api/email/send-application
```

**Request Body:**
```json
{
  "applicant": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "university": "University Name",
    "major": "Computer Science",
    "graduationYear": "2025",
    "gpa": "3.8",
    "coverLetter": "Cover letter content...",
    "linkedin": "https://linkedin.com/in/johndoe",
    "portfolio": "https://johndoe.com",
    "availability": "immediately"
  },
  "internship": {
    "id": 1,
    "title": "Software Engineer Intern",
    "company": "Tech Company"
  },
  "ownerEmail": "owner@company.com"
}
```

## Email Templates

### Owner Notification Email
- **Purpose**: Notifies internship owners of new applications
- **Features**: 
  - Complete applicant information
  - Professional formatting
  - Direct contact links
  - Application timestamp

### Applicant Confirmation Email
- **Purpose**: Confirms successful application submission to applicants
- **Features**:
  - Application summary
  - Timeline expectations
  - Contact information
  - Professional branding

## Frontend Integration

The frontend `ApplicationForm.tsx` has been updated to integrate with this email service. When a user submits an application:

1. Form data is validated on the frontend
2. API call is made to `/api/email/send-application`
3. Server sends emails to both owner and applicant
4. User receives confirmation with appropriate messaging

## Error Handling

The system handles various error scenarios:

- **SMTP Connection Issues**: Graceful fallback with user notification
- **Partial Failures**: If one email fails, the other still attempts to send
- **Rate Limiting**: Prevents spam with configurable limits
- **Validation Errors**: Clear error messages for invalid data

## Security Features

- **Rate Limiting**: 5 emails per 15 minutes per IP
- **Input Validation**: Comprehensive validation using Joi
- **CORS Protection**: Configurable CORS settings
- **Helmet Security**: Security headers and protection
- **Environment Variables**: Sensitive data stored securely

## Troubleshooting

### Common Issues

1. **SMTP Authentication Failed**
   - Verify SMTP credentials in `.env`
   - For Gmail, ensure you're using an app password
   - Check if 2FA is enabled (required for Gmail)

2. **Connection Timeout**
   - Verify SMTP host and port
   - Check firewall settings
   - Try different SMTP providers

3. **Rate Limit Exceeded**
   - Wait 15 minutes before trying again
   - Adjust rate limits in `src/routes/email.js` if needed

### Testing

Use the test endpoint to verify your SMTP configuration:

```bash
curl http://localhost:5000/api/email/test-connection
```

## Development

### Project Structure

```
server/
├── src/
│   ├── config/
│   │   └── email.js          # SMTP configuration
│   ├── middleware/
│   │   └── validation.js     # Input validation
│   ├── routes/
│   │   └── email.js          # Email API routes
│   ├── services/
│   │   └── emailService.js   # Email sending logic
│   ├── templates/
│   │   ├── ownerNotification.js     # Owner email template
│   │   └── applicantConfirmation.js # Applicant email template
│   └── index.js              # Main server file
├── .env                      # Environment variables
├── .env.example              # Environment template
├── package.json              # Dependencies
└── README.md                 # This file
```

### Adding New Email Templates

1. Create a new template file in `src/templates/`
2. Export a function that returns `{ subject, html, text }`
3. Import and use in `src/services/emailService.js`

## Production Deployment

1. Set `NODE_ENV=production` in your environment
2. Use a production SMTP service (SendGrid, AWS SES, etc.)
3. Configure proper logging and monitoring
4. Set up SSL/TLS certificates
5. Use a process manager like PM2

## License

MIT License
