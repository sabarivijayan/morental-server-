import axios from "axios"; // Import axios for making HTTP requests
import { Readable } from 'stream'; // Import Readable stream for creating readable streams

// Function to convert a URL to a file-like object
const urlToFileConverter = async (url) => {
    try {
        const validUrl = url.trim(); // Trim whitespace from the URL
        // Validate that the URL is non-empty and starts with 'http'
        if (!validUrl || !validUrl.startsWith('http')) {
            throw new Error(`Invalid URL: ${validUrl}`);
        }
        const response = await axios.get(validUrl, { responseType: 'arraybuffer' }); // Fetch the URL content as an array buffer

        // Check if the response status is not 200
        if (response.status !== 200) {
            throw new Error(`Failed to fetch image: ${response.statusText}`);
        }

        const contentType = response.headers['content-type']; // Get the content type from the response headers
        const buffer = Buffer.from(response.data); // Create a buffer from the response data

        const extension = contentType.split('/')[1]; // Extract file extension from content type
        const filename = `image-${Date.now()}.${extension}`; // Create a filename using the current timestamp

        return {
            filename,
            // Create a readable stream from the buffer
            createReadStream: () => {
                const readable = new Readable({
                    read() {
                        this.push(buffer); // Push the buffer to the stream
                        this.push(null); // Signal that the stream is finished
                    },
                });
                return readable; // Return the readable stream
            },
            mimetype: contentType, // Return the content type as mimetype
        };
    } catch (error) {
        console.error('Error trying to convert url to file: ', error.message); // Log any errors that occur
        throw error; // Rethrow the error for further handling
    }
};

export default urlToFileConverter; // Export the function for use in other modules
