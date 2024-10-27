import Joi from 'joi';

// Custom error messages for better user feedback
const customMessages = {
  'string.empty': '{#label} is required',
  'string.email': 'Please enter a valid email address',
  'string.min': '{#label} must be at least {#limit} characters',
  'string.max': '{#label} must not exceed {#limit} characters',
  'string.pattern.base': '{#label} must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  'any.required': '{#label} is required'
};

// Login validation schema
export const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .trim()
    .max(255)
    .messages({
      ...customMessages,
      'string.email': 'Please enter a valid email address'
    }),
  
  password: Joi.string()
    .required()
    .min(8)
    .max(100)
    .messages({
      ...customMessages,
      'string.min': 'Password must be at least 8 characters long'
    })
}).options({ abortEarly: false });

// Validation helper function
export const validateLogin = (data) => {
  const { error } = loginSchema.validate(data, { abortEarly: false });
  
  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path[0],
      message: detail.message
    }));
    throw new Error(JSON.stringify(errors));
  }
  
  return true;
};