import RentableCarHelper from "../../helpers/rentable-cars-helpers.js";
import { addcarToTypesense } from "../../../../config/typesense.js";


const RentableCarResolver = {
    Query: {
        getRentableCarsWithId: async(_, {id})=>{
            return await RentableCarHelper.getRentableCarById(id);
        }
    },


    Mutation: {
        addcarToTypesense: async (_, { car }) => {
          console.log(car);
          try {


            console.log(car)
            const typesenseCar = {
              id: car.id,
              name: car.name,
              type: car.type,
              pricePerDay: car.pricePerDay,
              transmissionType: car.transmissionType,
              fuelType: car.fuelType,
              year: car.year,
              availableQuantity: car.availableQuantity,
              manufacturer: car.manufacturer,
              numberOfSeats: car.numberOfSeats,
              primaryImageUrl: car.primaryImageUrl,
              description: car.description
            };
   
            await addcarToTypesense(typesenseCar);
            return 'Car added to Typesense successfully';
          } catch (error) {
            console.error('Error adding car to Typesense:', error);
            throw new Error('Failed to add car');
          }
        },
      },
}


export default RentableCarResolver;
