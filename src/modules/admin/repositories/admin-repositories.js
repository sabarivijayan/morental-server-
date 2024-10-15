import Admin from "../models/admin-model.js";

class AdminRepository {
    
  async findAdminByEmail(email) {
    try {
      const admin = await Admin.findOne({ where: { email } });
      if (!admin) {
        throw new Error('Admin not found');
      }
      return admin;
    } catch (error) {
      throw new Error('Error fetching admin');
    }
  }
}

export default new AdminRepository();