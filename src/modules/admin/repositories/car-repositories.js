import Car from "../models/car-model.js";
import { deletecarFromTypesense } from "./typesense-repositories.js";
class CarRepository{

    static async createCar(carData) {
        try{
            const car = await Car.create(carData);
            return{
                id: car.id,
                name: car.name,
                description: car.description,
                type: car.type,
                quantity: car.quantity,
                manufacturerId: car.manufacturerId,
                numberOfSeats: car.numberOfSeats,
                fuelType: car.fuelType,
                transmissionType: car.transmissionType,
                primaryImageUrl: car.primaryImageUrl,
                secondaryImagesUrls: car.secondaryImagesUrls,
                year: car.year,
            };
        }catch(error){
            console.log('Error creating car: ', error);
            throw new Error('Failed to create car');
        }
    }

    static async findCarByNameAndManufacturer(name, manufacturerId){
        try {
            if(!manufacturerId){
                const car = await Car.findOne({
                    where: {
                        name,
                    },
                });
                return car;
            }
            const car = await Car.findOne({
                where: {
                    name,
                    manufacturerId,
                },
            });
            if(car){
                return{
                    status:true
                }
            }
        } catch (error) {
            console.error('Error finding car: ', error);
            throw new Error('Failed to find car');
        }
    }

    static async getAllCars(){
        try {
            const cars = await Car.findAll();
            return cars;
        } catch (error) {
            console.error('Error fetching cars: ', error);
            throw new Error('Failed to fetch cars');
        }
    }

    static async deleteCarById(id){
        try {
            const deletedCar = await Car.destroy({
                where: { id },
            });

            if(deletedCar === 0){
                return null;
            }
            await deletecarFromTypesense(id);
            return{ id };
        } catch (error) {
            console.error('Error deleting car from database: ', error);
            throw new Error('Failed to delete car');
        }
    }

    static async updateCarById(id, carData){
        try{
            const car = await Car.findByPk(id);
            if(!car){
                throw new Error('Car not found');
            }

            await car.update(carData);
            return car;
        }catch(error){
            throw new Error('Failed to update car');
        }
    }

    static async getCarById(id){
        try {
            const  car = await Car.findByPk(id);
            return car;
        } catch (error) {
            throw new Error('Failed to fetch car');
        }
    }
}

export default CarRepository;