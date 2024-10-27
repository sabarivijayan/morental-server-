import Manufacturer from "../models/manufacturer-model.js"; // Sequelize model for Manufacturer
import { deletecarFromTypesense } from "../../../config/typesense.js";
import Car from "../models/car-model.js";
import Rentable from "../models/rentable-cars-model.js";

class ManufacturerRepository {
  
  // Creates a new manufacturer in the database
  static async createManufacturer({ name, country }) {
    try {
      const manufacturer = await Manufacturer.create({ name, country });
      return manufacturer;
    } catch (error) {
      console.error("Error creating manufacturer in the database:", error);
      throw new Error("Failed to create manufacturer");
    }
  }

  // Retrieves all manufacturers from the database
  static async findAll() {
    try {
      return await Manufacturer.findAll();
    } catch (error) {
      console.error("Error fetching manufacturers:", error);
      throw new Error("Failed to fetch manufacturers");
    }
  }

  // Finds a specific manufacturer by its ID
  static async findManufacturerById(id) {
    try {
      const manufacturer = await Manufacturer.findByPk(id);
      if (!manufacturer) {
        throw new Error("Manufacturer not found");
      }
      return manufacturer;
    } catch (error) {
      console.error("Error fetching manufacturer by ID:", error);
      throw new Error("Failed to fetch manufacturer");
    }
  }

  // Finds a manufacturer by its name
  static async findManufacturerByName(name) {
    try {
      const manufacturer = await Manufacturer.findOne({ where: { name } });
      return manufacturer;
    } catch (error) {
      console.error("Error finding manufacturer by name:", error);
      throw new Error("Failed to find manufacturer");
    }
  }

  // Updates a manufacturer's details using the provided updates
  static async updateManufacturer(id, updates) {
    try {
      const manufacturer = await Manufacturer.findByPk(id);
      if (!manufacturer) {
        throw new Error("Manufacturer not found");
      }
      await manufacturer.update(updates);
      return manufacturer;
    } catch (error) {
      console.error("Error updating manufacturer:", error);
      throw new Error("Failed to update manufacturer");
    }
  }

  // Deletes a manufacturer by ID, along with associated cars and rentables
  static async deleteManufacturer(id) {
    try {
      // Fetch all cars associated with this manufacturer
      const cars = await Car.findAll({
        where: { manufacturerId: id },
      });

      // Log if no cars are associated with the manufacturer
      if (cars.length === 0) {
        console.log(`No vehicles were found for the following manufacturer ID: ${id}`);
      }

      // Iterate over each car to delete associated rentables and the car itself
      for (const car of cars) {
        const rentables = await Rentable.findAll({ where: { carId: car.id } });

        // Delete each rentable from Typesense and the Rentable table
        for (const rentable of rentables) {
          await deletecarFromTypesense(rentable.id);
          await Rentable.destroy({ where: { id: rentable.id } });
        }
        
        // Delete the car record from the database
        await Car.destroy({ where: { id: car.id } });
      }

      // Delete the manufacturer from the database
      const result = await Manufacturer.destroy({ where: { id } });
      if (result === 0) {
        throw new Error("Manufacturer not found or already deleted");
      }
      return result > 0; // Return true if the manufacturer was deleted successfully
    } catch (error) {
      console.error("Error deleting manufacturer:", error);
      throw new Error("Failed to delete manufacturer");
    }
  }
}

export default ManufacturerRepository;
