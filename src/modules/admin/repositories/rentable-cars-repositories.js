import Rentable from "../models/rentable-cars-model.js";
import Car from "../models/car-model.js";
import Manufacturer from "../models/manufacturer-model.js";

class RentableRepository {
  static async findRentableCarById(carId) {
    try {
      if (carId) {
        const rentable = await Rentable.findOne({ where: { carId } });
        return rentable;
      }
    } catch (error) {
      console.error("Error finding car: ", error);
      throw new Error("Failed to find Car");
    }
  }

  static async findAllRentable() {
    try {
      return await Rentable.findAll({
        include: [
          {
            model: Car,
            as: "car",
            include: {
              model: Manufacturer,
              as: "manufacturer",
            },
          },
        ],
      });
    } catch (error) {
      throw new Error(
        "Database error occured while fetching rentable vehicles: " +
          error.message
      );
    }
  }

  static async createRentableCars(data) {
    try {
      return await Rentable.create(data);
    } catch (error) {
      throw new Error("Database error occured while adding rentable cars");
    }
  }

  static async updateRentableCarsById(id, data) {
    try {
      const rentableCar = await Rentable.findByPk(id);
      if (!rentableCar) {
        throw new Error("Rentable car not found");
      }

      await rentableCar.update(data);
      return rentableCar;
    } catch (error) {
      throw new Error(
        "An error occurred while updating the rentable car: " + error.message
      );
    }
  }

  static async deleteRentableCarById(id) {
    try {
      const deleteRentable = await Rentable.destroy({
        where: { id },
      });
      if (deleteRentable === 0) {
        throw new Error("Rentable car not found");
      }

      return deleteRentable;
    } catch (error) {
      throw new Error(
        "An error occured while deleting the rentable car: " + error.message
      );
    }
  }

  static async getRentableCarById(id) {
    try {
      const rentableCar = await Rentable.findByPk(id);
      return rentableCar;
    } catch (error) {
      throw new Error("Failed to fetch car");
    }
  }
}

export default RentableRepository;
