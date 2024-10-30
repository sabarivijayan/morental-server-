import { jsPDF } from 'jspdf';
// Fix: Import jspdf-autotable correctly
import 'jspdf-autotable';

function generateBookingsPDF(bookingsResponse) {
  // Ensure we're accessing the data correctly from the response
  const bookings = bookingsResponse?.data || [];
  
  // Create new PDF document with proper constructor
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });
  
  // Add title
  doc.setFontSize(16);
  doc.text('Bookings Report', 14, 15);
  
  // Add timestamp
  doc.setFontSize(10);
  doc.setTextColor(100);
  const timestamp = new Date().toLocaleString();
  doc.text(`Generated on: ${timestamp}`, 14, 25);
  
  // Reset text color
  doc.setTextColor(0);
  
  // Prepare the data for the table
  const tableBody = bookings.map(booking => ([
    booking.id,
    booking.rentable?.car?.name || 'N/A',
    new Date(booking.pickUpDate).toLocaleDateString(),
    booking.pickUpTime || 'N/A',
    new Date(booking.dropOffDate).toLocaleDateString(),
    booking.dropOffTime || 'N/A',
    `₹${booking.totalPrice.toLocaleString()}`,
    booking.status === 'delivered' ? 'Delivered' : 'Pending',
    booking.pickUpLocation || 'N/A',
    booking.dropOffLocation || 'N/A'
  ]));

  // Define the table header
  const tableHeader = [
    'Booking ID',
    'Car Name',
    'Pickup Date',
    'Pickup Time',
    'Dropoff Date',
    'Dropoff Time',
    'Total Price',
    'Status',
    'Pickup Location',
    'Dropoff Location'
  ];

  // Calculate summary data
  const totalBookings = bookings.length;
  const deliveredBookings = bookings.filter(b => b.status === 'delivered').length;
  const pendingBookings = totalBookings - deliveredBookings;
  const totalRevenue = bookings.reduce((sum, booking) => sum + (Number(booking.totalPrice) || 0), 0);

  // Fix: Use doc.autoTable instead of autoTable directly
  doc.autoTable({
    head: [tableHeader],
    body: tableBody,
    startY: 35,
    styles: {
      fontSize: 8,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [66, 66, 66],
      textColor: 255,
      fontSize: 8,
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    margin: { left: 10, right: 10 },
    columnStyles: {
      0: { cellWidth: 25 }, // Booking ID
      1: { cellWidth: 30 }, // Car Name
      2: { cellWidth: 20 }, // Pickup Date
      3: { cellWidth: 20 }, // Pickup Time
      4: { cellWidth: 20 }, // Dropoff Date
      5: { cellWidth: 20 }, // Dropoff Time
      6: { cellWidth: 20 }, // Total Price
      7: { cellWidth: 20 }, // Status
      8: { cellWidth: 25 }, // Pickup Location
      9: { cellWidth: 25 }, // Dropoff Location
    },
  });

  // Get the final Y position after the table
  const finalY = doc.previousAutoTable.finalY || 150;

  // Add summary section
  doc.setFontSize(12);
  doc.text('Summary', 14, finalY + 20);

  // Add summary details in a table format
  const summaryData = [
    ['Total Bookings:', totalBookings.toString()],
    ['Delivered Bookings:', deliveredBookings.toString()],
    ['Pending Bookings:', pendingBookings.toString()],
    ['Total Revenue:', `₹${totalRevenue.toLocaleString()}`],
  ];

  doc.autoTable({
    body: summaryData,
    startY: finalY + 25,
    theme: 'plain',
    styles: {
      fontSize: 10,
      cellPadding: 2,
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 50 },
      1: { cellWidth: 50 },
    },
  });

  // Add footer with page numbers
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128);
    doc.text(
      `Page ${i} of ${pageCount}`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    );
  }

  return doc;
}

// Helper function to generate filename with current date
function generatePDFFilename() {
  const date = new Date();
  return `bookings_report_${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}.pdf`;
}

export { generateBookingsPDF, generatePDFFilename };