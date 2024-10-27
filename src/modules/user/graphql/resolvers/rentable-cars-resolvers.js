import RentableCarHelper from "../../helpers/rentable-cars-helpers.js";
import { addcarToTypesense } from "../../../../config/typesense.js";

const RentableCarResolver = {
  Query: {
    // Fetches a rentable car by its ID
    getRentableCarsWithId: async (_, { id }) => {
      return await RentableCarHelper.getRentableCarById(id);
    },
  },

  Mutation: {
    // Adds a car to Typesense for search capabilities
    addcarToTypesense: async (_, { car }) => {
      console.log(car); // Log the car object received for debugging
      try {
        // Prepare the car object for Typesense
        const typesenseCar = {
          id: car.id,
          name: car.name,
          type: car.type,
          pricePerDay: car.pricePerDay,
          transmissionType: car.transmissionType,
          fuelType: car.fuelType,
          year: car.year,
          availableQuantity: car.availableQuantity,
          manufacturer: car.manufacturer,
          numberOfSeats: car.numberOfSeats,
          primaryImageUrl: car.primaryImageUrl,
          description: car.description,
        };

        // Call the helper function to add the car to Typesense
        await addcarToTypesense(typesenseCar);
        return "Car added to Typesense successfully"; // Success message
      } catch (error) {
        console.error("Error adding car to Typesense:", error);
        throw new Error("Failed to add car"); // Error handling
      }
    },
  },
};

export default RentableCarResolver;
