import { GraphQLUpload } from "graphql-upload";
import authHelpers from "../../helpers/auth-helpers.js";
import User from "../../models/auth-model.js";
import { verifyToken } from "../../../../utils/jwt.js";


const userAuthResolvers = {
  Upload: GraphQLUpload,
  
  Query: {
    // Resolver to fetch a user by their token
    fetchUser: async (_, __, { token }) => {
      try {
        if (!token) {
          throw new Error("Authorization token is not available");
        }

        const strippedToken = token.replace("Bearer ", "").trim();
        const decodedToken = verifyToken(strippedToken); // Decode token to get user ID
        const user = await User.findByPk(decodedToken.id);

        if (!user) {
          return {
            status: "error",
            message: "User not found",
            data: null,
          };
        }

        // Return user details if found
        return {
          status: "success",
          message: "User found",
          data: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            city: user.city,
            state: user.state,
            country: user.country,
            pincode: user.pincode,
            profileImage: user.profileImage || null,
          },
        };
      } catch (error) {
        console.error("Error in fetchUser resolver:", error); // Log the actual error
        throw new Error(error.message); // Rethrow the error to be caught by Apollo Client
      }
    },
  },
  
  Mutation: {
    // Resolver for user registration
    async registerUser(_, { input }) {
      try {
        const response = await authHelpers.registerUser(input);
        return response;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    
    // Resolver for user login
    async userLogin(_, { email, password }) {
      try {
        const response = await authHelpers.loginUser(email, password);
        return response;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    
    // Resolver to send an OTP to the user's phone number
    async sendOTP(_, { phoneNumber }) {
      const response = await authHelpers.sendOTP(phoneNumber);
      return response;
    },
    
    // Resolver to verify the OTP
    async verifyOTP(_, { phoneNumber, otp }) {
      const response = await authHelpers.verifyOTP(phoneNumber, otp);
      return response;
    },
    
    // Resolver to update the user's profile image
    async updateProfileImage(_, { userId, profileImage }) {
      try {
        const response = await authHelpers.updateProfileImage(userId, profileImage);
        return response;
      } catch (error) {
        console.error("Error updating profile picture: ", error.message);
        return {
          status: "error",
          message: "Failed to update profile picture",
          data: null,
        };
      }
    },
    
    // Resolver to update user profile information
    async updateUserProfile(_, { userId, input }) {
      try {
        const response = await authHelpers.updateUserProfile(userId, input);
        return response;
      } catch (error) {
        console.error("Error updating user profile: ", error.message);
        return {
          status: "error",
          message: "Failed to update user profile",
          data: null,
        };
      }
    },
    
    // Resolver to update the user's password
    async updatePassword(_, { userId, input }) {
      try {
        const response = await authHelpers.updatePassword(userId, input);
        return response;
      } catch (error) {
        return {
          status: "error",
          message: "Failed to update password",
        };
      }
    },
  },
};

export default userAuthResolvers;
