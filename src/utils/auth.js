import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const hashPassword = async (password) =>{
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};

const verifyPassword = async (password, hash)=>{
    return bcrypt.compare(password, hash);
};

const generateToken = (adminId)=>{
    return jwt.sign({ id: adminId }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d'});
};

module.exports = {
    hashPassword,
    verifyPassword,
    generateToken,
};