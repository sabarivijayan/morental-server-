import RentableCarsHelper from "../../helpers/rentable-cars-helper.js";
import { ApolloError } from "apollo-server-express";
import Rentable from "../../models/rentable-cars-model.js";

/**
 * Resolvers for rentable cars.
 */
const RentableCarResolvers = {
  /**
   * Query resolvers.
   */
  Query: {
    /**
     * Retrieves all rentable cars.
     * 
     * @returns {Promise<Array>} An array of rentable cars.
     */
    getRentableCars: async () => {
      try {
        // Call the helper function to retrieve all rentable cars.
        return await RentableCarsHelper.getAllRentableCars();
      } catch (error) {
        // Throw an error if there's an issue fetching rentable cars.
        throw new Error("Error fetching rentable cars: " + error.message);
      }
    },
  },
  /**
   * Mutation resolvers.
   */
  Mutation: {
    /**
     * Adds a new rentable car.
     * 
     * @param {Object} _ - Unused parameter.
     * @param {Object} args - The arguments for the mutation.
     * @param {string} args.carId - The ID of the car.
     * @param {number} args.pricePerDay - The price per day of the car.
     * @param {number} args.availableQuantity - The available quantity of the car.
     * 
     * @returns {Promise<Object>} The newly added rentable car.
     */
    addRentableCar: async (_, { carId, pricePerDay, availableQuantity }) => {
      try {
        // Call the helper function to add a new rentable car.
        return await RentableCarsHelper.addRentableCar({
          carId,
          pricePerDay,
          availableQuantity,
        });
      } catch (error) {
        // Throw an Apollo error if there's an issue adding the rentable car.
        throw new ApolloError(error.message || "Error adding rentable car");
      }
    },
    /**
     * Updates an existing rentable car.
     * 
     * @param {Object} _ - Unused parameter.
     * @param {Object} args - The arguments for the mutation.
     * @param {string} args.id - The ID of the rentable car.
     * @param {Object} args.input - The updated input for the rentable car.
     * 
     * @returns {Promise<Object>} The updated rentable car.
     */
    updateRentableCar: async (_, { id, input }) => {
      // Check if the ID is provided.
      if (!id) {
        throw new Error("Rentable car ID is required");
      }
      // Extract the updated price per day and available quantity.
      const { pricePerDay, availableQuantity } = input;

      try {
        // Call the helper function to update the rentable car.
        const updatedRentableCar = await RentableCarsHelper.updateRentableCar({
          id,
          pricePerDay,
          availableQuantity,
        });
        // Return the updated rentable car.
        return updatedRentableCar;
      } catch (error) {
        // Throw an error if there's an issue updating the rentable car.
        throw new Error(error.message || "Failed to update rentable car");
      }
    },
    /**
     * Deletes a rentable car.
     * 
     * @param {Object} _ - Unused parameter.
     * @param {Object} args - The arguments for the mutation.
     * @param {string} args.id - The ID of the rentable car.
     * 
     * @returns {Promise<string>} The ID of the deleted rentable car.
     */
    deleteRentableCar: async (_, { id }) => {
      // Call the model's destroy method to delete the rentable car.
      const deletedCar = await Rentable.destroy({ where: { id } });
      // Check if the rentable car was found.
      if (!deletedCar) {
        throw new Error("Rentable car not found");
      }
      // Return the ID of the deleted rentable car.
      return deletedCar.id;
    },
  },
};

export default RentableCarResolvers;