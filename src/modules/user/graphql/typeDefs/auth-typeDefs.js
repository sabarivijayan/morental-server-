import { gql } from "apollo-server-express";

const userAuthTypeDefs = gql`

scalar Upload

  type User {
    id: ID!
    firstName: String!
    lastName: String!
    phoneNumber: String!
    email: String!
    city: String
    state: String
    country: String
    pincode: String
    profileImage: String
    isPhoneNumberVerified: Boolean!
    phoneNumberVerifiedAt: String
  }

  type Response {
    status: String
    message: String!
    data: User
  }

  type LoginResponse {
    status: String
    message: String
    token: String
    data: User
  }

  type OtpResponse {
    status: String!
    message: String!
    otpId: String!
  }

  input RegistrationInput {
    firstName: String!
    lastName: String!
    phoneNumber: String!
    email: String!
    password: String!
    confirmPassword: String!
    city: String
    state: String
    country: String
    pincode: String
  }

  type Query {
    fetchUser: Response
  }

  type Mutation {
    registerUser(input: RegistrationInput): Response!
    userLogin(email: String!, password: String!): LoginResponse
    sendOTP(phoneNumber: String!): OtpResponse!
    verifyOTP(phoneNumber: String!, otp: String!): LoginResponse! # Removed otpId
    updateProfileImage(userId: ID!, profileImage: Upload): Response
  }
`;

export default userAuthTypeDefs;