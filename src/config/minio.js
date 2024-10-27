// Import the dotenv module to load environment variables from a .env file
import dotenv from 'dotenv';
// Load environment variables from .env file
dotenv.config();

// Import the Client class from the minio module
import { Client } from 'minio';

// Create a new MinIO client instance
const minioClient = new Client({
  // Set the endpoint URL for the MinIO server
  endPoint: process.env.MINIO_ENDPOINT, // e.g., 'localhost'
  // Set the port number for the MinIO server
  port: parseInt(process.env.MINIO_PORT, 10) || 9000,
  // Enable or disable SSL/TLS encryption
  useSSL: process.env.MINIO_USE_SSL === 'true', // true or false
  // Set the access key for the MinIO server
  accessKey: process.env.MINIO_ACCESS_KEY,
  // Set the secret key for the MinIO server
  secretKey: process.env.MINIO_SECRET_KEY,
});

// Export the MinIO client instance as the default export
export default minioClient;