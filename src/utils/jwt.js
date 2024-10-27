import jwt from "jsonwebtoken"; // Import the jsonwebtoken library for token operations
import dotenv from 'dotenv'; // Import dotenv for environment variable management
dotenv.config(); // Load environment variables from .env file

// Set the secret key for signing tokens, using an environment variable if available
const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key"; // Replace with your secret key

// Function to generate a JWT token for a user
export const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, {
    expiresIn: "1h", // Token will expire in 1 hour
  });
};

// Function to verify a given JWT token
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, SECRET_KEY); // Verify the token and return the decoded payload
  } catch (error) {
    console.error('Error verifying token:', error); // Log any verification errors
    throw error; // Rethrow the error for further handling
  }
};

// Function to extract user ID from the token
export const getUserIdFromToken = (token) => {
  const decoded = verifyToken(token); // Verify and decode the token
  return decoded.id; // Return the user ID from the decoded token
};
