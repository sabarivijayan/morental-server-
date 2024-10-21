import { GraphQLUpload } from "graphql-upload";
import CarHelper from "../../helpers/car-helper.js";
import ManufacturerHelper from "../../helpers/manufacturer-helper.js";
import excel from "../../../../utils/excel.js";
import urlToFileConverter from "../../../../utils/url-to-file-converter.js";
import Manufacturer from "../../models/manufacturer-model.js";


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

    async addCarByExcel(_, {excelFile}){
      try {
        const { createReadStream } = await excelFile;
        const buffer = await excel.getExcelBuffer(createReadStream);
        const data = await excel.parseExcel(buffer);
        
        let addedCarsCount = 0;

        for (const row of data){
          const primaryImageFile = await urlToFileConverter(row.primaryImageUrl);

          const secondaryImagesFiles = row.secondaryImagesUrls? await Promise.all(row.secondaryImagesUrls.split(',').map((url)=>urlToFileConverter(url.trim()))):[];

          if (!row.manufacturerName || typeof row.manufacturerName !== 'string') {
            throw new Error(`Invalid manufacturer name in row: ${JSON.stringify(row)}`);
          }
    
          // Find the manufacturer by name provided in the Excel sheet
          const manufacturer = await Manufacturer.findOne({
            where: { name: row.manufacturerName.trim() }, // 'manufacturerName' is the column in the Excel file
          });
    
          if (!manufacturer) {
            throw new Error(
              `Manufacturer with name "${row.manufacturerName}" not found`
            );
          }
    

          const carData = {
            name: row.name,
            type: row.type,
            description:row.description,
            numberOfSeats: row.numberOfSeats.toString(),
            fuelType: row.fuelType,
            transmissionType: row.transmissionType,
            quantity: row.quantity.toString(),
            primaryImage: primaryImageFile,
            secondaryImages: secondaryImagesFiles,
            year: row.year.toString(),
            manufacturerId: manufacturer.id,
          };
          try{
            await CarHelper.createCar(carData);
            addedCarsCount++ 
          }catch(error){
            console.error('Error adding cars from excel: ', error.message);
            throw new Error(error.message || 'Failed to add car');
          }
        }
        return{
          success: true,
          message: `Added ${addedCarsCount} cars from excel file`,
          addedCarsCount
        };
      } catch (error) {
        console.error('Error trying to convert excel: ', error);
        return{
          success: false,
          message: 'Error trying to convert excel' +error.message,
          addedCarsCount: 0,
        }
      }
    }
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
