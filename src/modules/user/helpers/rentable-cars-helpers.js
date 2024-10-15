import RentableCarsRepository from "../repositories/rentable-cars-repositories.js";

class RentableCarHelper{
    static async getRentableCarById(id){
        const rentableCar = await RentableCarsRepository.FindRentableCarById(id);
        return rentableCar;
    }
}

export default RentableCarHelper;