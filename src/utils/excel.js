import * as XLSX from 'xlsx'; // Import the XLSX library for reading and parsing Excel files

// Function to get an Excel buffer from a readable stream
async function getExcelBuffer(createReadStream) {
    const stream = createReadStream(); // Create a readable stream from the provided function

    // Create a buffer by collecting data chunks from the stream
    const buffer = await new Promise((resolve, reject) => {
        const data = []; // Array to hold data chunks
        stream.on('data', (chunk) => data.push(chunk)); // Push each chunk into the data array
        stream.on('end', () => resolve(Buffer.concat(data))); // Resolve the promise with the concatenated buffer when the stream ends
        stream.on('error', reject); // Reject the promise on stream error
    });
    return buffer; // Return the complete buffer
}

// Function to parse an Excel buffer and convert it to JSON format
async function parseExcel(buffer) {
    const workbook = XLSX.read(buffer, { type: 'buffer' }); // Read the workbook from the buffer
    const sheetName = workbook.SheetNames[0]; // Get the first sheet name
    const sheet = workbook.Sheets[sheetName]; // Access the first sheet
    const data = XLSX.utils.sheet_to_json(sheet); // Convert the sheet to JSON format
    return data; // Return the parsed data
}

export default { getExcelBuffer, parseExcel }; // Export the functions for use in other modules
