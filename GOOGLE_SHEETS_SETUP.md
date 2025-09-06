# Google Sheets Integration Setup Guide

This guide will help you set up Google Sheets integration for the HexSyn Server to automatically log applications, subscriptions, and contact form submissions.

## Overview

The integration creates three separate sheets in a single Google Spreadsheet:
- **Applications**: Logs all job/internship applications
- **Subscriptions**: Logs all newsletter/platform subscriptions  
- **ContactUs**: Logs all contact form submissions

Each sheet includes proper headers, formatting, and frozen header rows for easy filtering and analysis.

## Prerequisites

1. Google Cloud Project with Sheets API enabled
2. Service Account with appropriate permissions
3. Google Spreadsheet created and shared with the service account

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google Sheets API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click "Enable"

## Step 2: Create Service Account

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "Service Account"
3. Fill in service account details:
   - Name: `hexsyn-sheets-service`
   - Description: `Service account for HexSyn Server Google Sheets integration`
4. Click "Create and Continue"
5. Skip role assignment for now (click "Continue")
6. Click "Done"

## Step 3: Generate Service Account Key

1. Click on the created service account
2. Go to "Keys" tab
3. Click "Add Key" > "Create new key"
4. Select "JSON" format
5. Download the JSON file - **Keep this secure!**

## Step 4: Create Google Spreadsheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it something like "HexSyn Server Data"
4. Copy the spreadsheet ID from the URL:
   ```
   https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit
   ```

## Step 5: Share Spreadsheet with Service Account

1. In your Google Spreadsheet, click "Share"
2. Add the service account email (from the JSON file: `client_email`)
3. Give it "Editor" permissions
4. Uncheck "Notify people" 
5. Click "Share"

## Step 6: Configure Environment Variables

Add these variables to your `.env` file using the values from the downloaded JSON:

```bash
# Google Sheets Configuration
GOOGLE_SHEETS_ID=your-spreadsheet-id-from-url
GOOGLE_PROJECT_ID=project_id_from_json
GOOGLE_PRIVATE_KEY_ID=private_key_id_from_json
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----"
GOOGLE_CLIENT_EMAIL=client_email_from_json
GOOGLE_CLIENT_ID=client_id_from_json
```

### Important Notes for Environment Variables:

- **GOOGLE_PRIVATE_KEY**: Must include the full key with `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` markers
- **Line breaks**: In production (Vercel), replace actual line breaks with `\n`
- **Quotes**: Wrap the private key in double quotes

### For Vercel Deployment:

When setting environment variables in Vercel dashboard, format the private key as a single line:
```
"-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----"
```

## Sheet Structures

### Applications Sheet
| Column | Description |
|--------|-------------|
| Timestamp | When application was submitted |
| First Name | Applicant's first name |
| Last Name | Applicant's last name |
| Email | Applicant's email |
| Phone | Applicant's phone number |
| University | Applicant's university |
| Major | Applicant's major/field of study |
| Graduation Year | Expected graduation year |
| GPA | Grade point average |
| LinkedIn | LinkedIn profile URL |
| Portfolio | Portfolio website URL |
| Availability | When applicant is available |
| Opportunity ID | Job/internship ID |
| Opportunity Title | Job/internship title |
| Company | Company name |
| Owner Email | Job poster's email |
| Cover Letter | Applicant's cover letter |

### Subscriptions Sheet
| Column | Description |
|--------|-------------|
| Timestamp | When subscription was created |
| Email | Subscriber's email |
| Subscription Type | Type of subscription |
| Source | Where subscription came from |
| Interests | Comma-separated list of interests |

### ContactUs Sheet
| Column | Description |
|--------|-------------|
| Timestamp | When contact form was submitted |
| First Name | Contact's first name |
| Last Name | Contact's last name |
| Email | Contact's email |
| Phone | Contact's phone number |
| Company | Contact's company |
| Subject | Message subject |
| Inquiry Type | Type of inquiry |
| Message | Full message content |

## Features

### Automatic Sheet Management
- Creates sheets automatically if they don't exist
- Sets up headers with proper formatting (bold, gray background)
- Freezes header row for easy scrolling
- Appends new data without overwriting existing data

### Error Handling
- Non-blocking: Sheet logging failures won't break API responses
- Comprehensive logging of errors for debugging
- Graceful degradation if Google Sheets is unavailable

### Security
- Uses service account authentication (more secure than OAuth for server-to-server)
- Private key stored as environment variable
- No user interaction required

## Testing

1. Make sure all environment variables are set
2. Submit a test application, subscription, or contact form
3. Check your Google Spreadsheet for new entries
4. Monitor server logs for any Google Sheets related errors

## Troubleshooting

### Common Issues

**"Error: No private key available"**
- Check that `GOOGLE_PRIVATE_KEY` is properly formatted with line breaks
- Ensure the private key includes the BEGIN/END markers

**"Error: Requested entity was not found"**
- Verify the `GOOGLE_SHEETS_ID` is correct
- Make sure the spreadsheet is shared with the service account email

**"Error: The caller does not have permission"**
- Ensure the service account has Editor access to the spreadsheet
- Verify the Google Sheets API is enabled in your Google Cloud project

**"Error: Invalid JWT"**
- Check all service account credentials are correct
- Verify there are no extra spaces or characters in environment variables

### Debug Mode

Set `NODE_ENV=development` to see detailed error messages and logging output.

## Production Deployment

For Vercel deployment:
1. Add all Google Sheets environment variables in Vercel dashboard
2. Format the private key as a single line with `\n` for line breaks
3. Deploy and test with a sample submission

## Data Analysis Tips

### Using Filters
1. Click on any header cell
2. Go to Data > Create a filter
3. Use dropdown arrows to filter by specific values

### Common Filters
- **Applications**: Filter by company, graduation year, or submission date
- **Subscriptions**: Filter by subscription type or interests
- **ContactUs**: Filter by inquiry type or company

### Export Options
- File > Download as Excel, CSV, PDF, etc.
- Use for reporting or importing into other systems

## Security Best Practices

1. **Never commit** the service account JSON file to version control
2. **Regularly rotate** service account keys (every 90 days recommended)
3. **Monitor access** through Google Cloud Console audit logs
4. **Limit permissions** - only give Editor access, not Owner
5. **Use separate service accounts** for different environments (dev/prod)

## Support

If you encounter issues:
1. Check the server logs for detailed error messages
2. Verify all environment variables are set correctly
3. Test the Google Sheets API connection manually
4. Ensure the service account has proper permissions
