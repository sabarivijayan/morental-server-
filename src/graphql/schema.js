import { adminTypeDefs, adminResolvers } from '../modules/admin/graphql/index.js'
import { userResolvers, userTypeDefs } from '../modules/user/graphql/index.js';

const typeDefs = [adminTypeDefs, userTypeDefs];
const resolvers = [adminResolvers,userResolvers];

export { typeDefs, resolvers };