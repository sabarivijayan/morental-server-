import { GraphQLUpload } from "graphql-upload";
import authHelpers from "../../helpers/auth-helpers.js";
import User from "../../models/auth-model.js";
import { verifyToken } from "../../../../utils/jwt.js";

const userAuthResolvers = {
  Upload: GraphQLUpload,
  Query: {
    fetchUser: async (_, __, { token }) => {
      if (!token) {
        throw new Error("Authorization token is not available");
      }
      const decodedToken = verifyToken(token.replace("Bearer", ""));

      const user = await User.findByPk(decodedToken.id);

      if (!user) {
        return {
          status: "error",
          message: "User not found",
          data: null,
        };
      }

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
    },
  },
  Mutation: {
    async registerUser(_, { input }) {
      const response = await authHelpers.registerUser(input);
      return response;
    },
    async userLogin(_, { email, password }) {
      const response = await authHelpers.loginUser(email, password);
      return response;
    },
    async sendOTP(_, { phoneNumber }) {
      try {
        const response = await authHelpers.sendOTP(phoneNumber);
        return response;
      } catch (error) {
        console.error("Error in sendOTP resolver:", error);
        return {
          status: "error",
          message: error.message || "Failed to send OTP",
        };
      }
    },
    async verifyOTP(_, { phoneNumber, otp }) {
      const response = await authHelpers.verifyOTP(phoneNumber, otp);
      return response;
    },
    async updateProfileImage(_, { userId, profileImage }) {
      try {
        const response = await authHelpers.updateProfileImage(
          userId,
          profileImage
        );
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
  },
};
export default userAuthResolvers;
