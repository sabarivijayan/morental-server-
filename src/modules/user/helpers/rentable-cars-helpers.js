import RentableCarsRepository from "../repositories/rentable-cars-repositories.js";
import { client } from "../../../config/typesense.js";

class RentableCarHelper {
    // Fetch a rentable car by its ID
    static async getRentableCarById(id) {
        const rentableCar = await RentableCarsRepository.FindRentableCarById(id);
        return rentableCar; // Return the found rentable car
    }

    // Search for rentable cars based on various filters
    static async searchRentableCars({
        query,
        transmissionType,
        fuelType,
        numberOfSeats,
        priceSort,
        maxPrice, // Add maxPrice parameter to set upper limit for car price
    }) {
        try {
            // Prepare search parameters for Typesense
            const searchParams = {
                q: query || "*", // If no query is provided, use "*" to match all
                query_by: "car.name,car.manufacturer.name", // Fields to search in
                filter_by: [], // Initialize filter array
                sort_by: priceSort === "asc" ? "pricePerDay:asc" : "pricePerDay:desc", // Sort by price
            };

            // Add price filter if maxPrice is provided
            if (maxPrice && !isNaN(maxPrice)) {
                searchParams.filter_by.push(`pricePerDay:< ${maxPrice}`); // Filter cars cheaper than maxPrice
            }

            // Add transmission type filter if provided
            if (
                transmissionType &&
                Array.isArray(transmissionType) &&
                transmissionType.length > 0
            ) {
                searchParams.filter_by.push(
                    `car.transmissionType:=[${transmissionType.join(",")}]` // Filter by specified transmission types
                );
            }

            // Add fuel type filter if provided
            if (fuelType && Array.isArray(fuelType) && fuelType.length > 0) {
                searchParams.filter_by.push(
                    `car.fuelType:=[${fuelType.join(",")}]` // Filter by specified fuel types
                );
            }

            // Add number of seats filter if provided
            if (numberOfSeats && Array.isArray(numberOfSeats) && numberOfSeats.length > 0) {
                searchParams.filter_by.push(
                    `car.numberOfSeats:>=${Math.min(...numberOfSeats)}` // Filter by minimum number of seats
                );
            }

            // Join filters into a single string if any filters are present
            if (searchParams.filter_by.length > 0) {
                searchParams.filter_by = searchParams.filter_by.join(" && "); // Combine multiple filters with "AND"
            } else {
                delete searchParams.filter_by; // Remove filter if no filters are set
            }

            // Execute search in Typesense
            const typesenseResponse = await client
                .collections("cars")
                .documents()
                .search(searchParams);

            // If no cars are found, return an empty array
            if (!typesenseResponse.hits.length) {
                return [];
            }

            // Extract car IDs from the search results
            const carIds = typesenseResponse.hits.map((hit) => hit.document.id);
            // Fetch detailed car information using the found IDs
            const cars = await RentableCarsRepository.FindAllRentablesByIds(carIds);

            return cars; // Return the list of rentable cars
        } catch (error) {
            // Log and throw an error if the search fails
            console.error("Error in searching rentable cars - ", error);
            throw new Error("Failed to search rentable vehicles");
        }
    }
}

export default RentableCarHelper;
