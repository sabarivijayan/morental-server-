import authResolver from "./resolvers/auth-resolvers.js";
import authTypeDefs from "./typeDefs/auth-type-defs.js";

import manufacturerResolver from "./resolvers/manufacturer-resolver.js";
import manufactureTypeDefs from "./typeDefs/manufacturer-type-defs.js";

import carResolvers from "./resolvers/car-resolver.js";
import CarTypeDefs from "./typeDefs/car-type-defs.js";

import RentableCarResolvers from "./resolvers/rentable-cars-resolvers.js";
import RentableCarTypeDefs from "./typeDefs/rentable-car-type-defs.js";

import BookingAdminResolver from "./resolvers/booking-resolver.js";
import BookingAdminTypeDefs from "./typeDefs/bookings-type-defs.js";

const adminTypeDefs = [authTypeDefs, manufactureTypeDefs, CarTypeDefs, RentableCarTypeDefs, BookingAdminTypeDefs]; // Combine typeDefs
const adminResolvers = [authResolver, manufacturerResolver, carResolvers, RentableCarResolvers, BookingAdminResolver]; // Combine resolvers

export { adminTypeDefs, adminResolvers };