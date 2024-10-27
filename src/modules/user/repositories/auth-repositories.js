import User from "../models/auth-model.js";

class AuthRepository {
  // Create a new user in the database
  async createNewUser(data) {
    return await User.create(data); // Use the User model to create a new user
  }

  // Find a user by their phone number
  async findUserByPhoneNumber(phoneNumber) {
    return await User.findOne({ where: { phoneNumber } }); // Search for a user with the specified phone number
  }

  // Update user information based on user ID
  async updateUser(userId, updatedData) {
    const user = await this.findById(userId); // Retrieve the user by ID
    if (!user) {
      throw new Error("User not found"); // Throw an error if the user does not exist
    }
    return await user.update(updatedData); // Update the user's data with the provided information
  }

  // Update the user's profile image based on user ID
  async updateUserProfileImage(userId, profileImage) {
    const user = await this.findById(userId); // Retrieve the user by ID
    if (!user) {
      throw new Error("User not found"); // Throw an error if the user does not exist
    }
    return user.update({ profileImage }); // Update the user's profile image
  }

  // Find a user by their ID
  async findById(id) {
    return await User.findByPk(id); // Retrieve the user using primary key (ID)
  }
}

// Export a singleton instance of AuthRepository
export default new AuthRepository();
