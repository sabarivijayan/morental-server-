// Import the dotenv package to manage environment variables
import dotenv from 'dotenv';

// Load environment variables from the .env file into process.env
dotenv.config();

// Export constants for database connection settings and secret key
export const DB_HOST = process.env.DB_HOST; // Database host (e.g., localhost)
export const DB_NAME = process.env.DB_NAME; // Name of the database to connect to
export const DB_USER = process.env.DB_USER; // Username for database authentication
export const DB_PASS = process.env.DB_PASS; // Password for database authentication
export const SECRET_KEY = process.env.SECRET_KEY; // Secret key for token generation or encryption