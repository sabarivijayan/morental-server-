import Rentable from "../../admin/models/rentable-cars-model.js"; // Import Rentable model
import Car from "../../admin/models/car-model.js"; // Import Car model
import Manufacturer from "../../admin/models/manufacturer-model.js"; // Import Manufacturer model

class RentableCarsRepository {
    // Fetch a single rentable car by its ID
    static async FindRentableCarById(id) {
        try {
            // Query the Rentable model for a car with the specified ID, including related Car and Manufacturer data
            const rentableCar = await Rentable.findOne({
                where: { id }, // Condition to find the rentable car by ID
                include: [
                    {
                        model: Car,
                        as: 'car', // Alias for the Car model
                        include: [
                            {
                                model: Manufacturer,
                                as: 'manufacturer', // Alias for the Manufacturer model
                            }
                        ]
                    },
                ],
            });

            // Throw an error if no rentable car is found
            if (!rentableCar) {
                throw new Error('Rentable car not found');
            }
            return rentableCar; // Return the found rentable car
        } catch (error) {
            // Throw an error with a descriptive message if something goes wrong
            throw new Error('Error trying to fetch rentable cars: ' + error.message);
        }
    }

    // Fetch multiple rentable cars by their IDs
    static async FindAllRentablesByIds(ids) {
        try {
            // Query the Rentable model for cars with IDs in the provided array
            const rentableCars = await Rentable.findAll({
                where: {
                    id: ids, // Condition to find rentable cars where the ID is in the provided array
                },
                include: [
                    {
                        model: Car,
                        as: 'car', // Alias for the Car model
                        include: [
                            {
                                model: Manufacturer,
                                as: 'manufacturer', // Alias for the Manufacturer model
                            },
                        ],
                    },
                ],
            });

            // Throw an error if no rentable cars are found
            if (rentableCars.length === 0) {
                throw new Error('No rentable cars found for the provided IDs');
            }

            return rentableCars; // Return the found rentable cars
        } catch (error) {
            // Throw an error with a descriptive message if something goes wrong
            throw new Error('Error trying to fetch rentable cars: ' + error.message);
        }
    }
}

export default RentableCarsRepository; // Export the RentableCarsRepository class