import sequelize from "../../../config/database.js";
import Car from "../../admin/models/car-model.js";
import Rentable from "../../admin/models/rentable-cars-model.js";
import { Model, DataTypes } from "sequelize";

class BookingCar extends Model {}

BookingCar.init({
    rentableId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Rentable,
            key: 'id'
        },
        onDelete: 'CASCADE',
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    pickUpDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    pickUpTime: {
        type: DataTypes.TIME,   // New field for pickup time
        allowNull: false,
    },
    dropOffDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    dropOffTime: {
        type: DataTypes.TIME,   // New field for drop-off time
        allowNull: false,
    },
    pickUpLocation: {
        type: DataTypes.STRING,  // New field for pickup location
        allowNull: false,
    },
    dropOffLocation: {
        type: DataTypes.STRING,  // New field for drop-off location
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'pending'
    },
    totalPrice: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    razorpayOrderId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    address: {
        type: DataTypes.STRING,  // Field for user's address
        allowNull: false,
    },
    phoneNumber: {
        type: DataTypes.STRING,  // Field for user's phone number
        allowNull: false,
    },
    deliveryDate:{
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
}, {
    sequelize,
    modelName: 'BookingCar',
});

BookingCar.belongsTo(Rentable, {
    foreignKey: 'carId',
    as: 'rentable',
});

export default BookingCar;
