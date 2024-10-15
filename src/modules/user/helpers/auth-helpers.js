import User from "../models/auth-model.js";
import bcrypt from 'bcrypt'
import twilio from 'twilio';
import { generateToken } from "../../../utils/jwt.js";
import AuthRepository from "../repositories/auth-repositories.js";
import dotenv from 'dotenv'
import minioClient from '../../../config/minio.js'

dotenv.config();

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const serviceSid = process.env.TWILIO_SERVICE_SID; // Twilio Verify v2 Service SID


class AuthHelper {
  // Function to send OTP
  async sendOTP(phoneNumber) {
    try {
      const verification = await client.verify.v2
        .services(serviceSid)
        .verifications.create({
          to: '+919188249981',
          channel: 'sms',
        });
        
      return {
        status: 'success',
        message: `OTP sent successfully to ${phoneNumber}`,
        sid: verification.sid,
      };
    } catch (error) {
      console.error('Error sending OTP:', error);
      throw new Error('Failed to send OTP');
    }
  }

  async verifyOTP(phoneNumber, otpCode) {
    try {
      const verification = await client.verify.v2
        .services(serviceSid)
        .verificationChecks.create({
          to: '+919188249981',
          code: otpCode,
        });

      if (verification.status === 'approved') {
        return {
          status: 'success',
          message: 'OTP verified successfully',
        };
      } else {
        return {
          status: 'error',
          message: 'Invalid OTP. Please try again.',
        };
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      throw new Error('Failed to verify OTP');
    }
  }

  async registerUser(input) {
    const { firstName, lastName, phoneNumber, email, password, city, state, country, pincode } = input;
  
    // Check if the user already exists by phone number or email
    const existingUserByPhone = await AuthRepository.findUserByPhoneNumber(phoneNumber);
    if (existingUserByPhone) {
      return {
        status: 'error',
        message: 'User with this phone number already exists.',
      };
    }
  
    const existingUserByEmail = await User.findOne({ where: { email } });
    if (existingUserByEmail) {
      return {
        status: 'error',
        message: 'User with this email already exists.',
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
      status: 'success',
      message: 'Registration completed successfully.',
      data: {
        id: createdUser.id,
        firstName: createdUser.firstName,
        lastName: createdUser.lastName,
        email: createdUser.email,
        phoneNumber: createdUser.phoneNumber,
      },
      token,
    };
  }

  async loginUser(email, password) {
    const user = await User.findOne({ where: { email } });
  
    if (!user) {
      return {
        status: 'error',
        message: 'User not found.',
      };
    }
  
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return {
        status: 'error',
        message: 'Invalid password.',
      };
    }
  
    if (!user.isPhoneNumberVerified) {
      return {
        status: 'error',
        message: 'Phone number is not verified. Please verify your phone number.',
      };
    }
  
    const token = generateToken(user);
  
    return {
      status: 'success',
      message: 'Login successful.',
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
        throw new Error('User not found');
      }
  
      // If no new image is provided, handle removal of the current image
      if (!profileImage && user.profileImage) {
        // Remove the existing image from Minio
        const imagePath = user.profileImage.split("/").slice(-1)[0]; // Get the last part of the URL
        await this.removeFromMinio(imagePath);
  
        // Update user profile image to null in the database
        const updatedUser = await AuthRepository.updateUserProfileImage(userId, null);
        return {
          status: "success",
          message: "Profile image removed successfully",
          data: updatedUser,
        };
      }
  
      // If a new image is provided, upload it to Minio
      if (profileImage) {
        const imageUrl = await this.uploadToMinio(profileImage, 'profile-images');
        const updatedUser = await AuthRepository.updateUserProfileImage(userId, imageUrl);
  
        return {
          status: "success",
          message: "Profile image updated successfully",
          data: updatedUser,
        };
      }
  
    } catch (error) {
      console.error('Error updating user profile image:', error.message);
      throw new Error('Failed to update profile image');
    }
  }
  async uploadToMinio(file, folder) {
    try {
      const { createReadStream, filename } = await file;
      const stream = createReadStream();
      const uniqueFilename = `${folder}/${filename}`; // Maintain unique path for storage
      const contentType = mime.lookup(filename) || 'application/octet-stream';
  
      // Upload to Minio in a single async step
      await minioClient.putObject(
        process.env.MINIO_BUCKET_NAME_PRIVATE,
        uniqueFilename,
        stream,
        { 'Content-Type': contentType }
      );
  
      // Return the presigned URL directly
      return await minioClient.presignedGetObject(
        process.env.MINIO_BUCKET_NAME_PRIVATE,
        uniqueFilename
      );
  
    } catch (error) {
      console.error('Error uploading image:', error.message);
      throw new Error('Image upload failed');
    }
  }
  async removeFromMinio(imagePath){
    try {
      await minioClient.removeObject(process.env.MINIO_BUCKET_NAME_PRIVATE, imagePath);
    } catch (error) {
      console.error('Error removing the image from Minio: ', error.message);
    }
  }  
}

export default new AuthHelper();
