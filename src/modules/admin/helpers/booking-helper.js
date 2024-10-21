import BookingAdminRepository from "../repositories/booking-repositories.js";

class BookingAdminHelper {
    static async getAllBookings() {
        try {
            const bookings = await BookingAdminRepository.fetchAllBookings();
            if (!bookings || bookings.length === 0) {
                return {
                    status: true,
                    message: "No bookings found",
                    data: [],
                }
            }
            return {
                status: true,
                message: "Bookings found",
                data: bookings,
            };
        } catch (error) {
            console.error("Error in BookingAdminHelper.getAllBookings:", error);
            throw new Error(`Error fetching bookings: ${error.message}`);
        }
    }

    static async bookingDelivery(bookingId) {
        try {
            const booking = await BookingAdminRepository.findById(bookingId);
            if (!booking) {
                return {
                    status: false,
                    message: "Booking not found",
                }
            }
            booking.deliveryDate = new Date();
            booking.status = "delivered"

            const updatedBooking = await BookingAdminRepository.updateBooking(booking);
            return {
                status: true,
                message: "Booking updated successfully",
                data: updatedBooking,
            }
        } catch (error) {
            console.error("Error in BookingAdminHelper.bookingDelivery:", error);
            throw new Error(`Error updating booking: ${error.message}`);
        }
    }
}

export default BookingAdminHelper;