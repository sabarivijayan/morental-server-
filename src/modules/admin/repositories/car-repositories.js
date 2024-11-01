import Car from "../models/car-model.js";
import { deletecarFromTypesense } from "../../../config/typesense.js";
import Rentable from "../models/rentable-cars-model.js";
import BookingCar from "../../user/models/booking-cars-model.js";

class CarRepository {
  
  // Creates a new car record in the database
  static async createCar(carData) {
    try {
      // Create a new car entry in the Car model
      const car = await Car.create(carData);
      return {
        id: car.id,
        name: car.name,
        description: car.description,
        type: car.type,
        quantity: car.quantity,
        manufacturerId: car.manufacturerId,
        numberOfSeats: car.numberOfSeats,
        fuelType: car.fuelType,
        transmissionType: car.transmissionType,
        primaryImageUrl: car.primaryImageUrl,
        secondaryImagesUrls: car.secondaryImagesUrls,
        year: car.year,
      };
    } catch (error) {
      console.log("Error creating car: ", error);
      throw new Error("Failed to create car");
    }
  }

  // Finds a car by its name and optional manufacturer ID
  static async findCarByNameAndManufacturer(name, manufacturerId) {
    try {
      // Search for the car based on name, and optionally manufacturerId
      if (!manufacturerId) {
        const car = await Car.findOne({
          where: {
            name,
          },
        });
        return car;
      }
      const car = await Car.findOne({
        where: {
          name,
          manufacturerId,
        },
      });
      if (car) {
        return {
          status: true,
        };
      }
    } catch (error) {
      console.error("Error finding car: ", error);
      throw new Error("Failed to find car");
    }
  }

  // Retrieves all car records from the database
  static async getAllCars(offset = 0, limit = 10) {
    try {
      const { count, rows } = await Car.findAndCountAll({
        offset,
        limit,
        order: [['createdAt', 'DESC']]
      });

      return {
        cars: rows,
        total: count,
        hasMore: offset + limit < count
      };
    } catch (error) {
      console.error("Error fetching cars: ", error);
      throw new Error("Failed to fetch cars");
    }
  }

  // Deletes a car by its ID, including related records in Typesense
  static async deleteCarById(id) {
    try {
      // Check if there are any bookings associated with this car ID
      const bookings = await BookingCar.findAll({
        include: {
            model: Rentable,
            as: "rentable",
            where: { carId: id },
        },
    });

    // Prevent deletion if bookings are found
    if (bookings.length > 0) {
        console.warn(`Cannot delete car with ID: ${id} because active bookings exist`);
        throw new Error("Cannot delete car as there are active bookings associated with it");
    }
      // Find all rentables associated with this car ID
      const rentables = await Rentable.findAll({
        where: {
          carId: id,
        },
      });

      // Check if there are any rentables associated with this car
      if (rentables.length === 0) {
        console.warn(`No rentable cars found for this car ID: ${id}`);
        throw new Error(
          "No rentable cars are associated with this car or its id"
        );
      }

      // Delete each rentable from Typesense
      for (const rentable of rentables) {
        await deletecarFromTypesense(rentable.id);
      }

      // Delete the car record from the database
      const deletedCar = await Car.destroy({
        where: { id },
      });

      // Return null if no car was deleted, otherwise return the deleted car's ID
      if (deletedCar === 0) {
        return null;
      }
      return { id };
    } catch (error) {
      console.error("Error deleting car from database: ", error);
      throw new Error("Failed to delete car");
    }
  }

  // Updates a car by its ID with the provided data
  static async updateCarById(id, carData) {
    try {
      const car = await Car.findByPk(id);
      if (!car) {
        throw new Error("Car not found");
      }

      // Update the car with the provided data
      await car.update(carData);
      return car;
    } catch (error) {
      throw new Error("Failed to update car");
    }
  }

  // Updates the rental status of a car by its ID
  static async updateCarStatus(carId, isRentedOrNot) {
    try {
      const car = await Car.findByPk(carId);
      // Update the car's rental status
      const updateCarStatus = await car.update({
        isRentedOrNot: isRentedOrNot,
      });
    } catch (error) {
      console.error("Error updating car status: ", error);
      throw new Error("Failed to update car status");
    }
  }

  // Retrieves a single car by its ID
  static async getCarById(id) {
    try {
      const car = await Car.findByPk(id);
      return car;
    } catch (error) {
      throw new Error("Failed to fetch car");
    }
  }
}

export default CarRepository;
