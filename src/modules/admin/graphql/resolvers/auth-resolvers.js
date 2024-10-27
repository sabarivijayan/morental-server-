import adminHelper from "../../helpers/admin-helper.js";
import Admin from "../../models/admin-model.js";
import { validateLogin } from "../../../../utils/JOI/admin-joi.js";

/**
 * Resolver for authentication-related queries and mutations.
 */
const authResolver = {
  /**
   * Query resolvers.
   */
  Query: {
    /**
     * Retrieves an admin by ID.
     * 
     * @param {Object} _ - Unused parameter.
     * @param {Object} id - ID of the admin to retrieve.
     * @returns {Promise<Admin>} The retrieved admin.
     */
    getAdmin: async (_, { id }) => {
      try {
        // Attempt to find the admin by ID.
        const admin = await Admin.findByPk(id);
        if (!admin) {
          // If the admin is not found, throw an error.
          throw new Error('Admin not found');
        }
        // Return the found admin.
        return admin;
      } catch (error) {
        // If an error occurs, throw a new error with a generic message.
        throw new Error('Admin not found');
      }
    },
  },

  /**
   * Mutation resolvers.
   */
  Mutation: {
    /**
     * Handles admin login.
     * 
     * @param {Object} _ - Unused parameter.
     * @param {Object} email - Email of the admin to log in.
     * @param {Object} password - Password of the admin to log in.
     * @returns {Promise<Object>} An object containing the login token and admin data.
     */
    adminLogin: async (_, { email, password }) => {
      try {
        // Validate the login credentials using JOI.
        validateLogin({ email, password });

        // Attempt to find the admin by email.
        const admin = await adminHelper.findAdminByEmail(email);
        if (!admin) {
          // If the admin is not found, throw an error.
          throw new Error('Invalid credentials');
        }

        // Validate the password.
        const isPasswordValid = await adminHelper.validatePassword(password, admin.password);
        if (!isPasswordValid) {
          // If the password is invalid, throw an error.
          throw new Error('Invalid credentials');
        }

        // Generate a login token for the admin.
        const token = adminHelper.generateToken(admin);

        // Return the login token and admin data.
        return {
          token,
          admin: {
            id: admin.id,
            name: admin.name,
            email: admin.email,
            role: admin.role,
            createdAt: admin.createdAt,
            updatedAt: admin.updatedAt,
          },
        };
      } catch (error) {
        // If an error occurs, log the error and throw a new error with a generic message.
        console.error('Login error: ', error.message);
        throw new Error('Login failed: ' + error.message);
      }
    },
  },
};

export default authResolver;