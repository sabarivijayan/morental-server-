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

  type PaginationInfo {
    total: Int
    currentPage: Int
    totalPages: Int
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
  }

  type FetchBookingResponse {
    status: Boolean!
    message: String!
    data: [FetchBooking]
    pagination: PaginationInfo
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

  type ExcelExportResponse {
  buffer: String!
  filename: String!
}

type ExcelExportResult {
  status: Boolean!
  message: String!
  data: ExcelExportResponse
}

type PDFExportResponse {
    buffer: String!
    filename: String!
  }

  type PDFExportResult {
    status: Boolean!
    message: String!
    data: PDFExportResponse
  }

  type Query {
    fetchAllBookings(page: Int, limit: Int): FetchBookingResponse!
  }

  type Mutation{
    bookingDelivery(id: String!): BookingResponse!
    exportBookingsExcel: ExcelExportResult!
    exportBookingsPDF: PDFExportResult!
  }
`;

export default BookingCarTypeDefs;
