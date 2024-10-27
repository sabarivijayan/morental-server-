import CarRepository from "../repositories/car-repositories.js";
import minioClient from "../../../config/minio.js";
import mime from "mime-types";

class CarHelper {
  // Creates a new car entry after validating that the car does not already exist
  static async createCar({
    name,
    description,
    type,
    quantity,
    numberOfSeats,
    transmissionType,
    fuelType,
    manufacturerId,
    primaryImage,
    secondaryImages,
    year,
  }) {
    try {
      // Check if a car with the same name and manufacturer exists
      const existingCar = await CarRepository.findCarByNameAndManufacturer(
        name,
        manufacturerId
      );
      if (existingCar) {
        throw new Error("Car already exists");
      }

      // Upload primary image to MinIO and get the URL
      const primaryImageUrl = await this.uploadToMinio(
        primaryImage,
        `car/${name}/primary`
      );

      // Upload all secondary images to MinIO and get their URLs
      const secondaryImagesUrls = await Promise.all(
        secondaryImages.map((image) =>
          this.uploadToMinio(image, `car/${name}/secondary`)
        )
      );

      // Create the car entry in the database
      const car = await CarRepository.createCar({
        manufacturerId,
        name,
        type,
        description,
        quantity,
        fuelType,
        numberOfSeats,
        transmissionType,
        primaryImageUrl,
        secondaryImagesUrls,
        year,
      });

      return car;
    } catch (error) {
      console.error("Error adding car: ", error.message);
      throw new Error(error.message || "Failed to add car");
    }
  }

  // Uploads an image to MinIO storage and returns the URL
  static async uploadToMinio(file, folder) {
    try {
      const { createReadStream, filename } = await file;
      const stream = createReadStream();
      const uniqueFilename = `${folder}/${filename}`;
      const contentType = mime.lookup(filename) || "application/octet-stream";

      // Upload the image to MinIO
      await new Promise((resolve, reject) => {
        minioClient.putObject(
          process.env.MINIO_BUCKET_NAME,
          uniqueFilename,
          stream,
          { "Content-Type": contentType },
          (error) => {
            if (error) {
              return reject(new Error("MinIO upload failed"));
            }
            resolve();
          }
        );
      });

      // Generate the URL for the uploaded image
      const imageUrl = `http://localhost:9000/${process.env.MINIO_BUCKET_NAME}/${uniqueFilename}`;

      return imageUrl;
    } catch (error) {
      console.error("Error uploading image: ", error.message);
      throw new Error("Failed to upload image");
    }
  }

  // Retrieves all cars from the database
  static async getCars() {
    try {
      return await CarRepository.getAllCars();
    } catch (error) {
      console.error("Error fetching all cars: ", error.message);
      throw new Error("Failed to fetch all cars");
    }
  }

  // Deletes an image from MinIO storage using its URL
  static async deleteImageFromMinio(imageUrl) {
    try {
      // Extract the file path from the image URL
      const filePath = imageUrl.replace(
        `http:localhost:9000/${process.env.MINIO_BUCKET_NAME}/`,
        ""
      );
      await new Promise((resolve, reject) => {
        minioClient.removeObject(
          process.env.MINIO_BUCKET_NAME,
          filePath,
          (error) => {
            if (error) {
              return reject(new Error("MinIO delete failed"));
            }
            resolve();
          }
        );
      });
    } catch (error) {
      console.error("Error deleting image from MinIO: ", error.message);
      throw new Error("Failed to delete image from MinIO");
    }
  }

  // Deletes a car by ID, including associated images from MinIO
  static async deleteCarById(id) {
    try {
      const car = await CarRepository.getCarById(id);
      if (!car) {
        throw new Error("Car not found");
      }

      // Delete car record from the database
      const deletedCar = await CarRepository.deleteCarById(id);

      // Delete primary and secondary images from MinIO
      await this.deleteImageFromMinio(car.primaryImageUrl);
      await Promise.all(
        car.secondaryImagesUrls.map((imageUrl) =>
          this.deleteImageFromMinio(imageUrl)
        )
      );

      return deletedCar;
    } catch (error) {
      console.error("Error deleting Car:", error.message);
      throw new Error(error.message || "Failed to delete Car");
    }
  }

  // Retrieves a car by its ID
  static async getCarById(id) {
    try {
      const car = await CarRepository.getCarById(id);
      return car;
    } catch (error) {
      console.error("Error fetching Car:", error.message);
      throw new Error(error.message || "Failed to fetch Car");
    }
  }

  // Updates a car's details, including images if new ones are provided
  static async updateCar({
    id,
    name,
    type,
    description,
    fuelType,
    numberOfSeats,
    transmissionType,
    quantity,
    primaryImage,
    secondaryImages,
    year,
  }) {
    try {
      const car = await CarRepository.getCarById(id);
      if (!car) {
        throw new Error("Car not found");
      }

      // Check if a car with the same name and manufacturer exists
      const existingCar = await CarRepository.findCarByNameAndManufacturer(
        name
      );

      // Prevent update if another car with the same name and manufacturer exists
      if (existingCar.status && (car.name !== name)) {
        throw new Error(
          "Car with the same name and manufacturer already exists"
        );
      }
      
      // Update images if new ones are provided
      let primaryImageUrl = car.primaryImageUrl;
      let secondaryImagesUrls = car.secondaryImagesUrls;

      if (primaryImage) {
        primaryImageUrl = await this.uploadToMinio(
          primaryImage,
          `car/${name}/primary`
        );
      }

      if (secondaryImages && secondaryImages.length > 0) {
        secondaryImagesUrls = await Promise.all(
          secondaryImages.map((image) =>
            this.uploadToMinio(image, `car/${name}/secondary`)
          )
        );
      }

      // Update car record in the database
      const updateCar = await CarRepository.updateCarById(id, {
        name,
        type,
        description,
        fuelType,
        numberOfSeats,
        transmissionType,
        quantity,
        primaryImageUrl,
        secondaryImagesUrls,
        year,
      });
      return updateCar;
    } catch (error) {
      throw new Error(error.message || "Failed to update car");
    }
  }
}

export default CarHelper;
