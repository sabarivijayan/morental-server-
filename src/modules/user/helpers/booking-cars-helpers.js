import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
import BookingCarRepository from "../repositories/booking-cars-repositories.js";

dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


class BookingCarHelper{
    static async getAvailableCars (pickUpDate, dropOffDate){
        try {
            const rentableCars = await BookingCarRepository.getRentableCars();
            const availableCars = [];

            for(const rentableCar of rentableCars){
                const isAvailable = await BookingCarRepository.checkCarAvailability(
                    rentableCar.carId, 
                    pickUpDate, 
                    dropOffDate
                );
                if(isAvailable){
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
            bookingInput.carId,
            new Date(bookingInput.pickUpDate),
            new Date(bookingInput.dropOffDate)
          );
      
          if (!isAvailable) {
            return {
              status: 'error',
              message: 'The car is not available for the selected dates.',
            };
          }
      
          // Step 2: Create Razorpay order
          const options = {
            amount: totalPrice * 100, // Amount in paise (INR)
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
          };
      
          const razorpayOrder = await razorpay.orders.create(options);
          console.log('Razorpay Order Created:', razorpayOrder);
      
          // Step 3: Add booking input to database with status "pending"
          const bookingData = {
            userId: userId,
            carId: bookingInput.carId,
            pickUpDate: new Date(bookingInput.pickUpDate),
            dropOffDate: new Date(bookingInput.dropOffDate),
            totalPrice: totalPrice,
            status: 'pending', // Initially set status to 'pending'
            razorpayOrderId: razorpayOrder.id, // Store Razorpay order ID
          };
      
          const newBooking = await BookingCarRepository.createBooking(bookingData);
      
          // Step 4: Return the Razorpay order and booking data
          return {
            status: 'success',
            id: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            bookingId: newBooking.id, // Add booking ID to the response
          };
        } catch (error) {
          console.error('Error in createPaymentOrder:', error);
          throw new Error('Failed to create payment order.');
        }
      }
      
      static async verifyPaymentAndCreateBooking(paymentDetails, bookingInput) {
        const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = paymentDetails;
    
        try {
          // Step 1: Generate signature for verification
          const generatedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpayOrderId}|${razorpayPaymentId}`)
            .digest('hex');
    
          // Step 2: Verify the payment signature
          if (generatedSignature !== razorpaySignature) {
            return {
              status: 'error',
              message: 'Payment verification failed.',
            };
          }
    
          // Step 3: Check car availability again before finalizing the booking
          const isAvailable = await BookingCarRepository.checkCarAvailability(
            bookingInput.carId,
            new Date(bookingInput.pickUpDate),
            new Date(bookingInput.dropOffDate)
          );
    
          if (!isAvailable) {
            return {
              status: 'error',
              message: 'Car is no longer available for the selected dates.',
            };
          }
    
          // Step 4: Update the booking status to "booked"
          await BookingCarRepository.updateBookedStatus(razorpayOrderId, 'booked');
    
          // Step 5: Return a success message with booking details
          return {
            status: 'success',
            message: 'Payment verified and booking confirmed.',
            booking: {
              carId: bookingInput.carId,
              pickUpDate: bookingInput.pickUpDate,
              dropOffDate: bookingInput.dropOffDate,
              totalPrice: bookingInput.totalPrice,
            },
          };
        } catch (error) {
          console.error('Error in verifyPaymentAndCreateBooking:', error);
          throw new Error('Payment verification and booking creation failed.');
        }
      }
}
export default BookingCarHelper