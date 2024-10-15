import BookingCarResolvers from "./resolvers/booking-cars-resolvers.js";
import userAuthTypeDefs from "./typeDefs/auth-typeDefs.js";
import userAuthResolvers from "./resolvers/auth-resolvers.js";
import BookingCarTypeDefs from "./typeDefs/booking-cars-typeDefs.js";
import RentableCarResolver from "./resolvers/rentable-cars-resolvers.js";
import RentableTypeDefs from "./typeDefs/rentable-cars-typeDefs.js";


const userResolvers = [userAuthResolvers, BookingCarResolvers, RentableCarResolver];
const userTypeDefs = [userAuthTypeDefs, BookingCarTypeDefs, RentableTypeDefs]

export { userTypeDefs, userResolvers };