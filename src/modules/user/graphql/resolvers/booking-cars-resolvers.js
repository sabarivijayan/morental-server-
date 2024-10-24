import { verifyToken } from "../../../../utils/jwt.js";
import BookingCarHelper from "../../helpers/booking-cars-helpers.js";
import User from "../../models/auth-model.js";

const BookingCarResolvers = {
  Query: {
    getAvailableCars: async (
      _,
      {
        pickupDate,
        dropoffDate,
        query,
        transmissionType,
        fuelType,
        numberOfSeats,
        priceSort,
      }
    ) => {
      // Ensure the arrays are not empty
      const transmissionArray =
        Array.isArray(transmissionType) && transmissionType.length > 0
          ? transmissionType
          : undefined;
      const fuelTypeArray =
        Array.isArray(fuelType) && fuelType.length > 0 ? fuelType : undefined;
      const seatsArray =
        Array.isArray(numberOfSeats) && numberOfSeats.length > 0 ? numberOfSeats : undefined;
  
      return await BookingCarHelper.getAvailableCars(
        pickupDate,
        dropoffDate,
        query,
        transmissionArray,
        fuelTypeArray,
        seatsArray,
        priceSort
      );
    },
    fetchBookings: async(_,__,{token})=>{
      
      try {
        if(!token){
          console.log("You are not authorized! Auth token is missing!!");
          return{
            status: false,
            message: "You are not authorized! Auth token is missing!!",
            data: [],
          }
        }
        const decodedToken = verifyToken(token.replace('Bearer ', ''));
        const userId = decodedToken.id;
        
        return await BookingCarHelper.fetchBookingsByUser(userId);
      } catch (error) {
        console.error("Error fetching bookings: ", error);
        return{
          status: false,
          message: "Error fetching bookings!!",
          data: [],
        };
      }
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
          message: "Failed to generate payment order",
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
        return bookingResponse;
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