import { gql } from 'apollo-server-express';

const manufactureTypeDefs = gql`
  type Manufacturer {
    id: ID!
    name: String!
    country: String!
  }

  type ManufacturerConnection {
    manufacturers: [Manufacturer]!
    totalCount: Int
  }

  type Query {
    getManufacturers(offset: Int, limit: Int): ManufacturerConnection!
    getManufacturer(id: ID!): Manufacturer
  }

  type Mutation {
    addManufacturer(name: String!, country: String!): Manufacturer
    editManufacturer(id: ID!, name: String, country: String): Manufacturer
    deleteManufacturer(id: ID!): Boolean
  }
`;

export default manufactureTypeDefs;
