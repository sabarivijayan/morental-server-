export const carValidator = (input) => {
    const errors = [];
  
    if (!input.name) errors.push('Name is required');
    if (!input.description) errors.push('Description is required');
    if (!input.price || isNaN(input.price)) errors.push('Valid price is required');
    if (!input.primaryImage) errors.push('Primary image is required');
    if (input.otherImages && !Array.isArray(input.otherImages)) errors.push('Other images must be an array');
    if (!input.quantity || isNaN(input.quantity)) errors.push('Valid quantity is required');
  
    return errors;
  };
  