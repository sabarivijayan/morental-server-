//we have to first get all the rentable cars on the frontend to display them only after that can we book them 

import Rentable from "../../admin/models/rentable-cars-model.js";
import Car from "../../admin/models/car-model.js";
import Manufacturer from "../../admin/models/manufacturer-model.js";

class RentableCarsRepository{
    static async FindRentableCarById(id){
        try {
            const rentableCar = await Rentable.findOne({
                where: {id},
                include: [
                    {
                        model: Car,
                        as: 'car',
                        include: [
                            {
                                model: Manufacturer, 
                                as: 'manufacturer'
                            }
                        ]
                    },
                ],
            });
            if(!rentableCar){
                throw new Error('Rentable car not found');
            }
            return rentableCar;
        } catch (error) {
            throw new Error ('Error trying to fetch rentable cars: ' +error.message);
        }
    }
    static async FindAllRentablesByIds(ids) {
        try {
            const rentableCars = await Rentable.findAll({
                where: {
                    id: ids, // Fetch cars where the ID is in the provided array
                },
                include: [
                    {
                        model: Car,
                        as: 'car',
                        include: [
                            {
                                model: Manufacturer,
                                as: 'manufacturer',
                            },
                        ],
                    },
                ],
            });

            if (rentableCars.length === 0) {
                throw new Error('No rentable cars found for the provided IDs');
            }

            return rentableCars;
        } catch (error) {
            throw new Error('Error trying to fetch rentable cars: ' + error.message);
        }
    }
}

export default RentableCarsRepository;