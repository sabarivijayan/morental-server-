import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import AdminRepository from '../repositories/admin-repositories.js';
import { SECRET_KEY } from '../../../config/config.js';

class AdminHelper{
    constructor(){
        this.secretKey = SECRET_KEY;
    }

    async findAdminByEmail(email){
        try {
            return await AdminRepository.findAdminByEmail(email);
        } catch (error) {
            throw new Error('Error fetching admin');
        }
    }

    async validatePassword(enteredPassword, storedPassword) {
        try {
            return await bcrypt.compare(enteredPassword, storedPassword);
        } catch (error) {
            throw new Error(' Error validating the password');
        }
    }

    generateToken(admin){
        try {
            return jwt.sign(
                { id: admin.id, email: admin.email, role: admin.role},
                this.secretKey,
                { expiresIn: '1h' }
            );
        } catch (error) {
            throw new Error('Error generating token');
        }
    }
}

export default new AdminHelper();