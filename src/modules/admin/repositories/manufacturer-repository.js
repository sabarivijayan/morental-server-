import Manufacturer from "../models/manufacturer-model.js"; // Sequelize model
import { deletecarFromTypesense } from "../../../config/typesense.js";
import Car from "../models/car-model.js";
import Rentable from "../models/rentable-cars-model.js";
class ManufacturerRepository {
  static async createManufacturer({ name, country }) {
    try {
      const manufacturer = await Manufacturer.create({
        name,
        country,
      });
      return manufacturer;
    } catch (error) {
      console.error("Error creating manufacturer in the database:", error);
      throw new Error("Failed to create manufacturer");
    }
  }

  static async findAll() {
    try {
      return await Manufacturer.findAll();
    } catch (error) {
      console.error("Error fetching manufacturers:", error);
      throw new Error("Failed to fetch manufacturers");
    }
  }

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

  static async findManufacturerByName(name) {
    try {
      const manufacturer = await Manufacturer.findOne({ where: { name } });
      return manufacturer;
    } catch (error) {
      console.error("Error finding manufacturer by name:", error);
      throw new Error("Failed to find manufacturer");
    }
  }

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

  static async deleteManufacturer(id) {
    try {

      const cars = await Car.findAll(
        {
          where: {manufacturerId: id}
        }
      )

      if(cars.length === 0){
        console.log(`No vehicle were found for the following manufacturer Id: ${id}`)
      }

      for(const car of cars){
        const rentables = await Rentable.findAll({where: {carId: car.id}});

        for(const rentable of rentables){
          await deletecarFromTypesense(rentable.id);
          await Rentable.destroy({where: { id: rentable.id}})
        }
        await Car.destroy({where: {id: car.id}})
      }
      const result = await Manufacturer.destroy({ where: { id } });
      if (result === 0) {
        throw new Error('Manufacturer not found or already deleted');
      }
      return result > 0;
    } catch (error) {
      console.error("Error deleting manufacturer:", error);
      throw new Error("Failed to delete manufacturer");
    }
  }
}

export default ManufacturerRepository;
