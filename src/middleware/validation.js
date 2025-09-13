const Joi = require('joi');

// Validation schema for application submission
const applicationSchema = Joi.object({
  // Applicant details
  firstName: Joi.string().trim().min(1).max(50).required(),
  lastName: Joi.string().trim().min(1).max(50).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().trim().min(10).max(20).required(),
  university: Joi.string().trim().min(1).max(100).required(),
  major: Joi.string().trim().min(1).max(100).required(),
  graduationYear: Joi.string().trim().required(),
  gpa: Joi.string().trim().allow('').optional(),
  coverLetter: Joi.string().trim().allow('').optional(),
  linkedin: Joi.string().uri().allow('').optional(),
  portfolio: Joi.string().uri().allow('').optional(),
  availability: Joi.string().trim().allow('').optional(),
  duration: Joi.string().trim().allow('').optional(),
  
  // Opportunity details
  opportunityId: Joi.number().integer().positive().required(),
  opportunityTitle: Joi.string().trim().min(1).max(100).required(),
  opportunityCompany: Joi.string().trim().min(1).max(100).required(),
  
  // Payment details
  transactionId: Joi.string().trim().allow('').optional(),
  paymentDone: Joi.boolean().default(false),
  paymentAmount: Joi.string().trim().allow('').optional(),
  
  // Owner email
  ownerEmail: Joi.string().email().required(),
  
  // Resume file (handled by multer)
  resume: Joi.any().meta({ type: 'file' }).optional()
}).options({ stripUnknown: true });

// Validation schema for contact form submission
const contactSchema = Joi.object({
  firstName: Joi.string().trim().min(1).max(50).required(),
  lastName: Joi.string().trim().min(1).max(50).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().trim().min(10).max(20).allow('').optional(),
  company: Joi.string().trim().max(100).allow('').optional(),
  subject: Joi.string().trim().min(1).max(200).required(),
  message: Joi.string().trim().min(10).max(2000).required(),
  inquiryType: Joi.string().valid('general', 'internship', 'partnership', 'support', 'careers', 'media').required()
});

// Validation schema for subscription submission
const subscriptionSchema = Joi.object({
  email: Joi.string().email().required(),
  subscriptionType: Joi.string().valid('platform_updates', 'newsletter', 'opportunities', 'announcements').required(),
  source: Joi.string().trim().min(1).max(100).required(),
  timestamp: Joi.string().isoDate().optional(),
  interests: Joi.array().items(
    Joi.string().valid('platform_launch', 'new_features', 'opportunities', 'partnerships', 'events', 'updates')
  ).min(1).required()
});

// Validation schema for career application submission
const careerApplicationSchema = Joi.object({
  firstName: Joi.string().trim().min(1).max(50).required(),
  lastName: Joi.string().trim().min(1).max(50).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().trim().min(10).max(20).required(),
  location: Joi.string().trim().min(1).max(100).allow('').default(''),
  experience: Joi.string().valid('entry', 'mid', 'senior', 'executive').allow('').default(''),
  availability: Joi.string().valid('immediate', '2weeks', '1month', '2months', '3months').allow('').default(''),
  salary: Joi.string().trim().allow('').default(''),
  coverLetter: Joi.string().trim().allow('').default(''),
  portfolio: Joi.string().uri().allow('').default(''),
  linkedin: Joi.string().uri().allow('').default(''),
  github: Joi.string().uri().allow('').default(''),
  agreeToTerms: Joi.boolean().valid(true).required(),
  allowContact: Joi.boolean().default(false),
  jobId: Joi.number().integer().positive().required(),
  jobTitle: Joi.string().trim().min(1).max(100).default(''),
  department: Joi.string().trim().min(1).max(100).default('')
}).options({ stripUnknown: true });

const validateApplication = (req, res, next) => {
  const { error, value } = applicationSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    const validationErrors = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));

    return res.status(400).json({
      error: 'Validation failed',
      details: validationErrors
    });
  }

  req.validatedData = value;
  next();
};

const validateContact = (req, res, next) => {
  const { error, value } = contactSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    const validationErrors = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));

    return res.status(400).json({
      error: 'Validation failed',
      details: validationErrors
    });
  }

  req.validatedData = value;
  next();
};

const validateSubscription = (req, res, next) => {
  const { error, value } = subscriptionSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    const validationErrors = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));

    return res.status(400).json({
      error: 'Validation failed',
      details: validationErrors
    });
  }

  req.validatedData = value;
  next();
};

const validateCareerApplication = (req, res, next) => {
  const { error, value } = careerApplicationSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    const validationErrors = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));

    return res.status(400).json({
      error: 'Validation failed',
      details: validationErrors
    });
  }

  req.validatedData = value;
  next();
};

module.exports = {
  validateApplication,
  validateContact,
  validateSubscription,
  validateCareerApplication
};
