import Joi from 'joi';

// Custom error messages for consistent user feedback
const customMessages = {
  'string.empty': '{#label} is required',
  'string.min': '{#label} must be at least {#limit} characters',
  'string.max': '{#label} must not exceed {#limit} characters',
  'string.email': 'Please enter a valid email address',
  'string.pattern.base': '{#label} format is invalid',
  'any.required': '{#label} is required',
  'any.only': "Passwords don't match"
};

// Registration validation schema
export const registerSchema = Joi.object({
  firstName: Joi.string()
    .required()
    .min(2)
    .max(50)
    .trim()
    .messages(customMessages),

  lastName: Joi.string()
    .required()
    .min(2)
    .max(50)
    .trim()
    .messages(customMessages),

  email: Joi.string()
    .required()
    .email()
    .trim()
    .max(255)
    .messages(customMessages),

  phoneNumber: Joi.string()
    .required()
    .pattern(/^[0-9]{10}$/)
    .messages({
      ...customMessages,
      'string.pattern.base': 'Phone number must be 10 digits'
    }),

  password: Joi.string()
    .required()
    .min(8)
    .max(100)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .messages({
      ...customMessages,
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    }),

  confirmPassword: Joi.string()
    .required()
    .valid(Joi.ref('password'))
    .messages({
      ...customMessages,
      'any.only': 'Passwords must match'
    }),

  city: Joi.string()
    .required()
    .min(2)
    .max(100)
    .trim()
    .messages(customMessages),

  state: Joi.string()
    .required()
    .min(2)
    .max(100)
    .trim()
    .messages(customMessages),

  country: Joi.string()
    .required()
    .min(2)
    .max(100)
    .trim()
    .messages(customMessages),

  pincode: Joi.string()
    .required()
    .pattern(/^[0-9]{6}$/)
    .messages({
      ...customMessages,
      'string.pattern.base': 'Pincode must be 6 digits'
    })
}).options({ abortEarly: false });

// Login validation schema
export const loginSchema = Joi.object({
  email: Joi.string()
    .required()
    .email()
    .trim()
    .max(255)
    .messages(customMessages),

  password: Joi.string()
    .required()
    .min(8)
    .max(100)
    .messages(customMessages)
}).options({ abortEarly: false });

// OTP validation schemas
export const sendOTPSchema = Joi.object({
  phoneNumber: Joi.string()
    .required()
    .pattern(/^[0-9]{10}$/)
    .messages({
      ...customMessages,
      'string.pattern.base': 'Phone number must be 10 digits'
    })
}).options({ abortEarly: false });

export const verifyOTPSchema = Joi.object({
  phoneNumber: Joi.string()
    .required()
    .pattern(/^[0-9]{10}$/)
    .messages({
      ...customMessages,
      'string.pattern.base': 'Phone number must be 10 digits'
    }),
  
  otp: Joi.string()
    .required()
    .pattern(/^[0-9]{6}$/)
    .messages({
      ...customMessages,
      'string.pattern.base': 'OTP must be 6 digits'
    })
}).options({ abortEarly: false });

// Profile update validation schema
export const updateProfileSchema = Joi.object({
  firstName: Joi.string()
    .min(2)
    .max(50)
    .trim()
    .messages(customMessages),

  lastName: Joi.string()
    .min(2)
    .max(50)
    .trim()
    .messages(customMessages),

  city: Joi.string()
    .min(2)
    .max(100)
    .trim()
    .messages(customMessages),

  state: Joi.string()
    .min(2)
    .max(100)
    .trim()
    .messages(customMessages),

  country: Joi.string()
    .min(2)
    .max(100)
    .trim()
    .messages(customMessages),

  pincode: Joi.string()
    .pattern(/^[0-9]{6}$/)
    .messages({
      ...customMessages,
      'string.pattern.base': 'Pincode must be 6 digits'
    })
}).options({ abortEarly: false });

// Password update validation schema
export const updatePasswordSchema = Joi.object({
  currentPassword: Joi.string()
    .required()
    .min(8)
    .max(100)
    .messages(customMessages),

  newPassword: Joi.string()
    .required()
    .min(8)
    .max(100)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .messages({
      ...customMessages,
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    }),

  confirmNewPassword: Joi.string()
    .required()
    .valid(Joi.ref('newPassword'))
    .messages({
      ...customMessages,
      'any.only': 'Passwords must match'
    })
}).options({ abortEarly: false });

// Validation helper functions
const validateInput = (schema, data) => {
  const { error } = schema.validate(data);
  
  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path[0],
      message: detail.message
    }));
    throw errors;
  }
  
  return true;
};

export const validateRegistration = (data) => validateInput(registerSchema, data);
export const validateLogin = (data) => validateInput(loginSchema, data);
export const validateSendOTP = (data) => validateInput(sendOTPSchema, data);
export const validateVerifyOTP = (data) => validateInput(verifyOTPSchema, data);
export const validateProfileUpdate = (data) => validateInput(updateProfileSchema, data);
export const validatePasswordUpdate = (data) => validateInput(updatePasswordSchema, data);
