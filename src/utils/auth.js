import bcrypt from 'bcrypt'; // Import bcrypt for password hashing and verification
import jwt from 'jsonwebtoken'; // Import jsonwebtoken for generating and verifying JWT tokens

// Function to hash a password
const hashPassword = async (password) => {
    // Generate a salt with 10 rounds
    const salt = await bcrypt.genSalt(10);
    // Hash the password using the generated salt
    return bcrypt.hash(password, salt);
};

// Function to verify a password against a hashed value
const verifyPassword = async (password, hash) => {
    // Compare the provided password with the hashed password
    return bcrypt.compare(password, hash);
};

// Function to generate a JWT token for the given admin ID
const generateToken = (adminId) => {
    // Sign and generate a token using the admin ID and a secret key
    return jwt.sign({ id: adminId }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
};

// Export the functions for use in other modules
module.exports = {
    hashPassword,
    verifyPassword,
    generateToken,
};
