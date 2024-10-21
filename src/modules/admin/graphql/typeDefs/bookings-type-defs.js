import {gql} from 'apollo-server-express'

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
    manufacturer: Manufacturer!
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

  type FetchBooking{
    id: ID!
    carId: Int!
    userId: Int!
    pickUpDate: String!
    pickUpTime: String!
    dropOffDate: String!
    dropOffTime: String!
    pickUpLocation: String!
    dropOffLocation: String!
    address: String!
    phoneNumber: String!
    totalPrice: Float!
    status: String
    paymentMethod: String!
    deliveryDate: String
    rentable: Rentable
  }

  type FetchBookingResponse{
    status: Boolean!
    message: String!
    data: [FetchBooking]
  }

  type updateBooking {
    id: ID!
    status: String
    deliveryDate: String
  }
  type BookingResponse{
    status: Boolean!
    message: String!
    updatedBooking: updateBooking
  }

  type Query{
    fetchAllBookings: FetchBookingResponse!
  }

  type Mutation{
    bookingDelivery(id: String!): BookingResponse!
  }
`;

export default BookingCarTypeDefs;
