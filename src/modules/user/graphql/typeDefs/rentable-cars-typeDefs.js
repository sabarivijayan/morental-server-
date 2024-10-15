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
    manufacturerId: String!
    primaryImageUrl: String
    secondaryImagesUrls: [String]
    year: String!
  }

  input CarInput{
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
    addCarToTypesense(car: CarInput!): String
  }
`;

export default RentableTypeDefs;
