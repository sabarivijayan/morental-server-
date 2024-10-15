import RentableCarsHelper from "../../helpers/rentable-cars-helper.js";
import { ApolloError } from "apollo-server-express";
import Rentable from "../../models/rentable-cars-model.js";

const RentableCarResolvers = {
  Query: {
    getRentableCars: async () => {
      try {
        return await RentableCarsHelper.getAllRentableCars();
      } catch (error) {
        throw new Error("Error fetching rentable cars: " + error.message);
      }
    },
  },
  Mutation: {
    addRentableCar: async (_, { carId, pricePerDay, availableQuantity }) => {
      try {
        return await RentableCarsHelper.addRentableCar({
          carId,
          pricePerDay,
          availableQuantity,
        });
      } catch (error) {
        throw new ApolloError(error.message || "Error adding rentable car");
      }
    },
    updateRentableCar: async (_, { id, input }) => {
      if (!id) {
        throw new Error("Rentable car ID is required");
      }
      const { pricePerDay, availableQuantity } = input;

      try {
        const updatedRentableCar = await RentableCarsHelper.updateRentableCar({
          id,
          pricePerDay,
          availableQuantity,
        });
        return updatedRentableCar;
      } catch (error) {
        throw new Error(error.message || "Failed to update rentable car");
      }
    },
    deleteRentableCar: async (_, { id }) => {
      const deletedCar = await Rentable.destroy({ where: { id } });
      if (!deletedCar) {
        throw new Error("Rentable car not found");
      }
      return deletedCar.id;
    },
  },
};

export default RentableCarResolvers;
