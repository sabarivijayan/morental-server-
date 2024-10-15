import { gql } from 'apollo-server-express';

const authTypeDefs = gql`
    type Admin{
        id: ID!
        name: String!
        email: String!
        role: String!
        createdAt: String!
        updatedAt: String!
    }
    type AuthPayload{
        token: String!
        admin: Admin!
    }
    type Query{
        getAdmin(id: ID!): Admin
    }

    type Mutation{
        adminLogin(email: String!, password: String!): AuthPayload!
    }
`;

export default authTypeDefs;