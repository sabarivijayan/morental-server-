import { gql } from "apollo-server-express";

const RentableTypeDefs = gql`
  scalar Float
  scalar Int

  type Manufacturer {
    id: ID!
    name: String!
    country: String!
  }

  type Car {
    id: ID!
    manufacturer: Manufacturer
    name: String!
    type: String!
    numberOfSeats: String!
    fuelType: String!
    transmissionType: String!
    description: String!
    quantity: String!
    primaryImageUrl: String
    secondaryImagesUrls: [String]
    year: String!
  }

  input ManufacturerInput {
    name: String!
  }

  input CarDetailsInput {
    name: String!
    type: String!
    description: String!
    numberOfSeats: String!
    transmissionType: String!
    fuelType: String!
    primaryImageUrl: String
    manufacturer: ManufacturerInput!
    year: String!
  }

  input CarInput {
    id: String!
    pricePerDay: Int!
    availableQuantity: Int!
    car: CarDetailsInput!
  }

  type RentableCar {
    id: ID!
    carId: ID!
    pricePerDay: Float!
    availableQuantity: Int!
    car: Car
  }
  
  type Query {
    getRentableCarsWithId(id: ID!): RentableCar
  }

  type Mutation {
    addcarToTypesense(car: CarInput!): String
  }
`;

export default RentableTypeDefs;