import Rentable from "../models/rentable-cars-model.js";
import Car from "../models/car-model.js";
import Manufacturer from "../models/manufacturer-model.js";
import BookingCar from "../../user/models/booking-cars-model.js";

class RentableRepository {
  // Finds a rentable car by carId, if provided
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

  // Retrieves all rentable cars along with their associated car and manufacturer details
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
        "Database error occurred while fetching rentable vehicles: " +
          error.message
      );
    }
  }

  // Creates a new rentable car entry in the database
  static async createRentableCars(data) {
    try {
      return await Rentable.create(data);
    } catch (error) {
      throw new Error("Database error occurred while adding rentable cars");
    }
  }

  // Updates an existing rentable car by its ID, if found
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

  // Deletes a rentable car by ID, throwing an error if the car is not found
  static async deleteRentableCarById(id) {
    try {
      const bookings = await BookingCar.findAll({
        where:{carId:id}
      });

      console.log("Bookings:",bookings)

      if (bookings.length > 0) {
        throw new Error(
          "Cannot delete rentable car as it has existing bookings"
        );
      }

      const deleteRentable = await Rentable.destroy({
        where: { id },
      });

      if (deleteRentable === 0) {
        throw new Error("Rentable car not found");
      }

      return deleteRentable;
    } catch (error) {
      throw new Error(
        "An error occurred while deleting the rentable car: " + error.message
      );
    }
  }

  // Fetches a rentable car by ID
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
