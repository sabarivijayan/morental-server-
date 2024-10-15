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

  type Query {
    getCars: [Car!]!
    getCarById(id: String!): Car
  }

  type Mutation {
    addCar(
      input: CarInput!,
      primaryImage: Upload!,
      secondaryImages: [Upload!]!
    ): Car!

    updateCar( id: String!, input: EditCarInput!): Car!

    deleteCar(id: String!): Car
  }
`;

export default CarTypeDefs;
