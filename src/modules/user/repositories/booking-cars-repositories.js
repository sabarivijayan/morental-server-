import Rentable from "../../admin/models/rentable-cars-model.js";
import Car from "../../admin/models/car-model.js";
import Manufacturer from "../../admin/models/manufacturer-model.js";
import BookingCar from "../models/booking-cars-model.js";
import { Op } from "sequelize";

class BookingCarRepository {
  static async getRentableCars(filters = {}) {
    const whereClause = {
      availableQuantity: {
        [Op.gt]: 0,
      }
    };

    const carWhereClause = {};
    
    // Filter by number of seats
    if (filters.numberOfSeats && filters.numberOfSeats.length > 0) {
      carWhereClause.numberOfSeats = {
        [Op.in]: filters.numberOfSeats
      };
    }

    // Filter by transmission type
    if (filters.transmissionTypes && filters.transmissionTypes.length > 0) {
      carWhereClause.transmissionType = {
        [Op.in]: filters.transmissionTypes
      };
    }

    // Filter by fuel type
    if (filters.fuelTypes && filters.fuelTypes.length > 0) {
      carWhereClause.fuelType = {
        [Op.in]: filters.fuelTypes
      };
    }

    // Filter by price - Updated to handle maxPrice consistently
    if (filters.maxPrice && !isNaN(filters.maxPrice)) {
      whereClause.pricePerDay = {
        [Op.lte]: parseFloat(filters.maxPrice)
      };
    }

    // Sorting
    let order = [];
    if (filters.sortBy) {
      const sortOrder = filters.sortOrder === 'DESC' ? 'DESC' : 'ASC';
      if (filters.sortBy === 'price') {
        order.push(['pricePerDay', sortOrder]);
      }
    }

    const response = await Rentable.findAll({
      where: whereClause,
      include: [
        {
          model: Car,
          as: "car",
          where: carWhereClause,
          include: [
            {
              model: Manufacturer,
              as: "manufacturer",
            },
          ],
        },
      ],
      order
    });
    return response;
  }

  static async checkCarAvailability(id, pickUpDate, dropOffDate) {
    const rentableCar = await Rentable.findByPk(id);
    
    if (!rentableCar) {
      throw new Error("Car not found.");
    }

    const finalAvailableQuantity = rentableCar.availableQuantity;
    const emptyBookings = await BookingCar.findAll();

    if (emptyBookings.length === 0) {
      return true;
    }

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
    });

    const bookedCount = doubleBookings.length;
    const availableQuantity = finalAvailableQuantity - bookedCount;
    return availableQuantity > 0;
  }

  static async getExistingBooking(userId, carId, pickUpDate, dropOffDate) {
    const existingBooking = await BookingCar.findOne({
      where: {
        userId,
        carId,
        pickUpDate: new Date(pickUpDate),
        dropOffDate: new Date(dropOffDate),
      },
    });
    return existingBooking;
  }

  static async createBooking(bookingData) {
    return await BookingCar.create(bookingData);
  }

  static async updateBookedStatus(razorpayOrderId, status) {
    const booking = await BookingCar.findOne({
      where: { razorpayOrderId },
    });

    if (!booking) {
      throw new Error("Booking not found");
    }

    booking.status = status;
    await booking.save();

    return booking;
  }

  static async fetchBookingsByUserId(userId) {
    try {
      return BookingCar.findAll({
        where: { userId },
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
    } catch (error) {
      console.error("Error in Booking Repository: ", error);
      throw new Error("Query failed");
    }
  }

}

export default BookingCarRepository;