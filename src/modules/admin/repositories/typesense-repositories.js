import { client } from "../../../config/typesense.js";

const addcarToTypesense = async (car) => {

    const document = {
        id: car.id,
        pricePerDay: car.pricePerDay,
        availableQuantity:car.availableQuantity,
        car:{
            name: car.name,
            year:car.year,
            type: car.type,
            description:car.description,
            numberOfSeats:car.numberOfSeats,
            transmissionType: car.transmissionType,
            fuelType: car.fuelType,
            primaryImageUrl: car.primaryImageUrl,
            manufacturer:{
                name: car.manufacturer,
            }  
        }  
       
    };

    try {
        await client.collections('cars').documents().upsert(document); // Upsert to handle adding or updating
        console.log('car added to Typesense successfully!');
    } catch (error) {
        console.error('Error adding car to Typesense:', error);
    }
};


// Function to delete a car from Typesense
const deletecarFromTypesense = async (id) => {
    try {
        await client.collections('cars').documents(id).delete(); // Delete document from Typesense using the car ID
        console.log(`car with ID ${id} deleted from Typesense successfully.`);
    } catch (error) {
        console.error(`Error deleting car from Typesense: ${error.message}`);
    }
};


export { addcarToTypesense , deletecarFromTypesense  };