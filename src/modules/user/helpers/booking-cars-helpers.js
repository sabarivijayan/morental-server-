import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
import BookingCarRepository from "../repositories/booking-cars-repositories.js";

dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

class BookingCarHelper {

  static async getAvailableCars(pickUpDate, dropOffDate) {
    try {
      const rentableCars = await BookingCarRepository.getRentableCars();
      const availableCars = [];

      for (const rentableCar of rentableCars) {
        const isAvailable = await BookingCarRepository.checkCarAvailability(
          rentableCar.carId,
          pickUpDate,
          dropOffDate
        );
        if (isAvailable) {
          availableCars.push(rentableCar);
        }
      }
      return availableCars;
    } catch (error) {
      console.error("Error fetching available cars:", error);
      throw new Error("Unable to fetch available cars");
    }
  }

  static async createPaymentOrder(totalPrice, userId, bookingInput) {
    try {
      // Step 1: Check vehicle availability
      const isAvailable = await BookingCarRepository.checkCarAvailability(
        bookingInput.rentableId,
        new Date(bookingInput.pickUpDate),
        new Date(bookingInput.dropOffDate)
      );

      if (!isAvailable) {
        return {
          status: "error",
          message: "The car is not available for the selected dates.",
        };
      }

      // Step 2: Create Razorpay order
      const options = {
        amount: totalPrice * 100, // Amount in paise (INR)
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
      };

      const razorpayOrder = await razorpay.orders.create(options);

      // Step 3: Add booking input to database with status "pending"
      const bookingData = {
        userId: userId,
        rentableId: bookingInput.rentableId,
        pickUpDate: new Date(bookingInput.pickUpDate),
        pickUpTime: bookingInput.pickUpTime,
        dropOffDate: new Date(bookingInput.dropOffDate),
        dropOffTime: bookingInput.dropOffTime,
        pickUpLocation: bookingInput.pickUpLocation,
        dropOffLocation: bookingInput.dropOffLocation,
        address: bookingInput.address,
        phoneNumber: bookingInput.phoneNumber,
        totalPrice: totalPrice,
        status: "pending",
        razorpayOrderId: razorpayOrder.id,
      };

      const newBooking = await BookingCarRepository.createBooking(bookingData);

      // Step 4: Return the Razorpay order and booking data
      return {
        status: "success",
        id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        bookingId: newBooking.id,
      };
    } catch (error) {
      console.error("Error in createPaymentOrder:", error);
      throw new Error("Failed to create payment order.");
    }
  }

  static async verifyPaymentAndCreateBooking(paymentDetails, bookingInput) {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } =
      paymentDetails;

      console.log("id",bookingInput)
    try {
      // Step 1: Generate signature for verification
      const generatedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest("hex");

      // Step 2: Verify the payment signature
      if (generatedSignature !== razorpaySignature) {
        return {
          status: "error",
          message: "Payment verification failed.",
        };
      }

      
      // Step 3: Check car availability again before finalizing the booking
      const isAvailable = await BookingCarRepository.checkCarAvailability(
        bookingInput.rentableId,
        new Date(bookingInput.pickUpDate),
        new Date(bookingInput.dropOffDate)
      );

      if (!isAvailable) {
        return {
          status: "error",
          message: "Car is no longer available for the selected dates.",
        };
      }

      // Step 4: Update the booking status to "booked"
      const updatedBooking = await BookingCarRepository.updateBookedStatus(
        razorpayOrderId,
        "booked"
      );


      // Step 5: Return a success message with booking details
      return {
        status: "success",
        message: "Payment verified and booking confirmed.",
        data: updatedBooking,
      };
    } catch (error) {
      console.error("Error in verifyPaymentAndCreateBooking:", error);
      throw new Error("Payment verification and booking creation failed.");
    }
  }

  static async fetchBookingsByUser(userId) {
    try {
      const bookings = await BookingCarRepository.fetchBookingsByUserId(userId);

      if (!bookings || bookings.legth === 0) {
        return {
          status: true,
          message: "No bookings found for the user.",
          data: [],
        };
      }

      console.log(bookings);
      return {
        status: true,
        message: "Bookings fetched successfully.",
        data: bookings,
      };
    } catch (error) {
      console.error("Error in Booking Helper: ", error);
      return {
        status: false,
        message: "Failed to fetch bookings.",
        data: [],
      };
    }
  }

}

export default BookingCarHelper;
