import BookingCar from "../../user/models/booking-cars-model.js"
import Manufacturer from "../models/manufacturer-model.js"
import Rentable from "../models/rentable-cars-model.js"
import Car from "../models/car-model.js"

class BookingAdminRepository {
    static async fetchAllBookings() {
        try {
            return await BookingCar.findAll({
                include: [{
                    model: Rentable,
                    as: 'rentable',
                    include: [{
                        model: Car,
                        as: 'car',
                        include: [{
                            model: Manufacturer,
                            as: 'manufacturer'
                        }]
                    }]
                }]
            })
        } catch (error) {
            console.error("Error in BookingAdminRepository.fetchAllBookings:", error);
            throw new Error(`Database query failed: ${error.message}`);
        }
    }

    static async findById(bookingId) {
        try {
            return await BookingCar.findByPk(bookingId);
        } catch (error) {
            console.error("Error in BookingAdminRepository.findById:", error);
            throw new Error(`Error getting booking: ${error.message}`);
        }
    }

    static async updateBooking(booking) {
        try {
            return await booking.save();
        } catch (error) {
            console.error("Error in BookingAdminRepository.updateBooking:", error);
            throw new Error(`Error updating booking: ${error.message}`);
        }
    }
}

export default BookingAdminRepository;