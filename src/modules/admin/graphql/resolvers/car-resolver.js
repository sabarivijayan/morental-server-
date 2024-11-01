// Import necessary dependencies
import { GraphQLUpload } from "graphql-upload";
import CarHelper from "../../helpers/car-helper.js";
import ManufacturerHelper from "../../helpers/manufacturer-helper.js";
import excel from "../../../../utils/excel.js";
import urlToFileConverter from "../../../../utils/url-to-file-converter.js";
import Manufacturer from "../../models/manufacturer-model.js";

// Define the car resolvers
const carResolvers = {
  // Define the Upload type
  Upload: GraphQLUpload,

  // Define the Query resolvers
  Query: {
    // Resolver to fetch all manufacturers
    getManufacturers: async () => {
      try {
        // Call the getManufacturers function from ManufacturerHelper
        return await ManufacturerHelper.getManufacturers();
      } catch (error) {
        // Log the error and throw a new error
        console.error("Error fetching manufacturers", error);
        throw new Error("Failed to fetch manufacturers");
      }
    },

    // Resolver to fetch all cars
    getCars: async (_, { pagination }) => {
      try {
        return await CarHelper.getCars(pagination);
      } catch (error) {
        console.error("Error fetching cars", error);
        throw new Error("Failed to fetch cars");
      }
    },

    // Resolver to fetch a car by ID
    getCarById: async (_, { id }) => {
      try {
        // Call the getCarById function from CarHelper
        return await CarHelper.getCarById(id);
      } catch (error) {
        // Log the error and throw a new error
        console.error("Error fetching car: ", error.message);
        throw new Error("Failed to fetch car");
      }
    },
  },

  // Define the Mutation resolvers
  Mutation: {
    // Resolver to add a new car
    addCar: async (_, { input, primaryImage, secondaryImages }) => {
      // Destructure the input object
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
        // Call the createCar function from CarHelper
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
        // Return the created car
        return car;
      } catch (error) {
        // Log the error and throw a new error
        console.error("Error in add car mutation: ", error.message);
        throw new Error(error.message || "Failed to add car");
      }
    },

    // Resolver to delete a car
    deleteCar: async (_, { id }) => {
      // Call the deleteCarById function from CarHelper
      const deleted = await CarHelper.deleteCarById(id);
      if (!deleted) {
        // Throw an error if the car is not found
        throw new Error("Vehicle not found");
      }
      // Return the ID of the deleted car
      return { id };
    },

    // Resolver to update a car
    updateCar: async (_, { id, input }) => {
      // Destructure the input object
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
        // Call the updateCar function from CarHelper
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
        // Return the updated car
        return updatedCar;
      } catch (error) {
        // Throw an error
        throw new Error(error.message || "Failed to edit vehicle");
      }
    },

    // Resolver to add cars from an Excel file
    async addCarByExcel(_, { excelFile }) {
      try {
        // Get the read stream from the Excel file
        const { createReadStream } = await excelFile;
        // Get the buffer from the read stream
        const buffer = await excel.getExcelBuffer(createReadStream);
        // Parse the Excel file
        const data = await excel.parseExcel(buffer);

        // Initialize a counter for added cars
        let addedCarsCount = 0;

        // Loop through each row in the Excel file
        for (const row of data) {
          // Convert the primary image URL to a file
          const primaryImageFile = await urlToFileConverter(row.primaryImageUrl);

          // Convert the secondary image URLs to files
          const secondaryImagesFiles = row.secondaryImagesUrls
            ? await Promise.all(
                row.secondaryImagesUrls.split(",").map((url) =>
                  urlToFileConverter(url.trim())
                )
              )
            : [];

          // Check if the manufacturer name is valid
          if (!row.manufacturerName || typeof row.manufacturerName !== "string") {
            throw new Error(`Invalid manufacturer name in row: ${JSON.stringify(row)}`);
          }

          // Find the manufacturer by name
          const manufacturer = await Manufacturer.findOne({
            where: { name: row.manufacturerName.trim() },
          });

          // Check if the manufacturer is found
          if (!manufacturer) {
            throw new Error(`Manufacturer with name "${row.manufacturerName}" not found`);
          }

          // Create the car data
          const carData = {
            name: row.name,
            type: row.type,
            description: row.description,
            numberOfSeats: row.numberOfSeats.toString(),
            fuelType: row.fuelType,
            transmissionType: row.transmissionType,
            quantity: row.quantity.toString(),
            primaryImage: primaryImageFile,
            secondaryImages: secondaryImagesFiles,
            year: row.year.toString(),
            manufacturerId: manufacturer.id,
          };

          try {
            // Create the car
            await CarHelper.createCar(carData);
            // Increment the added cars count
            addedCarsCount++;
          } catch (error) {
            // Log the error and throw a new error
            console.error("Error adding cars from excel: ", error.message);
            throw new Error(error.message || "Failed to add car");
          }
        }

        // Return the result
        return {
          success: true,
          message: `Added ${addedCarsCount} cars from excel file`,
          addedCarsCount,
        };
      } catch (error) {
        // Log the error and return an error message
        console.error("Error trying to convert excel: ", error);
        return {
          success: false,
          message: "Error trying to convert excel" + error.message,
          addedCarsCount: 0,
        };
      }
    },
  },

  // Define the Car resolvers
  Car: {
    // Resolver to get the manufacturer of a car
    manufacturer: async (car) => {
      try {
        // Call the getManufacturerById function from ManufacturerHelper
        return await ManufacturerHelper.getManufacturerById(car.manufacturerId);
      } catch (error) {
        // Log the error and return null
        console.error("Error resolving manufacturer: ", error.message);
        return null;
      }
    },
  },
};

// Export the car resolvers
export default carResolvers;