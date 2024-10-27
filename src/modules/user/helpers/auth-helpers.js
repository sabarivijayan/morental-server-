import User from "../models/auth-model.js";
import bcrypt from "bcrypt";
import { generateToken } from "../../../utils/jwt.js";
import AuthRepository from "../repositories/auth-repositories.js";
import dotenv from "dotenv";
import minioClient from "../../../config/minio.js";
import axios from "axios";
import mime from "mime-types";
dotenv.config();

class AuthHelper {
  // Send OTP using AUTOGEN2 with the Morental template
  async sendOTP(phoneNumber) {
    try {
      const apiKey = process.env.TWO_FACTOR_API_KEY;
      const otpTemplateName = "Morental";
      const sendOtpUrl = `https://2factor.in/API/V1/${apiKey}/SMS/${phoneNumber}/AUTOGEN2/${otpTemplateName}`;

      const response = await axios.get(sendOtpUrl);

      // Check if OTP was sent successfully
      if (response.data.Status !== "Success") {
        return {
          status: "error",
          message: response.data.Details || "Failed to send OTP",
        };
      }

      return {
        status: "success",
        message: "OTP sent successfully",
      };
    } catch (error) {
      console.error("Error sending OTP:", error.message);
      return {
        status: "error",
        message: "Error sending OTP",
      };
    }
  }

  // Verify OTP using the phone number and the entered OTP
  async verifyOTP(phoneNumber, otpEntered) {
    try {
      const apiKey = process.env.TWO_FACTOR_API_KEY;
      const verifyOtpUrl = `https://2factor.in/API/V1/${apiKey}/SMS/VERIFY3/${phoneNumber}/${otpEntered}`;

      const response = await axios.get(verifyOtpUrl);

      // Check if OTP verification was successful
      if (response.data.Status !== "Success") {
        return {
          status: "error",
          message: response.data.Details || "Invalid OTP",
        };
      }

      return {
        status: "success",
        message: "OTP verified successfully",
      };
    } catch (error) {
      console.error("Error verifying OTP:", error.message);
      return {
        status: "error",
        message: "Error verifying OTP",
      };
    }
  }

  async registerUser(input) {
    const {
      firstName,
      lastName,
      phoneNumber,
      email,
      password,
      city,
      state,
      country,
      pincode,
    } = input;

    // Check for existing user by phone number
    const existingUserByPhone = await AuthRepository.findUserByPhoneNumber(
      phoneNumber
    );
    if (existingUserByPhone) {
      return {
        status: "error",
        message: "User with this phone number already exists.",
      };
    }

    // Check for existing user by email
    const existingUserByEmail = await User.findOne({ where: { email } });
    if (existingUserByEmail) {
      return {
        status: "error",
        message: "User with this email already exists.",
      };
    }

    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      firstName,
      lastName,
      phoneNumber,
      email,
      password: hashedPassword,
      city,
      state,
      country,
      pincode,
      isPhoneNumberVerified: true,
      phoneNumberVerifiedAt: new Date(),
    };

    // Create new user in the database
    const createdUser = await AuthRepository.createNewUser(newUser);

    const token = generateToken(createdUser);

