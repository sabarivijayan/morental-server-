import User from "../models/auth-model.js";
import bcrypt from "bcrypt";
import { generateToken } from "../../../utils/jwt.js";
import AuthRepository from "../repositories/auth-repositories.js";
import dotenv from "dotenv";
import minioClient from "../../../config/minio.js";
import axios from "axios";
import mime from 'mime-types'
dotenv.config();

class AuthHelper {
    // Send OTP using AUTOGEN2 with the Morental template
    async sendOTP(phoneNumber) {
      try {
        const apiKey = process.env.TWO_FACTOR_API_KEY;
        const otpTemplateName = "Morental";  // Morental as the OTP template name
        const sendOtpUrl = `https://2factor.in/API/V1/${apiKey}/SMS/${phoneNumber}/AUTOGEN2/${otpTemplateName}`;
        
        const response = await axios.get(sendOtpUrl);
        
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

    // Check if the user already exists by phone number or email
    const existingUserByPhone = await AuthRepository.findUserByPhoneNumber(
      phoneNumber
    );
    if (existingUserByPhone) {
      return {
        status: "error",
        message: "User with this phone number already exists.",
      };
    }

    const existingUserByEmail = await User.findOne({ where: { email } });
    if (existingUserByEmail) {
      return {
        status: "error",
        message: "User with this email already exists.",
      };
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user object
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
      isPhoneNumberVerified: true, // Set to true as OTP is verified before registration
      phoneNumberVerifiedAt: new Date(),
    };

    // Save the user in the database
    const createdUser = await AuthRepository.createNewUser(newUser);

    // Generate a token for the newly registered user
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

    if (!user) {
      return {
        status: "error",
        message: "User not found.",
        token: null,
      };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return {
        status: "error",
        message: "Invalid password.",
      };
    }

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

  async updateProfileImage(userId, profileImage) {
    try {
      const user = await AuthRepository.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      // If no new image is provided, handle removal of the current image
      if (!profileImage && user.profileImage) {
        // Remove the existing image from Minio
        const imagePath = user.profileImage.split("/").slice(-1)[0]; // Get the last part of the URL
        await this.removeFromMinio(imagePath);

        // Update user profile image to null in the database
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

      // If a new image is provided, upload it to Minio
      if (profileImage) {
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

  async uploadToMinio(file, folder) {
    try {
      const { createReadStream, filename } = await file;
      const stream = createReadStream();
      const uniqueFilename = `${folder}/${filename}`; // Maintain unique path for storage
      const contentType = mime.lookup(filename) || "application/octet-stream";

      // Upload to Minio in a single async step
      await minioClient.putObject(
        process.env.MINIO_PRIVATE_BUCKET_NAME,
        uniqueFilename,
        stream,
        { "Content-Type": contentType }
      );

      // Return the presigned URL directly
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
      console.error("Error removing the image from Minio: ", error.message);
    }
  }
}

export default new AuthHelper();
