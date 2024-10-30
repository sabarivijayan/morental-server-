import xlsx from 'xlsx';

function generateBookingsExcel(bookingsResponse) {
  // Ensure we're accessing the data correctly from the response
  const bookings = bookingsResponse?.data || [];

  // Prepare worksheet data
  const worksheetData = [
    ['Booking ID', 'Car Name', 'Pickup Date', 'Dropoff Date', 'Total Price (₹)', 'Status', 'Pickup Location', 'Drop-off Location']
  ];

  // Add booking data to the worksheet
  bookings.forEach(booking => {
    worksheetData.push([
      booking.id,
      booking.rentable?.car?.name || 'N/A',
      new Date(booking.pickUpDate).toLocaleDateString(),
      new Date(booking.dropOffDate).toLocaleDateString(),
      booking.totalPrice.toString(),
      booking.status === 'delivered' ? 'Delivered' : 'Pending',
      booking.pickUpLocation || 'N/A',
      booking.dropOffLocation || 'N/A'
    ]);
  });

  // Create a new workbook and worksheet
  const workbook = xlsx.utils.book_new();
  
  // Set column widths
  const wsColWidth = [
    {wch: 15}, // Booking ID
    {wch: 20}, // Car Name
    {wch: 15}, // Pickup Date
    {wch: 15}, // Dropoff Date
    {wch: 15}, // Total Price
    {wch: 12}, // Status
    {wch: 20}, // Pickup Location
    {wch: 20}, // Drop-off Location
  ];

  // Create worksheet with the data
  const worksheet = xlsx.utils.aoa_to_sheet(worksheetData);
  
  // Apply column widths
  worksheet['!cols'] = wsColWidth;

  // Add the worksheet to the workbook
  xlsx.utils.book_append_sheet(workbook, worksheet, 'Bookings Report');

  // Generate buffer
  const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  return buffer;
}

// Helper function to generate filename with current date
function generateFilename() {
  const date = new Date();
  return `bookings_report_${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}.xlsx`;
}

export { generateBookingsExcel, generateFilename };