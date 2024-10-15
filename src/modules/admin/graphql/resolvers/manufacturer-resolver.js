import ManufacturerHelper from "../../helpers/manufacturer-helper.js";

const manufacturerResolver = {
  Query: {
    getManufacturers: async () => {
      try {
        return await ManufacturerHelper.getManufacturers();
      } catch (error) {
        throw new Error(error.message || 'Failed to fetch manufacturers');
      }
    },
    getManufacturer: async (_, { id }) => {
      try {
        return await ManufacturerHelper.getManufacturerById(id);
      } catch (error) {
        throw new Error(error.message || 'Failed to fetch manufacturer');
      }
    },
  },

  Mutation: {
    addManufacturer: async (_, { name, country }) => {
      try {
        return await ManufacturerHelper.addManufacturer(name, country);
      } catch (error) {
        console.error('Error in addManufacturer mutation: ', error);
        throw new Error(error.message || 'Failed to add manufacturer');
      }
    },

    editManufacturer: async (_, { id, name, country }) => {
      try {
        return await ManufacturerHelper.editManufacturer(id, name, country);
      } catch (error) {
        console.error('Error editing manufacturer: ', error);
        throw new Error(error.message || 'Failed to edit manufacturer');
      }
    },

    deleteManufacturer: async (_, { id }) => {
      try {
        return await ManufacturerHelper.deleteManufacturer(id);
      } catch (error) {
        console.error('Error in delete manufacturer mutation: ', error);
        throw new Error(error.message || 'Failed to delete manufacturer');
      }
    },
  },
};

export default manufacturerResolver;