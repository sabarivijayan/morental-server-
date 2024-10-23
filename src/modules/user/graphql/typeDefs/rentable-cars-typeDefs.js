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
    name: String!
    description: String!
    quantity: String!
    primaryImageUrl: String
    secondaryImagesUrls: [String]
    year: String!
    manufacturer: Manufacturer
  }

<<<<<<< HEAD
=======

>>>>>>> temp-branch
  input CarInput{
    id:String!
    name: String!
    pricePerDay: Int!
    transmissionType: String!
    fuelType: String
    manufacturer: String!
    numberOfSeats: String
    availableQuantity: Int
    year: String!
    type: String
    description: String!
    primaryImageUrl: String
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

<<<<<<< HEAD
export default RentableTypeDefs;
=======

export default RentableTypeDefs;
>>>>>>> temp-branch
