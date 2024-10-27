import ManufacturerRepository from '../repositories/manufacturer-repository.js';

class ManufacturerHelper {
  // Adds a new manufacturer if one with the same name doesn't already exist
  static async addManufacturer(name, country) {
    try {
      // Check if the manufacturer already exists by name
      const existingManufacturer = await ManufacturerRepository.findManufacturerByName(name);
      if (existingManufacturer) {
        throw new Error('Manufacturer with the same name already exists'); // Throw an error if manufacturer exists
      }

      // Create manufacturer with provided name and country
      const manufacturer = await ManufacturerRepository.createManufacturer({
        name,
        country,
      });

      return manufacturer; // Return the created manufacturer
    } catch (error) {
      console.error('Error adding manufacturer:', error); // Log the error
      throw new Error(error.message || 'Failed to add manufacturer'); // Rethrow error with a message
    }
  }

  // Retrieves a list of all manufacturers
  static async getManufacturers() {
    try {
      return await ManufacturerRepository.findAll(); // Fetch and return all manufacturers
    } catch (error) {
      console.error('Error fetching manufacturers:', error); // Log the error
      throw new Error('Failed to fetch manufacturers'); // Rethrow error with a message
    }
  }

  // Retrieves a manufacturer by its unique ID
  static async getManufacturerById(id) {
    try {
      return await ManufacturerRepository.findManufacturerById(id); // Fetch and return manufacturer by ID
    } catch (error) {
      console.error('Error fetching manufacturer by ID:', error); // Log the error
      throw new Error('Failed to fetch manufacturer'); // Rethrow error with a message
    }
  }

  // Edits an existing manufacturer's information based on its ID
  static async editManufacturer(id, name, country) {
    try {
      // Check if the manufacturer exists
      const existingManufacturer = await ManufacturerRepository.findManufacturerById(id);
      if (!existingManufacturer) {
        throw new Error('Manufacturer not found'); // Throw an error if the manufacturer doesn't exist
      }

      // Update manufacturer with new name and country
      const updatedManufacturer = await ManufacturerRepository.updateManufacturer(id, {
        name,
        country,
      });

      return updatedManufacturer; // Return the updated manufacturer
    } catch (error) {
      console.error('Error editing manufacturer:', error); // Log the error
      throw new Error(error.message || 'Failed to edit manufacturer'); // Rethrow error with a message
    }
  }

  // Deletes a manufacturer based on its ID
  static async deleteManufacturer(id) {
    try {
      const result = await ManufacturerRepository.deleteManufacturer(id); // Attempt to delete the manufacturer
      return result; // Return the result of the deletion
    } catch (error) {
      console.error('Error deleting manufacturer:', error); // Log the error
      throw new Error('Failed to delete manufacturer'); // Rethrow error with a message
    }
  }
}

export default ManufacturerHelper;
