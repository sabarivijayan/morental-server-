import { gql } from 'apollo-server-express';

const manufactureTypeDefs = gql`
  type Manufacturer {
    id: ID!
    name: String!
    country: String!
  }

  type Query {
    getManufacturers: [Manufacturer]
    getManufacturer(id: ID!): Manufacturer
  }

  type Mutation {
    addManufacturer(name: String!, country: String!): Manufacturer
    editManufacturer(id: ID!, name: String, country: String): Manufacturer
    deleteManufacturer(id: ID!): Boolean
  }
`;

export default manufactureTypeDefs;
