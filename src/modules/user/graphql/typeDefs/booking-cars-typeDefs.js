import { gql } from "apollo-server-express";

const BookingCarTypeDefs = gql`
  scalar Float
  scalar Int

  type Manufacturer {
    id: ID!
    name: String!
    country: String
  }
  type Car {
    id: ID!
    name: String!
    type: String!
    numberOfSeats: String!
    fuelType: String!
    transmissionType: String!
    description: String!
    quantity: String!
    manufacturerId: String!
    primaryImageUrl: String
    secondaryImagesUrls: [String]
    year: String!
  }

  type Rentable{
    id: ID!
    carId: ID!
    pricePerDay: Float!
    availableQuantity: Int!
    car: Car!
  }

  type Booking{
    id: ID!
    carId: ID!
    userId: ID!
    pickUpDate: String!
    dropOffDate: String!
    totalPrice: Float!
    status: String!
    createdAt: String!
    updatedAt: String!
  }

  input GenerateBookingInput{
    carId: ID!
    pickUpDate: String!
    dropOffDate: String!
    totalPrice: Float!
    userInfo: String!
  }

  type PaymentResponse{
    state: String!
    message: String!
    razorpayOrderId: String!
    amount: Float!
    currency: String!
  }
  type BookingResponse{
    status: String!
    message: String!
    data: Booking

  }
  input PaymentInput{
    razorpayPaymentId: String!
    razorpayOrderId: String!
    razorpaySignature: String!
  }

  type Query{
    getAvailableCars(pickUpDate: String!, dropOffDate: String!): [Rentable]
  }

  type Mutation{
    generatePaymentOrder(totalPrice: Float!, bookingInput: GenerateBookingInput!) : PaymentResponse!
    verifyPaymentAndCreateBooking(paymentDetails: PaymentInput!, bookingInput: GenerateBookingInput!):BookingResponse!
  }
`;

export default BookingCarTypeDefs;
