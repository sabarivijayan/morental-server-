import authResolver from "./resolvers/auth-resolvers.js";
import authTypeDefs from "./typeDefs/auth-type-defs.js";

import manufacturerResolver from "./resolvers/manufacturer-resolver.js";
import manufactureTypeDefs from "./typeDefs/manufacturer-type-defs.js";

import carResolvers from "./resolvers/car-resolver.js";
import CarTypeDefs from "./typeDefs/car-type-defs.js";

import RentableCarResolvers from "./resolvers/rentable-cars-resolvers.js";
import RentableCarTypeDefs from "./typeDefs/rentable-car-type-defs.js";

const adminTypeDefs = [authTypeDefs, manufactureTypeDefs, CarTypeDefs, RentableCarTypeDefs]; // Combine typeDefs
const adminResolvers = [authResolver, manufacturerResolver, carResolvers, RentableCarResolvers]; // Combine resolvers

export { adminTypeDefs, adminResolvers };