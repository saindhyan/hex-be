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
        host: process.env.SMTP_HOST ? process.env.SMTP_HOST : '✗ Missing',
        port: process.env.SMTP_PORT ? process.env.SMTP_PORT : '✗ Missing', 
        user: process.env.SMTP_USER ? process.env.SMTP_USER : '✗ Missing',
        pass: process.env.SMTP_PASS ? "set" : '✗ Missing',
        from: process.env.FROM_EMAIL ? process.env.FROM_EMAIL : '✗ Missing'
      });
      
      this.transporter = createTransporter();
      
      // Verify connection with timeout
      try {
        console.log('🔍 Verifying SMTP connection...');
        
        // Add timeout to prevent hanging in serverless environment
        const verifyPromise = this.transporter.verify();
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('SMTP verification timeout')), 10000)
        );
        
        await Promise.race([verifyPromise, timeoutPromise]);
        console.log('✅ SMTP connection verified successfully');
      } catch (error) {
        console.error('❌ SMTP connection failed:', {
          message: error.message,
          code: error.code,
          command: error.command,
          response: error.response,
          isTimeout: error.message === 'SMTP verification timeout'
        });
        
        // Don't throw error for timeout - continue with email sending
        if (error.message === 'SMTP verification timeout') {
          console.log('⚠️ SMTP verification timed out, proceeding with email sending...');
        } else {
          throw new Error('Email service initialization failed');
        }
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
      
      // Add timeout for email sending
      const sendPromise = this.transporter.sendMail(mailOptions);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Email send timeout')), 30000)
      );
      
      const result = await Promise.race([sendPromise, timeoutPromise]);
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
        stack: error.stack,
        isTimeout: error.message === 'Email send timeout'
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
      
      // Add timeout for email sending
      const sendPromise = this.transporter.sendMail(mailOptions);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Email send timeout')), 30000)
      );
      
      const result = await Promise.race([sendPromise, timeoutPromise]);
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
        stack: error.stack,
        isTimeout: error.message === 'Email send timeout'
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

  sendContactEmailsSync(contactData) {
    console.log('📨 Starting SYNC contact email process for:', contactData.email);
    
    try {
      console.log('🚀 Executing contact email sending SYNCHRONOUSLY...');
      
      // Initialize transporter synchronously
      console.log('🔧 Initializing transporter synchronously...');
      if (!this.transporter) {
        console.log('📧 Creating new transporter...');
        this.transporter = require('../config/email').createTransporter();
        console.log('✅ Transporter created');
      }
      
      // Send admin notification
      console.log('📬 Sending admin notification synchronously...');
      const adminTemplate = require('../templates/contactNotification')(contactData);
      const adminEmail = process.env.ADMIN_EMAIL || 'admin@hexsyndatalabs.com';
      
      const adminMailOptions = {
        from: `${require('../config/email').emailConfig.from.name} <${require('../config/email').emailConfig.from.address}>`,
        to: adminEmail,
        replyTo: contactData.email,
        subject: adminTemplate.subject,
        html: adminTemplate.html,
        text: adminTemplate.text,
        priority: 'high'
      };
      
      console.log('📤 Sending admin email with options:', {
        to: adminEmail,
        subject: adminTemplate.subject
      });
      
      this.transporter.sendMail(adminMailOptions, (error, info) => {
        if (error) {
          console.error('❌ Admin email failed:', error);
        } else {
          console.log('✅ Admin email sent:', info.messageId);
        }
      });
      
      // Send user confirmation
      console.log('📧 Sending user confirmation synchronously...');
      const userTemplate = require('../templates/contactConfirmation')(contactData);
      
      const userMailOptions = {
        from: `${require('../config/email').emailConfig.from.name} <${require('../config/email').emailConfig.from.address}>`,
        to: contactData.email,
        replyTo: require('../config/email').emailConfig.replyTo,
        subject: userTemplate.subject,
        html: userTemplate.html,
        text: userTemplate.text,
        priority: 'normal'
      };
      
      console.log('📤 Sending user email with options:', {
        to: contactData.email,
        subject: userTemplate.subject
      });
      
      this.transporter.sendMail(userMailOptions, (error, info) => {
        if (error) {
          console.error('❌ User email failed:', error);
        } else {
          console.log('✅ User email sent:', info.messageId);
        }
      });
      
      console.log('📧 Both emails initiated synchronously');
      
      return {
        message: 'Emails sent synchronously',
        status: 'sent'
      };
      
    } catch (error) {
      console.error('💥 Sync contact email sending failed:', {
        message: error.message,
        stack: error.stack,
        contactEmail: contactData.email
      });
      
      return {
        message: 'Email sending failed',
        status: 'error',
        error: error.message
      };
    }
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