    return {
      status: "success",
      message: "Registration completed successfully.",
      data: createdUser,
      token,
    };
  }

  async loginUser(email, password) {
    const user = await User.findOne({ where: { email } });

    // Check if user exists
    if (!user) {
      return {
        status: "error",
        message: "User not found.",
        token: null,
      };
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return {
        status: "error",
        message: "Invalid password.",
      };
    }

    // Check if phone number is verified
    if (!user.isPhoneNumberVerified) {
      return {
        status: "error",
        message:
          "Phone number is not verified. Please verify your phone number.",
      };
    }

    const token = generateToken(user);

    return {
      status: "success",
      message: "Login successful.",
      token,
      data: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
      },
    };
  }

  async updateUserProfile(userId, updatedData) {
    try {
      const user = await AuthRepository.findById(userId);
      // Check if user exists
      if (!user) {
        return {
          status: "error",
          message: "User not found",
        };
      }
      const { password, confirmPassword, ...profileData } = updatedData;
      const updatedUser = await AuthRepository.updateUser(userId, profileData);
      // Check if update was successful
      if (!updatedUser) {
        return {
          status: "error",
          message: "Failed to update user profile",
        };
      }

      const { password: _, ...safeUserData } = updatedUser.toJSON();
      return {
        status: "success",
        message: "User profile updated successfully",
        data: safeUserData,
      };
    } catch (error) {
      console.error("Error updating user profile: ", error.message);
      return {
        status: "error",
        message: "Failed to update user profile",
      };
    }
  }

  async updatePassword(
    userId,
    { currentPassword, newPassword, confirmPassword }
  ) {
    try {
      const user = await AuthRepository.findById(userId);
      // Check if user exists
      if (!user) {
        return {
          status: "error",
          message: "User not found",
        };
      }
      const isCurrentPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password
      );
      if (!isCurrentPasswordValid) {
        return {
          status: "error",
          message: "Current password is incorrect",
        };
      }

      // Validate new password
      if (newPassword !== confirmPassword) {
        return {
          status: "error",
          message: "New password and confirm password do not match",
        };
      }

      // Hash and update new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await AuthRepository.updateUser(userId, { password: hashedPassword });

      return {
        status: "success",
        message: "Password updated successfully",
      };
    } catch (error) {
      console.error("Error updating password:", error.message);
      return {
        status: "error",
        message: "Error updating password",
      };
    }
  }

  async updateProfileImage(userId, profileImage) {
    try {
      const user = await AuthRepository.findById(userId);
      // Check if user exists
      if (!user) {
        throw new Error("User not found");
      }

      // If no image is provided and user has one, remove it
      if (!profileImage && user.profileImage) {
        const imagePath = user.profileImage.split("/").slice(-1)[0];
        await this.removeFromMinio(imagePath);

        const updatedUser = await AuthRepository.updateUserProfileImage(
          userId,
          null
        );
        return {
          status: "success",
          message: "Profile image removed successfully",
          data: updatedUser,
        };
      }

      // If a new image is provided, handle the upload
      if (profileImage) {
        const { filename } = await profileImage;
        const imagePath = `profile-images/${filename}`;

        const exists = await this.doesMinioObjectExist(imagePath);
        // Remove existing image if it exists
        if (exists) {
          await this.removeFromMinio(imagePath);
        }

        // Upload new image
        const imageUrl = await this.uploadToMinio(
          profileImage,
          "profile-images"
        );

        const updatedUser = await AuthRepository.updateUserProfileImage(
          userId,
          imageUrl
        );

        return {
          status: "success",
          message: "Profile image updated successfully",
          data: updatedUser,
        };
      }
    } catch (error) {
      console.error("Error updating user profile image:", error.message);
      throw new Error("Failed to update profile image");
    }
  }

  async doesMinioObjectExist(imagePath) {
    try {
      await minioClient.statObject(
        process.env.MINIO_PRIVATE_BUCKET_NAME,
        imagePath
      );
      return true;
    } catch (error) {
      // Return false if the object does not exist
      if (error.code === "NoSuchKey" || error.message === "Not Found") {
        return false;
      }
      console.error("Error checking object existence in Minio:", error.message);
      throw new Error("Failed to check object existence in Minio");
    }
  }

  async uploadToMinio(file, folder) {
    try {
      const { createReadStream, filename } = await file;
      const stream = createReadStream();
      const uniqueFilename = `${folder}/${filename}`;
      const contentType = mime.lookup(filename) || "application/octet-stream";

      await minioClient.putObject(
        process.env.MINIO_PRIVATE_BUCKET_NAME,
        uniqueFilename,
        stream,
        { "Content-Type": contentType }
      );

      return await minioClient.presignedGetObject(
        process.env.MINIO_PRIVATE_BUCKET_NAME,
        uniqueFilename
      );
    } catch (error) {
      console.error("Error uploading image:", error.message);
      throw new Error("Image upload failed");
    }
  }

  async removeFromMinio(imagePath) {
    try {
      await minioClient.removeObject(
        process.env.MINIO_PRIVATE_BUCKET_NAME,
        imagePath
      );
    } catch (error) {
      console.error("Error removing the image from Minio:", error.message);
      throw new Error("Failed to remove image from Minio");
    }
  }
}

export default new AuthHelper();
