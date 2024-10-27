import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import AdminRepository from '../repositories/admin-repositories.js';
import { SECRET_KEY } from '../../../config/config.js';

class AdminHelper {
    constructor() {
        this.secretKey = SECRET_KEY; // Initialize secret key for JWT
    }

    // Finds an admin by their email address
    async findAdminByEmail(email) {
        try {
            return await AdminRepository.findAdminByEmail(email); // Return the found admin
        } catch (error) {
            throw new Error('Error fetching admin'); // Rethrow error with a message
        }
    }

    // Validates the entered password against the stored hashed password
    async validatePassword(enteredPassword, storedPassword) {
        try {
            return await bcrypt.compare(enteredPassword, storedPassword); // Compare the passwords and return the result
        } catch (error) {
            throw new Error('Error validating the password'); // Rethrow error with a message
        }
    }

    // Generates a JWT token for the admin
    generateToken(admin) {
        try {
            return jwt.sign(
                { id: admin.id, email: admin.email, role: admin.role }, // Payload containing admin details
                this.secretKey, // Secret key for signing the token
                { expiresIn: '1h' } // Token expiration time
            );
        } catch (error) {
            throw new Error('Error generating token'); // Rethrow error with a message
        }
    }
}

export default new AdminHelper(); // Export an instance of AdminHelper
