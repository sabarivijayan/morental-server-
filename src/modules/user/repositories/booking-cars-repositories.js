import Rentable from "../../admin/models/rentable-cars-model.js";
import Car from "../../admin/models/car-model.js";
import Manufacturer from "../../admin/models/manufacturer-model.js";
import BookingCar from "../models/booking-cars-model.js";
import { Op } from "sequelize";

class BookingCarRepository {
  static async getRentableCars() {
    const response = await Rentable.findAll({
      where: {
        availableQuantity: {
          [Op.gt]: 0,
        },
      },
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
    });
    return response;
  }

  static async checkCarAvailability(id, pickUpDate, dropOffDate) {

    const rentableCar = await Rentable.findByPk(id);


    if (!(rentableCar)) {
      
      throw new Error("Car not found.");
    }

    const finalAvailableQuantity = rentableCar.availableQuantity;

    const emptyBookings = await BookingCar.findAll()

    if(emptyBookings.length === 0){
      return true;
    }


    const doubleBookings = await BookingCar.findAll({
      where: {
        carId:id,
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
            as: "rentable", // Make sure this matches the alias in the BookingCar model
            include: [
              {
                model: Car,
                as: "car", // Ensure this alias matches the Rentable-Car association
                include: [
                  {
                    model: Manufacturer,
                    as: "manufacturer", // Ensure this alias matches the Car-Manufacturer association
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
