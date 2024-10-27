// Importing GraphQL type definitions and resolvers from admin and user modules
import { adminTypeDefs, adminResolvers } from '../modules/admin/graphql/index.js'
import { userResolvers, userTypeDefs } from '../modules/user/graphql/index.js'

// Combining type definitions from admin and user modules into a single array
const typeDefs = [adminTypeDefs, userTypeDefs];

// Combining resolvers from admin and user modules into a single array
const resolvers = [adminResolvers, userResolvers];

// Exporting combined type definitions and resolvers for use in the GraphQL schema
export { typeDefs, resolvers }