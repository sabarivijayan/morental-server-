import bcrypt from 'bcryptjs';
import Admin from './modules/admin/models/admin-model.js';

const seedAdmin = async () => {
  const hashedPassword = await bcrypt.hash('adminKryptic', 10);
  await Admin.create({
    name: 'Admin Kryptic',
    email: 'adminKryptic@gmail.com',
    password: hashedPassword,
    role: 'admin'
  });
};

export default seedAdmin;