import RentableRepository from "../repositories/rentable-cars-repositories.js";
import { deletecarFromTypesense } from "../../../config/typesense.js";
import CarRepository from "../repositories/car-repositories.js";
import BookingCar from "../../user/models/booking-cars-model.js";
class RentableCarsHelper {
  static async getRentableCarById(id) {
    try {
      const car = await RentableRepository.getRentableCarById(id);
      return car;
    } catch (error) {
      console.error("Error fetching Car:", error.message);
      throw new Error(error.message || "Failed to fetch Car");
    }
  }
  static async getAllRentableCars() {
    try {
      const rentableCar = await RentableRepository.findAllRentable();
      return rentableCar;
    } catch (error) {
      throw new Error("Error in the helper cannot fetch cars:" + error.message);
    }
  }

  static async addRentableCar(data) {
    try {
      const { carId, pricePerDay, availableQuantity } = data;

      if (!carId || !pricePerDay || !availableQuantity) {
        throw new Error(" Fill in all required fields: ");
      }

      const existingRentableCar = await RentableRepository.findRentableCarById(
        carId
      );
      if (existingRentableCar) {
        throw new Error("This car is already added to the rentable section");
      }

      const rentableCar = await RentableRepository.createRentableCars(data);
      if (rentableCar) {
        await CarRepository.updateCarStatus(carId, true);
      }
      return rentableCar;
    } catch (error) {
      throw new Error(error.message || "Failed to add rentable car");
    }
  }

  static async updateRentableCar({ id, pricePerDay, availableQuantity }) {
    if (!id) {
      throw new Error("Rentable car ID is required");
    }

    try {
      const rentableCar = await RentableRepository.getRentableCarById(id);
      if (!rentableCar) {
        throw new Error("Rentable car not found");
      }

      // Check if new data is different, otherwise no need to update
      if (
        rentableCar.pricePerDay === pricePerDay &&
        rentableCar.availableQuantity === availableQuantity
      ) {
        throw new Error("No changes detected");
      }

      // Update rentable car details
      const updatedRentableCar =
        await RentableRepository.updateRentableCarsById(id, {
          pricePerDay,
          availableQuantity,
        });

      return updatedRentableCar;
    } catch (error) {
      throw new Error(error.message || "Failed to update rentable car");
    }
  }

  static async deleteRentableCar(id) {
    try {
        // Check for associated bookings before deletion
        const bookings = await BookingCar.findAll({ where: { carId: id } });
        if (bookings.length > 0) {
            throw new Error("Cannot delete rentable car as it has existing bookings");
        }
        
        // Proceed with deletion if no bookings are found
        const deletedCar = await RentableRepository.deleteRentableCarById(id);
        
        if (!deletedCar) {
            throw new Error("Vehicle not found");
        }
        
        await deletecarFromTypesense(id);
        
        return deletedCar.id;
    } catch (error) {
        console.error("Error in Rentable Car Helper:", error);
        throw new Error("Error occurred while deleting the car");
    }
}

  
}

export default RentableCarsHelper;