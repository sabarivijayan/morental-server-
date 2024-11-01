import ManufacturerHelper from "../../helpers/manufacturer-helper.js";

// Define the resolver for manufacturer-related queries and mutations
const manufacturerResolver = {
  // Define the queries for retrieving manufacturer data
  Query: {
    // Retrieve a list of all manufacturers
    getManufacturers: async (_, { offset, limit }) => {
      try {
        return await ManufacturerHelper.getManufacturers(offset, limit);
      } catch (error) {
        throw new Error(error.message || 'Failed to fetch manufacturers');
      }
    },
    
    // Retrieve a single manufacturer by ID
    getManufacturer: async (_, { id }) => {
      try {
        // Call the helper function to fetch the manufacturer by ID
        return await ManufacturerHelper.getManufacturerById(id);
      } catch (error) {
        // Throw an error if the fetch operation fails
        throw new Error(error.message || 'Failed to fetch manufacturer');
      }
    },
  },
  
  // Define the mutations for creating, updating, and deleting manufacturers
  Mutation: {
    // Create a new manufacturer
    addManufacturer: async (_, { name, country }) => {
      try {
        // Call the helper function to add the manufacturer
        return await ManufacturerHelper.addManufacturer(name, country);
      } catch (error) {
        // Log the error and throw a new error
        console.error('Error in addManufacturer mutation: ', error);
        throw new Error(error.message || 'Failed to add manufacturer');
      }
    },
    
    // Update an existing manufacturer
    editManufacturer: async (_, { id, name, country }) => {
      try {
        // Call the helper function to edit the manufacturer
        return await ManufacturerHelper.editManufacturer(id, name, country);
      } catch (error) {
        // Log the error and throw a new error
        console.error('Error editing manufacturer: ', error);
        throw new Error(error.message || 'Failed to edit manufacturer');
      }
    },
    
    // Delete a manufacturer by ID
    deleteManufacturer: async (_, { id }) => {
      try {
        // Call the helper function to delete the manufacturer
        return await ManufacturerHelper.deleteManufacturer(id);
      } catch (error) {
        // Log the error and throw a new error
        console.error('Error in delete manufacturer mutation: ', error);
        throw new Error(error.message || 'Failed to delete manufacturer');
      }
    },
  },
};

// Export the manufacturer resolver
export default manufacturerResolver;