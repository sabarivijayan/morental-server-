import { verifyToken } from "../../../../utils/jwt.js";
import BookingCarHelper from "../../helpers/booking-cars-helpers.js";
import User from "../../models/auth-model.js";

const BookingCarResolvers = {
  Query: {
    getAvailableCars: async (_, { pickUpDate, dropOffDate }) => {
      return await BookingCarHelper.getAvailableCars(pickUpDate, dropOffDate);
    },
  },
  Mutation: {
    generatePaymentOrder: async (_, { totalPrice, bookingInput }, { token }) => {
      try {
        if (!token) {
          console.log("Unauthorized");
          return {
            status: "error",
            message: "Auth token is missing",
          };
        }

        const decodedToken = verifyToken(token.replace("Bearer ", ""));
        const user = await User.findByPk(decodedToken.id);

        if (!user) {
          return {
            status: "error",
            message: "User cannot be found. Try and login first",
          };
        }

        const razorpayOrder = await BookingCarHelper.createPaymentOrder(
          totalPrice,
          user.id,
          bookingInput
        );
        return {
          status: "success",
          message: "Payment order created successfully",
          userName: user.name,
          userEmail: user.email,
          razorpayOrderId: razorpayOrder.id,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
        };
      } catch (error) {
        console.error("Error generating payment order: ", error);
        return {
          status: "error",
          message: "Auth token is missing",
        };
      }
    },

    verifyPaymentAndCreateBooking: async (
      _,
      { paymentDetails, bookingInput },
      { token }
    ) => {
      try {
        if (!token) {
          return {
            status: "error",
            message: "Auth token is missing",
          };
        }

        const decodedToken = verifyToken(token.replace('Bearer ', ''));
        const userId = decodedToken.id;

        bookingInput.userId = userId;

        const bookingResponse = await BookingCarHelper.verifyPaymentAndCreateBooking(paymentDetails, bookingInput);
        return {
            status: bookingResponse.status,
            message: bookingResponse.message,
            data: bookingResponse.data,
        };
      } catch (error) {
        console.error("Error verifying payment and creating booking: ", error);
        return {
            status: "error",
            message: 'Payment could not be verified and booking creation failed.',
        }
      }
    },
  },
};

export default BookingCarResolvers;