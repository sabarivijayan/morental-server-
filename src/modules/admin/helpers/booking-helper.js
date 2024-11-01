import BookingAdminRepository from "../repositories/booking-repositories.js";

// BookingAdminHelper class provides helper methods for booking administration
class BookingAdminHelper {
    // Retrieves all bookings from the repository
    static async getAllBookings(page, limit) {
        try {
          const { bookings, totalCount } = await BookingAdminRepository.fetchAllBookings(page, limit);
          
          if (!bookings || bookings.length === 0) {
            return {
              status: true,
              message: "No bookings found",
              data: [],
              pagination: {
                total: 0,
                currentPage: page,
                totalPages: 0,
                hasNextPage: false,
                hasPreviousPage: false,
              }
            };
          }
    
          const totalPages = Math.ceil(totalCount / limit);
          
          return {
            status: true,
            message: "Bookings found",
            data: bookings,
            pagination: {
              total: totalCount,
              currentPage: page,
              totalPages: totalPages,
              hasNextPage: page < totalPages,
              hasPreviousPage: page > 1,
            }
          };
        } catch (error) {
          console.error("Error in BookingAdminHelper.getAllBookings:", error);
          throw new Error(`Error fetching bookings: ${error.message}`);
        }
      }

    // Updates a booking's status to 'delivered' and sets the delivery date
    static async bookingDelivery(bookingId) {
        try {
            // Find the booking by ID
            const booking = await BookingAdminRepository.findById(bookingId);
            
            // Check if the booking exists
            if (!booking) {
                // Return a response indicating the booking was not found
                return {
                    status: false,
                    message: "Booking not found",
                }
            }
            // Update the booking's status and delivery date
            booking.deliveryDate = new Date();
            booking.status = "delivered"

            // Update the booking in the repository
            const updatedBooking = await BookingAdminRepository.updateBooking(booking);
            
            // Return a response with the updated booking
            return {
                status: true,
                message: "Booking updated successfully",
                data: updatedBooking,
            }
        } catch (error) {
            // Log the error and throw a new error with a user-friendly message
            console.error("Error in BookingAdminHelper.bookingDelivery:", error);
            throw new Error(`Error updating booking: ${error.message}`);
        }
    }
}

// Export the BookingAdminHelper class as the default export
export default BookingAdminHelper;