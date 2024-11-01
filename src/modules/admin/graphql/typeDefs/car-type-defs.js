import { gql } from 'apollo-server-express';

const CarTypeDefs = gql`
  scalar Upload

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

  type PaginatedCarsResponse {
    cars: [Car]!
    total: Int
    hasMore: Boolean!
  }

  input AdminCarInput {
    name: String!
    type: String!
    numberOfSeats: String!
    fuelType: String!
    transmissionType: String!
    description: String
    quantity: String!
    manufacturerId: String!
    year: String!
  }

  input EditCarInput {
    name: String!
    type: String!
    numberOfSeats: String!
    fuelType: String!
    transmissionType: String!
    description: String!
    quantity: String!
    primaryImage: Upload
    secondaryImages: [Upload!]
    year: String!
  }

  input PaginationInput {
    offset: Int
    limit: Int
  }

  type AddCarByExcelResponse {
    success: Boolean!
    message: String
    addedCarsCount: Int!
  }

  type Query {
    getCars(pagination: PaginationInput): PaginatedCarsResponse!
    getCarById(id: String!): Car
  }

  type Mutation {
    addCar(
      input: AdminCarInput!,
      primaryImage: Upload!,
      secondaryImages: [Upload!]!
    ): Car!
    
    updateCar(id: String!, input: EditCarInput!): Car!
    
    deleteCar(id: String!): Car
    
    addCarByExcel(excelFile: Upload!): AddCarByExcelResponse!
  }
`;


export default CarTypeDefs;
