const { createTransporter, emailConfig } = require('../config/email');
const ownerNotificationTemplate = require('../templates/ownerNotification');
const applicantConfirmationTemplate = require('../templates/applicantConfirmation');
const contactNotificationTemplate = require('../templates/contactNotification');
const contactConfirmationTemplate = require('../templates/contactConfirmation');

class EmailService {
  constructor() {
    this.transporter = null;
  }

  async initializeTransporter() {
    if (!this.transporter) {
      this.transporter = createTransporter();
      
      // Verify connection
      try {
        await this.transporter.verify();
        console.log('SMTP connection verified successfully');
      } catch (error) {
        console.error('SMTP connection failed:', error.message);
        throw new Error('Email service initialization failed');
      }
    }
    return this.transporter;
  }

  async sendOwnerNotification(applicationData, ownerEmail) {
    try {
      await this.initializeTransporter();
      
      const template = ownerNotificationTemplate(applicationData);
      const adminEmail = process.env.ADMIN_EMAIL || 'admin@hexsyndatalabs.com';
      
      const mailOptions = {
        from: `${emailConfig.from.name} <${emailConfig.from.address}>`,
        to: ownerEmail,
        cc: adminEmail !== ownerEmail ? adminEmail : undefined, // Only CC admin if different from owner
        replyTo: emailConfig.replyTo,
        subject: template.subject,
        html: template.html,
        text: template.text,
        priority: 'high',
        headers: {
          'X-Application-Type': 'internship-application',
          'X-Application-ID': `app_${Date.now()}`
        }
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Owner notification sent successfully:', result.messageId);
      
      return {
        success: true,
        messageId: result.messageId,
        recipient: ownerEmail
      };
    } catch (error) {
      console.error('Failed to send owner notification:', error);
      throw new Error(`Owner notification failed: ${error.message}`);
    }
  }

  async sendApplicantConfirmation(applicationData) {
    try {
      await this.initializeTransporter();
      
      const template = applicantConfirmationTemplate(applicationData);
      
      const mailOptions = {
        from: `${emailConfig.from.name} <${emailConfig.from.address}>`,
        to: applicationData.applicant.email,
        replyTo: emailConfig.replyTo,
        subject: template.subject,
        html: template.html,
        text: template.text,
        priority: 'normal',
        headers: {
          'X-Application-Type': 'application-confirmation',
          'X-Application-ID': `app_${Date.now()}`
        }
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Applicant confirmation sent successfully:', result.messageId);
      
      return {
        success: true,
        messageId: result.messageId,
        recipient: applicationData.applicant.email
      };
    } catch (error) {
      console.error('Failed to send applicant confirmation:', error);
      throw new Error(`Applicant confirmation failed: ${error.message}`);
    }
  }

  async sendBothEmails(applicationData, ownerEmail) {
    const results = {
      ownerNotification: null,
      applicantConfirmation: null,
      errors: []
    };

    // Send both emails in parallel
    const [ownerResult, applicantResult] = await Promise.allSettled([
      this.sendOwnerNotification(applicationData, ownerEmail),
      this.sendApplicantConfirmation(applicationData)
    ]);

    // Process owner notification result
    if (ownerResult.status === 'fulfilled') {
      results.ownerNotification = ownerResult.value;
    } else {
      results.errors.push({
        type: 'owner_notification',
        message: ownerResult.reason.message
      });
    }

    // Process applicant confirmation result
    if (applicantResult.status === 'fulfilled') {
      results.applicantConfirmation = applicantResult.value;
    } else {
      results.errors.push({
        type: 'applicant_confirmation',
        message: applicantResult.reason.message
      });
    }

    return results;
  }

  async sendContactAdminNotification(contactData) {
    try {
      await this.initializeTransporter();
      
      const template = contactNotificationTemplate(contactData);
      const adminEmail = process.env.ADMIN_EMAIL || 'admin@hexsyndatalabs.com';
      
      const mailOptions = {
        from: `${emailConfig.from.name} <${emailConfig.from.address}>`,
        to: adminEmail,
        replyTo: contactData.email,
        subject: template.subject,
        html: template.html,
        text: template.text,
        priority: 'high',
        headers: {
          'X-Contact-Type': 'contact-form',
          'X-Contact-ID': `contact_${Date.now()}`
        }
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Contact admin notification sent successfully:', result.messageId);
      
      return {
        success: true,
        messageId: result.messageId,
        recipient: adminEmail
      };
    } catch (error) {
      console.error('Failed to send contact admin notification:', error);
      throw new Error(`Contact admin notification failed: ${error.message}`);
    }
  }

  async sendContactUserConfirmation(contactData) {
    try {
      await this.initializeTransporter();
      
      const template = contactConfirmationTemplate(contactData);
      
      const mailOptions = {
        from: `${emailConfig.from.name} <${emailConfig.from.address}>`,
        to: contactData.email,
        replyTo: emailConfig.replyTo,
        subject: template.subject,
        html: template.html,
        text: template.text,
        priority: 'normal',
        headers: {
          'X-Contact-Type': 'contact-confirmation',
          'X-Contact-ID': `contact_${Date.now()}`
        }
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Contact user confirmation sent successfully:', result.messageId);
      
      return {
        success: true,
        messageId: result.messageId,
        recipient: contactData.email
      };
    } catch (error) {
      console.error('Failed to send contact user confirmation:', error);
      throw new Error(`Contact user confirmation failed: ${error.message}`);
    }
  }

  async sendContactEmails(contactData) {
    const results = {
      adminNotification: null,
      userConfirmation: null,
      errors: []
    };

    // Send both emails in parallel
    const [adminResult, userResult] = await Promise.allSettled([
      this.sendContactAdminNotification(contactData),
      this.sendContactUserConfirmation(contactData)
    ]);

    // Process admin notification result
    if (adminResult.status === 'fulfilled') {
      results.adminNotification = adminResult.value;
    } else {
      results.errors.push({
        type: 'admin_notification',
        message: adminResult.reason.message
      });
    }

    // Process user confirmation result
    if (userResult.status === 'fulfilled') {
      results.userConfirmation = userResult.value;
    } else {
      results.errors.push({
        type: 'user_confirmation',
        message: userResult.reason.message
      });
    }

    return results;
  }

  // Fire-and-forget email sending for faster API responses
  sendBothEmailsAsync(applicationData, ownerEmail) {
    // Return immediately, don't wait for emails
    setImmediate(async () => {
      try {
        const results = await this.sendBothEmails(applicationData, ownerEmail);
        console.log('Application emails sent:', {
          ownerSuccess: !!results.ownerNotification,
          applicantSuccess: !!results.applicantConfirmation,
          errors: results.errors.length
        });
      } catch (error) {
        console.error('Async application email sending failed:', error);
      }
    });
    
    return {
      message: 'Emails are being sent in the background',
      status: 'processing'
    };
  }

  sendContactEmailsAsync(contactData) {
    // Return immediately, don't wait for emails
    setImmediate(async () => {
      try {
        const results = await this.sendContactEmails(contactData);
        console.log('Contact emails sent:', {
          adminSuccess: !!results.adminNotification,
          userSuccess: !!results.userConfirmation,
          errors: results.errors.length
        });
      } catch (error) {
        console.error('Async contact email sending failed:', error);
      }
    });
    
    return {
      message: 'Emails are being sent in the background',
      status: 'processing'
    };
  }

  async testConnection() {
    try {
      await this.initializeTransporter();
      return { success: true, message: 'SMTP connection successful' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}

module.exports = new EmailService();
