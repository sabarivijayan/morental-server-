// typesenseClient.ts
import Typesense from "typesense";

// Create a client instance for Typesense
const client = new Typesense.Client({
  nodes: [
    {
      host: "43gi25mdsbj89cqrp-1.a1.typesense.net", // Typesense server host
      port: 443, // Typesense server port
      protocol: "https", // Use http or https based on your setup
    },
  ],
  apiKey: "hgnXF3dYPa3Pumq8G06vRA0lWND1YNbY", // Your API key (same as used in the server)
  connectionTimeoutSeconds: 2, // Connection timeout in seconds
});

const createSchema = async () => {
  const schema = {
    name: "cars",
    enable_nested_fields: true,
    fields: [
      { name: "id", type: "string", facet: false },
      { name: "pricePerDay", type: "int32", facet: false },
      { name: "availableQuantity", type: "int32", facet: false },

      {
        name: "car",
        type: "object",
        facet: false,
        fields: [
          { name: "name", type: "string", facet: false },
          { name: "year", type: "string", facet: false },
          { name: "type", type: "string", facet: true },
          { name: "description", type: "string", facet: false },
          { name: "numberOfSeats", type: "string", facet: false },
          { name: "transmissionType", type: "string", facet: true },
          { name: "fuelType", type: "string", facet: true },
          { name: "primaryImageUrl", type: "string", facet: false },
          {
            name: "manufacturer",
            type: "object",
            facet: false,
            fields: [{ name: "name", type: "string", facet: false }],
          },
        ],
      },
    ],
  };
  try {
    await client.collections().create(schema);
    console.log("Schema created successfully");
  } catch (error) {
    console.error("Error creating schema:", error);
  }
};

// createSchema()
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

export { client, createSchema, addcarToTypesense , deletecarFromTypesense };
