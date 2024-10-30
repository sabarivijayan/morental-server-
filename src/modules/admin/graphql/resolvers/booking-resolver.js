import BookingAdminHelper from "../../helpers/booking-helper.js";
import {generateBookingsExcel, generateFilename} from "../../../../utils/excel-export.js"
import { generateBookingsPDF, generatePDFFilename } from "../../../../utils/pdf-export.js";
/**
 * BookingAdminResolver is a GraphQL resolver that handles queries and mutations related to booking administration.
 */
const BookingAdminResolver = {
  /**
   * Query resolvers for booking administration.
   */
  Query: {
    /**
     * fetchAllBookings is a query resolver that retrieves all bookings.
     * 
     * @param {object} _ - The GraphQL context object.
     * @param {object} __ - The GraphQL info object.
     * @param {object} { token } - The GraphQL context object containing the token.
     * 
     * @returns {Promise<object>} A promise that resolves to an object containing the booking data.
     */
    fetchAllBookings: async (_, __, { token }) => {
      try {
        // Call the BookingAdminHelper to retrieve all bookings.
        return await BookingAdminHelper.getAllBookings();
      } catch (error) {
        // Log any errors that occur during the execution of the resolver.
        console.error("Error in fetchAllBookings resolver:", error);
        // Return an error response with a status of false and a message.
        return {
          status: false,
          message: `An error occurred while fetching bookings: ${error.message}`,
          data: [],
        };
      }
    },
  },

  /**
   * Mutation resolvers for booking administration.
   */
  Mutation: {
    /**
     * bookingDelivery is a mutation resolver that marks a booking as delivered.
     * 
     * @param {object} _ - The GraphQL context object.
     * @param {object} { id } - The GraphQL input object containing the booking ID.
     * 
     * @returns {Promise<object>} A promise that resolves to an object containing the result of the mutation.
     */
    bookingDelivery: async (_, { id }) => {
      try {
        // Call the BookingAdminHelper to mark the booking as delivered.
        const result = await BookingAdminHelper.bookingDelivery(id);
        // Return the result of the mutation.
        return result;
      } catch (error) {
        // Log any errors that occur during the execution of the resolver.
        console.error("Error in bookingDelivery resolver:", error);
        // Return an error response with a status of false and a message.
        return {
          status: false,
          message: `An error occurred while booking delivery: ${error.message}`,
        };
      }
    },
    exportBookingsExcel: async (_, __, { req }) => {
      try {
        // Get all bookings
        const bookingsResponse = await BookingAdminHelper.getAllBookings();
        
        // Check if we have valid booking data
        if (!bookingsResponse.status || !bookingsResponse.data) {
          throw new Error('Failed to fetch booking data');
        }

        // Generate Excel file
        const buffer = generateBookingsExcel(bookingsResponse);
        
        if (!buffer) {
          throw new Error('Failed to generate Excel file');
        }

        return {
          status: true,
          message: 'Excel file generated successfully',
          data: {
            buffer: buffer.toString('base64'),
            filename: generateFilename()
          }
        };
      } catch (error) {
        console.error('Error generating Excel file:', error);
        return {
          status: false,
          message: `Failed to generate Excel file: ${error.message}`,
          data: null
        };
      }
    },

    exportBookingsPDF: async (_, __, { req }) => {
      try {
        // Fetch bookings data
        const bookingsResponse = await BookingAdminHelper.getAllBookings();

        if (!bookingsResponse.status || !bookingsResponse.data) {
          throw new Error('Failed to fetch booking data');
        }

        // Generate PDF
        const doc = generateBookingsPDF(bookingsResponse);
        
        if (!doc) {
          throw new Error('Failed to generate PDF document');
        }

        // Convert PDF to buffer using the correct method
        const pdfBuffer = Buffer.from(doc.output('arraybuffer'));

        return {
          status: true,
          message: 'PDF file generated successfully',
          data: {
            buffer: pdfBuffer.toString('base64'),
            filename: generatePDFFilename()
          }
        };
      } catch (error) {
        console.error('Error generating PDF file:', error);
        return {
          status: false,
          message: `Failed to generate PDF file: ${error.message}`,
          data: null
        };
      }
    }
  },
};

export default BookingAdminResolver;