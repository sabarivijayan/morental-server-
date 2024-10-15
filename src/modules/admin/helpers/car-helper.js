import CarRepository from "../repositories/car-repositories.js";
import minioClient from "../../../config/minio.js";
import mime from "mime-types";

class CarHelper {
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
      const existingCar = await CarRepository.findCarByNameAndManufacturer(
        name,
        manufacturerId
      );
      if (existingCar) {
        throw new Error("Car already exists");
      }

      const primaryImageUrl = await this.uploadToMinio(
        primaryImage,
        `car/${name}/primary`
      );

      const secondaryImagesUrls = await Promise.all(
        secondaryImages.map((image) =>
          this.uploadToMinio(image, `car/${name}/secondary`)
        )
      );

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

  static async uploadToMinio(file, folder) {
    try {
      const { createReadStream, filename } = await file;
      const stream = createReadStream();
      const uniqueFilename = `${folder}/${filename}`;
      const contentType = mime.lookup(filename) || "application/octet-stream";

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

      const imageUrl = `http://localhost:9000/${process.env.MINIO_BUCKET_NAME}/${uniqueFilename}`;

      return imageUrl;
    } catch (error) {
      console.error("Error uploading image: ", error.message);
      throw new Error("Failed to upload image");
    }
  }

  static async getCars() {
    try {
      return await CarRepository.getAllCars();
    } catch (error) {
      console.error("Error fetching all cars: ", error.message);
      throw new Error("Failed to fetch all cars");
    }
  }

  static async deleteImageFromMinio(imageUrl) {
    try {
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

  static async deleteCarById(id) {
    try {
      const car = await CarRepository.getCarById(id);
      if (!car) {
        throw new Error("Car not found");
      }

      const deletedCar = await CarRepository.deleteCarById(id);

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

  static async getCarById(id) {
    try {
      const car = await CarRepository.getCarById(id);
      return car;
    } catch (error) {
      console.error("Error fetching Car:", error.message);
      throw new Error(error.message || "Failed to fetch Car");
    }
  }

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

      // Allow the update if the car we're updating has the same name and manufacturer (same ID)
      if (existingCar.status && (car.name !== name)) {
        throw new Error(
          "Car with the same name and manufacturer already exists"
        );
      }
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
