import { GraphQLUpload } from "graphql-upload";
import CarHelper from "../../helpers/car-helper.js";
import ManufacturerHelper from "../../helpers/manufacturer-helper.js";

const carResolvers = {
  Upload: GraphQLUpload,

  Query: {
    getManufacturers: async () => {
      try {
        return await ManufacturerHelper.getManufacturers();
      } catch (error) {
        console.error("Error fetching manufacturers", error);
        throw new Error("Failed to fetch manufacturers");
      }
    },

    getCars: async () => {
      try {
        return await CarHelper.getCars();
      } catch (error) {
        console.error("Error fetching cars", error);
        throw new Error("Failed to fetch cars");
      }
    },

    getCarById: async (_, { id }) => {
      try {
        return await CarHelper.getCarById(id);
      } catch (error) {
        console.error("Error fetching car: ", error.message);
        throw new Error("Failed to fetch car");
      }
    },
  },

  Mutation: {
    addCar: async (_, { input, primaryImage, secondaryImages }) => {
      const {
        name,
        description,
        type,
        numberOfSeats,
        fuelType,
        transmissionType,
        quantity,
        manufacturerId,
        year,
      } = input;
      try {
        const car = await CarHelper.createCar({
          manufacturerId,
          name,
          numberOfSeats,
          type,
          fuelType,
          transmissionType,
          description,
          quantity,
          primaryImage,
          secondaryImages,
          year,
        });
        return car;
      } catch (error) {
        console.error("Error in add car mutation: ", error.message);
        throw new Error(error.message || "Failed to add car");
      }
    },

    deleteCar: async (_, { id }) => {
      const deleted = await CarHelper.deleteCarById(id);
      if (!deleted) {
        throw new Error("Vehicle not found");
      }
      return { id };
    },

    updateCar: async (_, { id, input }) => {
      const {
        name,
        type,
        description,
        numberOfSeats,
        fuelType,
        transmissionType,
        quantity,
        primaryImage,
        secondaryImages,
        year,
      } = input;
      try {
        const updatedCar = await CarHelper.updateCar({
          id,
          name,
          type,
          description,
          numberOfSeats,
          fuelType,
          transmissionType,
          quantity,
          primaryImage,
          secondaryImages,
          year,
        });
        return updatedCar;
      } catch (error) {
        throw new Error(error.message || "Failed to edit vehicle");
      }
    },
  },

  Car: {
    manufacturer: async (car) => {
      try {
        return await ManufacturerHelper.getManufacturerById(car.manufacturerId);
      } catch (error) {
        console.error("Error resolving manufacturer: ", error.message);
        return null;
      }
    },
  },
  
};

export default carResolvers;
