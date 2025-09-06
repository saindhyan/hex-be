const { createTransporter, emailConfig } = require('../config/email');
const ownerNotificationTemplate = require('../templates/ownerNotification');
const applicantConfirmationTemplate = require('../templates/applicantConfirmation');
const contactNotificationTemplate = require('../templates/contactNotification');
const contactConfirmationTemplate = require('../templates/contactConfirmation');
const subscriptionNotificationTemplate = require('../templates/subscriptionNotification');
const subscriptionConfirmationTemplate = require('../templates/subscriptionConfirmation');

class EmailService {
  constructor() {
    this.transporter = null;
  }

  async initializeTransporter() {
    if (!this.transporter) {
      console.log('🔧 Initializing email transporter...');
      console.log('📧 Email config check:', {
        host: process.env.SMTP_HOST ? '✓ Set' : '✗ Missing',
        port: process.env.SMTP_PORT ? '✓ Set' : '✗ Missing', 
        user: process.env.SMTP_USER ? '✓ Set' : '✗ Missing',
        pass: process.env.SMTP_PASS ? '✓ Set' : '✗ Missing',
        from: process.env.FROM_EMAIL ? '✓ Set' : '✗ Missing'
      });
      
      this.transporter = createTransporter();
      
      // Verify connection
      try {
        console.log('🔍 Verifying SMTP connection...');
        await this.transporter.verify();
        console.log('✅ SMTP connection verified successfully');
      } catch (error) {
        console.error('❌ SMTP connection failed:', {
          message: error.message,
          code: error.code,
          command: error.command,
          response: error.response
        });
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
      console.log('📬 Sending contact admin notification...');
      await this.initializeTransporter();
      
      const template = contactNotificationTemplate(contactData);
      const adminEmail = process.env.ADMIN_EMAIL || 'admin@hexsyndatalabs.com';
      
      console.log('📋 Admin notification details:', {
        adminEmail,
        fromEmail: contactData.email,
        subject: template.subject
      });
      
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

      console.log('📤 Sending admin notification email...');
      const result = await this.transporter.sendMail(mailOptions);
      console.log('✅ Contact admin notification sent successfully:', {
        messageId: result.messageId,
        recipient: adminEmail,
        response: result.response
      });
      
      return {
        success: true,
        messageId: result.messageId,
        recipient: adminEmail
      };
    } catch (error) {
      console.error('❌ Failed to send contact admin notification:', {
        message: error.message,
        code: error.code,
        command: error.command,
        response: error.response,
        stack: error.stack
      });
      throw new Error(`Contact admin notification failed: ${error.message}`);
    }
  }

  async sendContactUserConfirmation(contactData) {
    try {
      console.log('📧 Sending contact user confirmation...');
      await this.initializeTransporter();
      
      const template = contactConfirmationTemplate(contactData);
      
      console.log('📋 User confirmation details:', {
        userEmail: contactData.email,
        subject: template.subject
      });
      
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

      console.log('📤 Sending user confirmation email...');
      const result = await this.transporter.sendMail(mailOptions);
      console.log('✅ Contact user confirmation sent successfully:', {
        messageId: result.messageId,
        recipient: contactData.email,
        response: result.response
      });
      
      return {
        success: true,
        messageId: result.messageId,
        recipient: contactData.email
      };
    } catch (error) {
      console.error('❌ Failed to send contact user confirmation:', {
        message: error.message,
        code: error.code,
        command: error.command,
        response: error.response,
        stack: error.stack
      });
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
    console.log('📨 Starting async contact email process for:', contactData.email);
    
    // Return immediately, don't wait for emails
    setImmediate(async () => {
      try {
        console.log('🚀 Executing contact email sending...');
        const results = await this.sendContactEmails(contactData);
        console.log('📧 Contact emails processing complete:', {
          adminSuccess: !!results.adminNotification,
          userSuccess: !!results.userConfirmation,
          errors: results.errors.length,
          errorDetails: results.errors
        });
        
        if (results.errors.length > 0) {
          console.error('⚠️ Contact email errors occurred:', results.errors);
        }
      } catch (error) {
        console.error('💥 Async contact email sending failed:', {
          message: error.message,
          stack: error.stack,
          contactEmail: contactData.email
        });
      }
    });
    
    return {
      message: 'Emails are being sent in the background',
      status: 'processing'
    };
  }

  async sendSubscriptionAdminNotification(subscriptionData) {
    try {
      await this.initializeTransporter();
      
      const template = subscriptionNotificationTemplate(subscriptionData);
      const adminEmail = process.env.ADMIN_EMAIL || 'admin@hexsyndatalabs.com';
      
      const mailOptions = {
        from: `${emailConfig.from.name} <${emailConfig.from.address}>`,
        to: adminEmail,
        replyTo: subscriptionData.email,
        subject: template.subject,
        html: template.html,
        text: template.text,
        priority: 'normal',
        headers: {
          'X-Subscription-Type': 'subscription-notification',
          'X-Subscription-ID': `sub_${Date.now()}`
        }
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Subscription admin notification sent successfully:', result.messageId);
      
      return {
        success: true,
        messageId: result.messageId,
        recipient: adminEmail
      };
    } catch (error) {
      console.error('Failed to send subscription admin notification:', error);
      throw new Error(`Subscription admin notification failed: ${error.message}`);
    }
  }

  async sendSubscriptionUserConfirmation(subscriptionData) {
    try {
      await this.initializeTransporter();
      
      const template = subscriptionConfirmationTemplate(subscriptionData);
      
      const mailOptions = {
        from: `${emailConfig.from.name} <${emailConfig.from.address}>`,
        to: subscriptionData.email,
        replyTo: emailConfig.replyTo,
        subject: template.subject,
        html: template.html,
        text: template.text,
        priority: 'normal',
        headers: {
          'X-Subscription-Type': 'subscription-confirmation',
          'X-Subscription-ID': `sub_${Date.now()}`
        }
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Subscription user confirmation sent successfully:', result.messageId);
      
      return {
        success: true,
        messageId: result.messageId,
        recipient: subscriptionData.email
      };
    } catch (error) {
      console.error('Failed to send subscription user confirmation:', error);
      throw new Error(`Subscription user confirmation failed: ${error.message}`);
    }
  }

  async sendSubscriptionEmails(subscriptionData) {
    const results = {
      adminNotification: null,
      userConfirmation: null,
      errors: []
    };

    // Send both emails in parallel
    const [adminResult, userResult] = await Promise.allSettled([
      this.sendSubscriptionAdminNotification(subscriptionData),
      this.sendSubscriptionUserConfirmation(subscriptionData)
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

  sendSubscriptionEmailsAsync(subscriptionData) {
    // Return immediately, don't wait for emails
    setImmediate(async () => {
      try {
        const results = await this.sendSubscriptionEmails(subscriptionData);
        console.log('Subscription emails sent:', {
          adminSuccess: !!results.adminNotification,
          userSuccess: !!results.userConfirmation,
          errors: results.errors.length
        });
      } catch (error) {
        console.error('Async subscription email sending failed:', error);
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
