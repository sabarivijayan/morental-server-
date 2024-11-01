import Rentable from "../../admin/models/rentable-cars-model.js";
import Car from "../../admin/models/car-model.js";
import Manufacturer from "../../admin/models/manufacturer-model.js";
import BookingCar from "../models/booking-cars-model.js";
import { Op } from "sequelize";

class BookingCarRepository {
  // Retrieve rentable cars based on specified filters
  static async getRentableCars(filters = {}) {
    // Base query to find rentable cars with available quantity greater than 0
    const whereClause = {
      availableQuantity: {
        [Op.gt]: 0, // Greater than 0 to ensure cars are available
      },
    };

    const carWhereClause = {};

    // Filter by number of seats if specified
    if (filters.numberOfSeats && filters.numberOfSeats.length > 0) {
      carWhereClause.numberOfSeats = {
        [Op.in]: filters.numberOfSeats, // Include specified number of seats
      };
    }

    // Filter by transmission type if specified
    if (filters.transmissionTypes && filters.transmissionTypes.length > 0) {
      carWhereClause.transmissionType = {
        [Op.in]: filters.transmissionTypes, // Include specified transmission types
      };
    }

    // Filter by fuel type if specified
    if (filters.fuelTypes && filters.fuelTypes.length > 0) {
      carWhereClause.fuelType = {
        [Op.in]: filters.fuelTypes, // Include specified fuel types
      };
    }

    // Filter by maximum price if specified
    if (filters.maxPrice && !isNaN(filters.maxPrice)) {
      whereClause.pricePerDay = {
        [Op.lte]: parseFloat(filters.maxPrice), // Less than or equal to the max price
      };
    }

    // Sorting options for the results
    let order = [];
    if (filters.sortBy) {
      const sortOrder = filters.sortOrder === "DESC" ? "DESC" : "ASC"; // Determine sort order
      if (filters.sortBy === "price") {
        order.push(["pricePerDay", sortOrder]); // Sort by price per day
      }
    }

    // Fetch rentable cars with applied filters, sorting, and included models
    const response = await Rentable.findAll({
      where: whereClause, // Apply the main filtering conditions
      include: [
        {
          model: Car,
          as: "car",
          where: carWhereClause, // Apply car-specific filtering
          include: [
            {
              model: Manufacturer,
              as: "manufacturer", // Include manufacturer details
            },
          ],
        },
      ],
      order, // Apply sorting
    });
    return response; // Return the fetched rentable cars
  }

  // Check if a car is available for the specified rental period
  static async checkCarAvailability(id, pickUpDate, dropOffDate) {
    const transaction = await Rentable.sequelize.transaction();
    try {
      // Lock the car record for the specified car ID
      const rentableCar = await Rentable.findByPk(id, {
        lock: transaction.LOCK.UPDATE,
        transaction,
      });

      if (!rentableCar) {
        throw new Error("Car not found.");
      }

      const finalAvailableQuantity = rentableCar.availableQuantity;

      // Ensure no double bookings
      const doubleBookings = await BookingCar.findAll({
        where: {
          carId: id,
          status: "booked",
          [Op.or]: [
            {
              pickUpDate: {
                [Op.between]: [pickUpDate, dropOffDate],
              },
            },
            {
              dropOffDate: {
                [Op.between]: [pickUpDate, dropOffDate],
              },
            },
            {
              [Op.and]: [
                { pickUpDate: { [Op.lte]: pickUpDate } },
                { dropOffDate: { [Op.gte]: dropOffDate } },
              ],
            },
          ],
        },
        transaction,
      });

      const bookedCount = doubleBookings.length;
      const availableQuantity = finalAvailableQuantity - bookedCount;

      await transaction.commit(); // Commit transaction if successful
      
      return availableQuantity > 0
    } catch (error) {
      await transaction.rollback(); // Rollback if an error occurs
      console.error("Error during car booking:", error);
      throw error;
    }
  }

  // Create a new booking with the provided data
  static async createBooking(bookingData) {
    return await BookingCar.create(bookingData); // Use the BookingCar model to create a new booking
  }

  // Update the status of a booking based on its Razorpay order ID
  static async updateBookedStatus(razorpayOrderId, status) {
    const booking = await BookingCar.findOne({
      where: { razorpayOrderId }, // Find the booking by Razorpay order ID
    });

    if (!booking) {
      throw new Error("Booking not found"); // Throw an error if the booking does not exist
    }

    booking.status = status; // Update the booking status
    await booking.save(); // Save the changes

    return booking; // Return the updated booking
  }

  // Fetch all bookings for a specific user by user ID
  static async fetchBookingsByUserId(userId) {
    try {
      return BookingCar.findAll({
        where: { userId }, // Filter by user ID
        include: [
          {
            model: Rentable,
            as: "rentable", // Include rentable car details
            include: [
              {
                model: Car,
                as: "car", // Include car details
                include: [
                  {
                    model: Manufacturer,
                    as: "manufacturer", // Include manufacturer details
                  },
                ],
              },
            ],
          },
        ],
      });
    } catch (error) {
      console.error("Error in Booking Repository: ", error);
      throw new Error("Query failed"); // Throw an error if the query fails
    }
  }
}

export default BookingCarRepository; // Export the BookingCarRepository class
