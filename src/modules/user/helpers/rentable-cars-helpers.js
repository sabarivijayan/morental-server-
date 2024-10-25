import RentableCarsRepository from "../repositories/rentable-cars-repositories.js";
import { client } from "../../../config/typesense.js";
class RentableCarHelper{
    static async getRentableCarById(id){
        const rentableCar = await RentableCarsRepository.FindRentableCarById(id);
        return rentableCar;
    }

    static async searchRentableCars({
        query,
        transmissionType,
        fuelType,
        numberOfSeats,
        priceSort,
      }) {
        try {
          const searchParams = {
            q: query || "*", 
            query_by: "car.name,car.manufacturer.name",
            filter_by: [],
            sort_by: priceSort === "asc" ? "pricePerDay:asc" : "pricePerDay:desc", 
          };
    
          if (
            transmissionType &&
            Array.isArray(transmissionType) &&
            transmissionType.length > 0
          ) {
            searchParams.filter_by.push(
              `car.transmissionType:=[${transmissionType.join(",")}]`
            );
          }
          if (fuelType && Array.isArray(fuelType) && fuelType.length > 0) {
            searchParams.filter_by.push(
              `car.fuelType:=[${fuelType.join(",")}]`
            );
          }
          if (numberOfSeats && Array.isArray(numberOfSeats) && numberOfSeats.length > 0) {
            searchParams.filter_by.push(
              `car.numberOfSeats:>=${Math.min(...numberOfSeats)}`
            ); 
          }
    
          if (searchParams.filter_by.length > 0) {
            searchParams.filter_by = searchParams.filter_by.join(" && ");
          } else {
            delete searchParams.filter_by; 
          }
    
          // Perform the search in Typesense with the constructed searchParams
          const typesenseResponse = await client
            .collections("cars")
            .documents()
            .search(searchParams);
    
          // If no hits are found, return an empty array
          if (!typesenseResponse.hits.length) {
            return [];
          }
    
          const carIds = typesenseResponse.hits.map((hit) => hit.document.id);
    
          const cars = await RentableCarsRepository.FindAllRentablesByIds(carIds);
    
          return cars;
        } catch (error) {
          console.error("Error in searching rentable cars - ", error);
          throw new Error("Failed to search rentable vehicles");
        }
      }
}

export default RentableCarHelper;