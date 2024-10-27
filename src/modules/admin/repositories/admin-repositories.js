import Admin from "../models/admin-model.js";

class AdminRepository {
    
  // Finds an admin by their email
  async findAdminByEmail(email) {
    try {
      // Query the database for an admin with the specified email
      const admin = await Admin.findOne({ where: { email } });
      
      // If no admin is found, throw an error
      if (!admin) {
        throw new Error('Admin not found');
      }
      
      return admin; // Return the admin if found
    } catch (error) {
      // Handle any errors that occur during the database query
      throw new Error('Error fetching admin');
    }
  }
}

export default new AdminRepository();
