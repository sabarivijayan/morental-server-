import BookingCarResolvers from "./resolvers/booking-cars-resolvers.js";
import userAuthTypeDefs from "./typeDefs/auth-typeDefs.js";
import userAuthResolvers from "./resolvers/auth-resolvers.js";
import BookingCarTypeDefs from "./typeDefs/booking-cars-typeDefs.js";
import RentableCarResolver from "./resolvers/rentable-cars-resolvers.js";
import RentableTypeDefs from "./typeDefs/rentable-cars-typeDefs.js";

// Combine all user-related resolvers into one array
const userResolvers = [userAuthResolvers, BookingCarResolvers, RentableCarResolver];

// Combine all user-related type definitions into one array
const userTypeDefs = [userAuthTypeDefs, BookingCarTypeDefs, RentableTypeDefs];

// Export the combined type definitions and resolvers for use in the GraphQL server
export { userTypeDefs, userResolvers };