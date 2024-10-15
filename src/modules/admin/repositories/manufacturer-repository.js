import Manufacturer from "../models/manufacturer-model.js"; // Sequelize model

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
      const result = await Manufacturer.destroy({ where: { id } });
      return result > 0;
    } catch (error) {
      console.error("Error deleting manufacturer:", error);
      throw new Error("Failed to delete manufacturer");
    }
  }
}

export default ManufacturerRepository;
