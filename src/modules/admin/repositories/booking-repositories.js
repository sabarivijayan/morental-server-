import BookingCar from "../../user/models/booking-cars-model.js";
import Manufacturer from "../models/manufacturer-model.js";
import Rentable from "../models/rentable-cars-model.js";
import Car from "../models/car-model.js";

class BookingAdminRepository {
  // Fetches all bookings, including related rentable car, car, and manufacturer details
  static async fetchAllBookings(page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;
      
      // Get total count first
      const totalCount = await BookingCar.count({
        include: [
          {
            model: Rentable,
            as: "rentable",
            include: [
              {
                model: Car,
                as: "car",
                include: [
                  {
                    model: Manufacturer,
                    as: "manufacturer",
                  },
                ],
              },
            ],
          },
        ],
      });

      // Get paginated results
      const bookings = await BookingCar.findAll({
        include: [
          {
            model: Rentable,
            as: "rentable",
            include: [
              {
                model: Car,
                as: "car",
                include: [
                  {
                    model: Manufacturer,
                    as: "manufacturer",
                  },
                ],
              },
            ],
          },
        ],
        limit: limit,
        offset: offset,
      });

      return {
        bookings,
        totalCount,
      };
    } catch (error) {
      console.error("Error in BookingAdminRepository.fetchAllBookings:", error);
      throw new Error(`Database query failed: ${error.message}`);
    }
  }

  // Finds a booking by its primary key (ID)
  static async findById(bookingId) {
    try {
      return await BookingCar.findByPk(bookingId); // Query for booking by ID
    } catch (error) {
      console.error("Error in BookingAdminRepository.findById:", error);
      // Throw an error if finding booking by ID fails
      throw new Error(`Error getting booking: ${error.message}`);
    }
  }

  // Updates a booking record in the database
  static async updateBooking(booking) {
    try {
      return await booking.save(); // Save the updated booking record
    } catch (error) {
      console.error("Error in BookingAdminRepository.updateBooking:", error);
      // Throw an error if updating the booking fails
      throw new Error(`Error updating booking: ${error.message}`);
    }
  }
}

export default BookingAdminRepository;
