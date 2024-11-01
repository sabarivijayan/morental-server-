import Joi from 'joi';

// Custom messages for common validation errors
const customMessages = {
  'string.empty': '{{#label}} cannot be empty',
  'string.min': '{{#label}} should have at least {{#limit}} characters',
  'string.max': '{{#label}} should have at most {{#limit}} characters',
  'string.email': '{{#label}} must be a valid email address',
  'string.pattern.base': '{{#label}} contains invalid characters',
  'any.required': '{{#label}} is required',
  'string.length': '{{#label}} must be {{#limit}} characters long',
};

// Basic user schema for registration
const userRegistrationSchema = Joi.object({
  firstName: Joi.string()
    .pattern(/^[A-Za-z]+$/)
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.pattern.base': 'First name can only contain letters',
      ...customMessages,
    }),

  lastName: Joi.string()
    .pattern(/^[A-Za-z]+$/)
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.pattern.base': 'Last name can only contain letters',
      ...customMessages,
    }),

  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages(customMessages),

  phoneNumber: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required()
    .messages({
      'string.pattern.base': 'Phone number must be 10 digits',
      ...customMessages,
    }),

  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)
    .required()
    .messages({
      'string.pattern.base':
        'Password must contain at least one letter and one number',
      ...customMessages,
    }),

  confirmPassword: Joi.string()
    .valid(Joi.ref('password'))
    .required()
    .messages({
      'any.only': 'Passwords do not match',
      ...customMessages,
    }),
});

// Address information schema
const addressSchema = Joi.object({
  city: Joi.string()
    .pattern(/^[A-Za-z\s]+$/)
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.pattern.base': 'City name can only contain letters and spaces',
      ...customMessages,
    }),

  state: Joi.string()
    .pattern(/^[A-Za-z\s]+$/)
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.pattern.base': 'State name can only contain letters and spaces',
      ...customMessages,
    }),

  country: Joi.string()
    .pattern(/^[A-Za-z\s]+$/)
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.pattern.base': 'Country name can only contain letters and spaces',
      ...customMessages,
    }),

  pincode: Joi.string()
    .pattern(/^[0-9]{6}$/)
    .required()
    .messages({
      'string.pattern.base': 'Pincode must be 6 digits',
      ...customMessages,
    }),
});

// Login schema
const loginSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages(customMessages),

  password: Joi.string().required().messages(customMessages),
});

// OTP validation schema
const otpSchema = Joi.object({
  phoneNumber: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required()
    .messages({
      'string.pattern.base': 'Phone number must be 10 digits',
      ...customMessages,
    }),

  otp: Joi.string()
    .length(6)
    .pattern(/^[0-9]+$/)
    .required()
    .messages({
      'string.pattern.base': 'OTP must contain only numbers',
      ...customMessages,
    }),
});

// Validation middleware
const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path[0],
        message: detail.message,
      }));
      
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors,
      });
    }
    
    next();
  };
};

export {
  validateRequest,
  userRegistrationSchema,
  addressSchema,
  loginSchema,
  otpSchema,
};