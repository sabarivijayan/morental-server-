// typesenseClient.ts
import Typesense from "typesense";

// Create a client instance for Typesense
const client = new Typesense.Client({
  nodes: [
    {
      host: "43gi25mdsbj89cqrp-1.a1.typesense.net", // Typesense server host
      port: 443,        // Typesense server port
      protocol: "https",  // Use http or https based on your setup
    },
  ],
  apiKey: "hgnXF3dYPa3Pumq8G06vRA0lWND1YNbY",      // Your API key (same as used in the server)
  connectionTimeoutSeconds: 2,  // Connection timeout in seconds
});


const createSchema = async () => {
    const schema = {
        name: "cars",
        nested_fields_enabled: true,
        fields:[
            {name: 'id', type: 'string', facet: false},
            {name: 'pricePerDay', type: 'int32', facet: true},
            {name: 'availableQuantity', type: 'int32', facet: false},
            {name: 'car', type: 'object', facet: false, fields: [
                {name: 'name', type: 'string', facet: false},
                {name: 'year', type: 'string', facet: false},
                {name: 'type', type: 'string', facet: false},
                {name: 'description', type: 'string', facet: false},
                {name: 'numberOfSeats', type: 'string', facet: false},
                {name: 'transmissionType', type: 'string', facet: false},
                {name: 'fuelType', type: 'string', facet: false},
                {name: 'primaryImageUrl', type: 'string', facet: false},
                {name: 'manufacturer', type: 'object', facet: false, fields:[
                    {name: 'name', type: 'string', facet: false},
                ]},
            ]},
        ],
    };
    try {
        await client.collections().create(schema);
        console.log("Schema created successfully");
    } catch (error) {
        console.error("Error creating schema:", error);
    }
};

//createSchema()
export  {client, createSchema};