import { verifyToken } from "../../../../utils/jwt.js";
import BookingAdminHelper from "../../helpers/booking-helper.js";

const BookingAdminResolver = {
  Query: {
    fetchAllBookings: async (_, __, { token }) => {
      try {
        return await BookingAdminHelper.getAllBookings();
      } catch (error) {
        console.error("Error in fetchAllBookings resolver:", error);
        return {
          status: false,
          message: `An error occurred while fetching bookings: ${error.message}`,
          data: [],
        };
      }
    },
  },

  Mutation: {
    bookingDelivery: async (_, { id }) => {
      try {
        const result = await BookingAdminHelper.bookingDelivery(id);
        return result;
      } catch (error) {
        console.error("Error in bookingDelivery resolver:", error);
        return {
          status: false,
          message: `An error occurred while booking delivery: ${error.message}`,
        };
      }
    },
  },
};

export default BookingAdminResolver;
